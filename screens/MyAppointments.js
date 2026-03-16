import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const appointments = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Corporate Law',
    status: 'APPROVED',
    payment: 'PAID',
    date: 'Feb 17, 2026',
    time: '10:00 AM',
    location: 'Office Room 301',
  },
  {
    id: '2',
    name: 'Mr. Michael Chen',
    specialty: 'Family Law',
    status: 'APPROVED',
    payment: 'UNPAID',
    date: 'Feb 20, 2026',
    time: '2:00 PM',
    location: 'Office Room 205',
  },
];

export default function MyAppointments({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.screenTitle}>My Appointments</Text>
        <Text style={styles.screenSubtitle}>Manage and track all your appointments</Text>

        {appointments.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.lawyerName}>{item.name}</Text>
                <Text style={styles.specialty}>{item.specialty}</Text>
              </View>
              <View style={styles.badgeRow}>
                <View style={styles.badgeDark}>
                  <Text style={styles.badgeDarkText}>{item.status}</Text>
                </View>
                <View
                  style={[
                    styles.badgeLight,
                    item.payment === 'PAID' ? styles.badgePaid : styles.badgeUnpaid,
                  ]}>
                  <Text
                    style={[
                      styles.badgeLightText,
                      item.payment === 'PAID' ? styles.badgePaidText : styles.badgeUnpaidText,
                    ]}>
                    {item.payment}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.detailText}>📅 {item.date}</Text>
            <Text style={styles.detailText}>🕒 {item.time}</Text>
            <Text style={styles.detailText}>📍 {item.location}</Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                navigation.navigate('EnterConsultationChat', {
                  chatName: item.name,
                  initials: item.name
                    .split(' ')
                    .map(part => part[0])
                    .join('')
                    .slice(0, 2),
                })
              }>
              <Text style={styles.primaryButtonText}>Enter Consultation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('RescheduleAppointment', { appointment: item })}>
              <Text style={styles.secondaryButtonText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  content: {padding: 20, paddingBottom: 32},
  backButton: {alignSelf: 'flex-start', marginBottom: 10},
  backText: {color: '#EAB308', fontWeight: '700', fontSize: 16},
  screenTitle: {fontSize: 28, fontWeight: 'bold', color: '#0F172A'},
  screenSubtitle: {color: '#64748B', marginBottom: 16},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10},
  lawyerName: {fontSize: 18, fontWeight: '700', color: '#0F172A'},
  specialty: {fontSize: 13, color: '#64748B'},
  badgeRow: {flexDirection: 'row'},
  badgeDark: {backgroundColor: '#1E293B', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 6},
  badgeDarkText: {color: '#FFFFFF', fontSize: 10, fontWeight: '700'},
  badgeLight: {borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 6},
  badgePaid: {backgroundColor: '#FDE68A'},
  badgeUnpaid: {backgroundColor: '#FCE7F3'},
  badgeLightText: {fontSize: 10, fontWeight: '700'},
  badgePaidText: {color: '#854D0E'},
  badgeUnpaidText: {color: '#BE185D'},
  detailText: {color: '#475569', marginBottom: 4},
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {color: '#FFFFFF', fontWeight: '700'},
  secondaryButton: {
    marginTop: 10,
    backgroundColor: '#EAB308',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {color: '#FFFFFF', fontWeight: '700'},
});

