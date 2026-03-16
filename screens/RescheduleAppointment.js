import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function RescheduleAppointment({navigation, route}) {
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'];
  const appointment = route?.params?.appointment || { name: 'Dr. Sarah Johnson', date: 'Feb 17', time: '10:00 AM' };

  const handleConfirm = () => {
    navigation.navigate('MyAppointments');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <View style={styles.dragHandle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Reschedule Appointment</Text>

          <View style={styles.infoBanner}>
            <Text style={styles.infoIcon}>ⓘ</Text>
            <Text style={styles.infoBannerText}>
              With {appointment.name} • {appointment.date}, {appointment.time}
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Select New Date</Text>
          <TouchableOpacity style={styles.datePicker}>
            <Text style={styles.dateText}>Feb 24, 2026</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>Select New Time Slot</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => setSelectedTime(time)}
                style={[
                  styles.timeChip,
                  selectedTime === time && styles.timeChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.timeChipText,
                    selectedTime === time && styles.timeChipTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Reason for Rescheduling (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. Schedule conflict, family emergency..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />

          <View style={styles.policyBox}>
            <Text style={styles.policyIcon}>ⓘ</Text>
            <Text style={styles.policyText}>
              Note: Rescheduling is subject to attorney availability and may require 24h notice.
            </Text>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm Reschedule</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  dragHandle: {
    width: 45,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    marginBottom: 24,
  },
  infoIcon: { marginRight: 8, color: '#64748B' },
  infoBannerText: { color: '#64748B', fontSize: 14 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
  },
  dateText: { fontSize: 16, color: '#0F172A' },
  calendarIcon: { fontSize: 16 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  timeChip: {
    width: '31%',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginRight: '2%',
  },
  timeChipSelected: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
  timeChipText: { color: '#1E293B', fontWeight: '500' },
  timeChipTextSelected: { color: 'white' },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
    color: '#0F172A',
  },
  policyBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  policyIcon: { color: '#2563EB', fontWeight: 'bold', marginRight: 10 },
  policyText: { color: '#2563EB', fontSize: 13, flex: 1, fontWeight: '600', lineHeight: 18 },
  confirmButton: {
    backgroundColor: '#EAB308',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#EAB308',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  confirmButtonText: { color: '#0F172A', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  cancelButton: {
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: { color: '#64748B', textAlign: 'center', fontWeight: '600' },
});
