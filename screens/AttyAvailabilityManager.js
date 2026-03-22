import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUserProfile } from '../context/UserProfileContext';
import { getAvailability, setAvailability } from '../services/appointmentService';

const ChevronLeft = (props) => <MaterialCommunityIcons name="chevron-left" {...props} />;
const CalendarIcon = (props) => <MaterialCommunityIcons name="calendar" {...props} />;
const CheckCircle = (props) => <MaterialCommunityIcons name="check-circle" {...props} />;

const ALL_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM'
];

export default function AvailabilityManager({ navigation }) {
  const { profile } = useUserProfile();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSlots, setActiveSlots] = useState([]);

  const formattedDate = selectedDate.toISOString().split('T')[0];

  const fetchSlots = useCallback(async () => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      const slots = await getAvailability(profile.id, formattedDate);
      const mapped = slots.map(s => s.time);
      setActiveSlots(mapped);
    } catch (e) {
      Alert.alert('Error', 'Failed to load availability for this date.');
    } finally {
      setLoading(false);
    }
  }, [profile?.id, formattedDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const toggleSlot = (time) => {
    setActiveSlots(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await setAvailability(formattedDate, activeSlots);
      Alert.alert('Success', 'Availability saved for ' + formattedDate);
    } catch (e) {
      console.error('Save availability error:', e);
      Alert.alert('Error', `Failed to save: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const onChangeDate = (event, date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
          <ChevronLeft color="#1a2b5d" size={28} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Availability Manager</Text>
          <Text style={styles.headerSub}>BATASMO PROFESSIONAL NETWORK</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Text style={styles.subText}>Pick a date to set your availability.</Text>
          
          <TouchableOpacity style={styles.dateSelector} onPress={() => setShowPicker(true)}>
            <CalendarIcon size={24} color="#3b82f6" />
            <Text style={styles.dateSelectorText}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </TouchableOpacity>

          {(showPicker || Platform.OS === 'ios') && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}

          {Platform.OS === 'ios' && showPicker && (
            <TouchableOpacity style={styles.iosConfirm} onPress={() => setShowPicker(false)}>
              <Text style={styles.iosConfirmText}>Confirm Date</Text>
            </TouchableOpacity>
          )}

        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          <Text style={styles.subText}>Tap to toggle slots for {formattedDate}.</Text>

          {loading ? (
            <View style={styles.loaderArea}>
              <ActivityIndicator size="large" color="#001d57" />
              <Text style={styles.loaderText}>Loading slots...</Text>
            </View>
          ) : (
            <View style={styles.slotsGrid}>
              {ALL_SLOTS.map((time) => {
                const isSelected = activeSlots.includes(time);
                return (
                  <TouchableOpacity 
                    key={time} 
                    style={[styles.slotItem, isSelected && styles.slotItemActive]}
                    onPress={() => toggleSlot(time)}
                  >
                    <Text style={[styles.slotText, isSelected && styles.slotTextActive]}>{time}</Text>
                    {isSelected && <CheckCircle size={14} color="#fff" style={{ marginLeft: 4 }} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving || loading}>
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f5f7' },
  header: { 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#001d57', marginLeft: 10 },
  headerSub: { fontSize: 10, color: '#999', marginLeft: 10, letterSpacing: 0.5 },
  scrollContent: { padding: 16 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#001d57' },
  subText: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 15 },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 5,
  },
  dateSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginLeft: 10,
  },
  iosConfirm: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  iosConfirmText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  loaderArea: {
    padding: 40,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#666',
  },
  slotsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  slotItem: { 
    width: '31%', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    paddingVertical: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  slotItemActive: {
    backgroundColor: '#001d57',
    borderColor: '#001d57',
  },
  slotText: { fontWeight: '600', color: '#555', fontSize: 12 },
  slotTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: '#001d57', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
