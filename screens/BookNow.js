import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAvailability } from '../services/appointmentService';

export default function BookNow({navigation, route}) {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const slotsRequestId = useRef(0);

  const [reason, setReason] = useState('');
  const attorney = route?.params?.attorney || { name: 'Dr. Sarah Johnson', specialty: 'Corporate Law', price: '₱2,500.00' };

  const localDateStr = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  const fetchAvailableSlots = useCallback(async () => {
    if (!attorney?.id) return;
    const reqId = ++slotsRequestId.current;
    try {
      setLoadingSlots(true);
      setSelectedTime(null);
      const slots = await getAvailability(attorney.id, localDateStr);
      if (reqId !== slotsRequestId.current) {
        return;
      }

      const now = new Date();

      const availableTimeStrings = slots.map(s => s.time).filter(timeStr => {
        const [time, modifier] = String(timeStr).split(' ');
        const [rawHour, rawMinute] = time.split(':');
        let hour = Number(rawHour);
        if (modifier === 'PM' && hour < 12) hour += 12;
        if (modifier === 'AM' && hour === 12) hour = 0;

        const slotDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          hour,
          Number(rawMinute),
          0,
        );
        return slotDate > now;
      });

      setAvailableSlots(availableTimeStrings);
    } catch (error) {
      if (reqId === slotsRequestId.current) {
        Alert.alert('Error', 'Failed to load available slots.');
      }
    } finally {
      if (reqId === slotsRequestId.current) {
        setLoadingSlots(false);
      }
    }
  }, [attorney?.id, localDateStr, selectedDate]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  const handleSubmit = () => {
    if (!attorney?.id) {
      Alert.alert('Error', 'Please select an attorney from the list first.');
      return;
    }

    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot.');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Error', 'Please describe your legal concern.');
      return;
    }

    const [time, modifier] = selectedTime.split(' ');
    const [rawHour, rawMinute] = time.split(':');
    let hour = Number(rawHour);
    if (modifier === 'PM' && hour < 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;
    
    // Create a local Date object instead of a UTC string to prevent timezone shifting
    const localAppointmentDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hour,
      Number(rawMinute),
      0
    );
    const scheduleDateTime = localAppointmentDate.toISOString();

    // Instead of creating appointment, pass to Payment
    navigation.navigate('Payment', {
      paymentMethod: 'gcash',
      paymentContext: {
        sourceType: 'appointment_booking',
        payload: {
          attorney_id: attorney.id,
          title: `Consultation - ${attorney.specialty ?? 'General'}`,
          notes: reason.trim(),
          scheduled_at: scheduleDateTime,
          slot_time: selectedTime,
          slot_date: localDateStr,
          amount: Number(String(attorney.price || '').replace(/[^\d.]/g, '')) || 2500,
        }
      },
      serviceData: { amount: attorney.price || '₱2,500.00' }
    });
  };

  const handleCancel = () => {
    navigation.canGoBack() ? navigation.goBack() : null;
  };

  const onChangeDateAndroid = (event, date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event?.type === 'dismissed') {
        return;
      }
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Book an Appointment</Text>
        <Text style={styles.headerSubtitle}>Choose from available slots</Text>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Complete Your Booking</Text>

          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Attorney:</Text>
              <Text style={styles.summaryValue}>{attorney.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fee:</Text>
              <Text style={styles.feeValue}>{attorney.price}</Text>
            </View>
          </View>

          <Text style={styles.inputLabel}>📅 Select Date</Text>
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowPicker(true)}>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' ? (
            <Modal
              visible={showPicker}
              animationType="slide"
              transparent
              onRequestClose={() => setShowPicker(false)}>
              <View style={styles.dateModalRoot}>
                <TouchableOpacity
                  style={styles.dateModalBackdrop}
                  activeOpacity={1}
                  onPress={() => setShowPicker(false)}
                />
                <View style={styles.dateModalSheet}>
                  <View style={styles.dateModalHeader}>
                    <TouchableOpacity
                      onPress={() => setShowPicker(false)}
                      hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
                      <Text style={styles.dateModalCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.dateModalTitle}>Select date</Text>
                    <TouchableOpacity
                      onPress={() => setShowPicker(false)}
                      hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
                      <Text style={styles.dateModalDone}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="inline"
                    onChange={(_, date) => {
                      if (date) {
                        setSelectedDate(date);
                      }
                    }}
                    minimumDate={new Date()}
                    themeVariant="light"
                  />
                </View>
              </View>
            </Modal>
          ) : (
            showPicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onChangeDateAndroid}
                minimumDate={new Date()}
              />
            )
          )}

          <Text style={styles.inputLabel}>🕒 Select Available Slot</Text>
          
          {loadingSlots ? (
            <View style={{marginBottom: 20}}>
              <ActivityIndicator size="small" color="#0F172A" />
              <Text style={styles.loadingSlotsHint}>Loading available times…</Text>
            </View>
          ) : availableSlots.length === 0 ? (
            <Text style={styles.noSlotsText}>No availability for this date.</Text>
          ) : (
            <View style={styles.timeGrid}>
              {availableSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={[
                    styles.timeChip,
                    selectedTime === time && styles.timeChipSelected
                  ]}
                >
                  <Text style={[
                    styles.timeChipText,
                    selectedTime === time && styles.timeChipTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.inputLabel}>Reason for Consultation</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Please briefly describe your legal matter..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
          />

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              <Text style={{ fontWeight: 'bold' }}>Payment First:</Text> Your consultation slot is only confirmed and blocked off after successful payment.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (loadingSlots || !selectedTime || !reason.trim()) && styles.submitDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loadingSlots || !selectedTime || !reason.trim()}>
            <Text style={styles.submitButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20 },
  backButton: { marginBottom: 10 },
  backIcon: { fontSize: 32, color: '#0F172A' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#0F172A' },
  headerSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  formCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 15,
    elevation: 2 
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginBottom: 20 },
  summaryBox: { 
    backgroundColor: '#F8FAFC', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 24 
  },
  summaryRow: { flexDirection: 'row', marginBottom: 8 },
  summaryLabel: { fontSize: 14, fontWeight: 'bold', color: '#475569', width: 80 },
  summaryValue: { fontSize: 14, color: '#475569', flex: 1 },
  feeValue: { fontSize: 14, fontWeight: 'bold', color: '#D97706' },
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 12 },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#eff6ff',
  },
  dateText: { fontSize: 15, color: '#1e3a8a', fontWeight: '500' },
  calendarIcon: { fontSize: 16, color: '#64748B' },
  dateModalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dateModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  dateModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  dateModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  dateModalTitle: {fontSize: 16, fontWeight: '600', color: '#0F172A'},
  dateModalCancel: {fontSize: 16, color: '#64748B'},
  dateModalDone: {fontSize: 16, fontWeight: '700', color: '#2563EB'},
  
  loadingSlotsHint: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  noSlotsText: { color: '#EF4444', marginBottom: 20, fontStyle: 'italic', fontSize: 13 },
  
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  timeChip: {
    width: '30%',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  timeChipSelected: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  timeChipText: { color: '#0F172A', fontWeight: '600', fontSize: 12 },
  timeChipTextSelected: { color: 'white' },
  
  textArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
    color: '#0F172A',
  },
  noteBox: { 
    backgroundColor: '#EFF6FF', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 24 
  },
  noteText: { color: '#1E40AF', fontSize: 13, lineHeight: 18 },
  submitButton: { 
    backgroundColor: '#0F172A', 
    paddingVertical: 16, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  submitDisabled: { backgroundColor: '#94A3B8' },
  submitButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { 
    paddingVertical: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  cancelButtonText: { color: '#64748B', textAlign: 'center', fontWeight: '600' },
});

