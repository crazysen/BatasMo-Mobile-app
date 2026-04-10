import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { ChevronLeft, ChevronRight, Clock, Plus, CheckCircle2 } from 'lucide-react-native';

const AvailabilityManager = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(15);

  const dates = [
    { day: 'SUN', date: 15, active: true },
    { day: 'MON', date: 16 },
    { day: 'TUE', date: 17 },
    { day: 'WED', date: 18 },
    { day: 'THU', date: 19 },
  ];

  const slots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const weeklyHours = [
    { day: 'Monday', range: '09:00 AM - 05:00 PM' },
    { day: 'Tuesday', range: '09:00 AM - 05:00 PM' },
    { day: 'Wednesday', range: '09:00 AM - 05:00 PM' },
    { day: 'Thursday', range: '09:00 AM - 05:00 PM' },
    { day: 'Friday', range: '09:00 AM - 05:00 PM' },
  ];

  const handleSave = () => {
    // Save availability logic here
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color="#1a2b5d" size={28} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Availability Manager</Text>
          <Text style={styles.headerSub}>BATASMO PROFESSIONAL NETWORK</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Date Selector Card */}
        <View style={styles.card}>
          <View style={styles.monthHeader}>
            <Text style={styles.sectionTitle}>October 2024</Text>
            <View style={styles.navArrows}>
              <TouchableOpacity style={styles.arrowBtn}><ChevronLeft size={18} color="#999" /></TouchableOpacity>
              <TouchableOpacity style={styles.arrowBtn}><ChevronRight size={18} color="#999" /></TouchableOpacity>
            </View>
          </View>

          <View style={styles.dateStrip}>
            {dates.map((item) => (
              <TouchableOpacity 
                key={item.date} 
                style={[styles.dateBox, item.date === selectedDate && styles.activeDateBox]}
                onPress={() => setSelectedDate(item.date)}
              >
                <Text style={[styles.dayText, item.date === selectedDate && styles.activeText]}>{item.day}</Text>
                <Text style={[styles.dateNumber, item.date === selectedDate && styles.activeText]}>{item.date}</Text>
                {item.date === selectedDate && <View style={styles.dot} />}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Available Slots Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          <Text style={styles.subText}>Clients can book these time slots.</Text>
          <TouchableOpacity><Text style={styles.addBulkText}>+ Add Bulk Slots</Text></TouchableOpacity>

          <View style={styles.slotsGrid}>
            {slots.map((time, index) => (
              <View key={index} style={styles.slotItem}>
                <Clock size={16} color="#666" style={{ marginRight: 8 }} />
                <Text style={styles.slotText}>{time}</Text>
              </View>
            ))}
            <TouchableOpacity style={[styles.slotItem, styles.newSlotItem]}>
              <Plus size={16} color="#666" />
              <Text style={styles.newSlotText}>New Slot</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Hours Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Typical Weekly Hours</Text>
          <View style={{ marginTop: 15 }}>
            {weeklyHours.map((item, index) => (
              <View key={index} style={styles.weeklyRow}>
                <View style={styles.dayCheck}>
                  <CheckCircle2 size={22} color="#001d57" fill="#001d57" />
                  <Text style={styles.dayLabel}>{item.day}</Text>
                </View>
                <Text style={styles.timeRange}>{item.range}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

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
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  navArrows: { flexDirection: 'row' },
  arrowBtn: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 4, marginLeft: 8 },
  dateStrip: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  dateBox: { 
    alignItems: 'center', 
    padding: 10, 
    borderRadius: 12, 
    width: '18%', 
    backgroundColor: '#fff' 
  },
  activeDateBox: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#3b82f6' },
  dayText: { fontSize: 12, color: '#999', fontWeight: '600' },
  dateNumber: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 4 },
  activeText: { color: '#2563eb' },
  dot: { width: 4, height: 4, backgroundColor: '#facc15', borderRadius: 2, marginTop: 4 },
  saveBtn: { backgroundColor: '#001d57', padding: 15, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  subText: { fontSize: 13, color: '#888', marginTop: 4 },
  addBulkText: { color: '#eab308', fontWeight: 'bold', fontSize: 14, marginTop: 10, marginBottom: 20 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slotItem: { 
    width: '48%', 
    borderWidth: 1, 
    borderColor: '#eee', 
    borderStyle: 'dashed', 
    borderRadius: 10, 
    padding: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12 
  },
  slotText: { fontWeight: '600', color: '#333' },
  newSlotItem: { backgroundColor: '#f9fafb' },
  newSlotText: { color: '#666', fontSize: 13, marginLeft: 5 },
  weeklyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  dayCheck: { flexDirection: 'row', alignItems: 'center' },
  dayLabel: { marginLeft: 10, color: '#333', fontWeight: '500' },
  timeRange: { color: '#888', fontSize: 13 }
});

export default AvailabilityManager;