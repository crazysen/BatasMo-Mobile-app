import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';

const BookAppointment = () => {
  const [selectedTime, setSelectedTime] = useState('12:00 PM');

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM',
    '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Book an Appointment</Text>
        <Text style={styles.headerSubtitle}>Choose from our experienced attorneys</Text>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Complete Your Booking</Text>

          {/* Attorney Summary Box */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Attorney:</Text>
              <Text style={styles.summaryValue}>Dr. Sarah Johnson</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Specialty:</Text>
              <Text style={styles.summaryValue}>Corporate Law</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fee:</Text>
              <Text style={styles.feeValue}>$150.00</Text>
            </View>
          </View>

          {/* Select Date */}
          <Text style={styles.inputLabel}>📅 Select Date</Text>
          <TouchableOpacity style={styles.datePicker}>
            <Text style={styles.dateText}>17/02/2026</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>

          {/* Select Time Slot */}
          <Text style={styles.inputLabel}>🕒 Select Time Slot</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
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

          {/* Reason for Consultation */}
          <Text style={styles.inputLabel}>Reason for Consultation</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Please briefly describe your legal matter..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />

          {/* Note Box */}
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              <Text style={{ fontWeight: 'bold' }}>Instant Booking:</Text> Your consultation slot will be instantly confirmed and blocked once payment is successful. No attorney approval is needed.
            </Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20 },
  backButton: { marginBottom: 10 },
  backIcon: { fontSize: 32, color: '#0F172A' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#0F172A', fontFamily: 'serif' },
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
    marginBottom: 24,
  },
  dateText: { fontSize: 14, color: '#475569' },
  calendarIcon: { fontSize: 16, color: '#64748B' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  timeChip: {
    width: '31%',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
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
  submitButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { 
    paddingVertical: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  cancelButtonText: { color: '#64748B', textAlign: 'center', fontWeight: '600' },
});

export default BookAppointment;