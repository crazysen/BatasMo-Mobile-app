import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

// Reusable Status Badge Component
const Badge = ({ text, type }) => {
  const styles = badgeStyles[type] || badgeStyles.default;
  return (
    <View style={[styles.container, { marginLeft: 6 }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

// Main Appointment Card Component
const AppointmentCard = ({ data, children }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.lawyerName}>{data.name}</Text>
        <Text style={styles.specialty}>{data.specialty}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Badge text={data.status} type={data.status} />
        <Badge text={data.payment} type={data.payment} />
      </View>
    </View>

    <View style={styles.detailsGrid}>
      <View style={styles.detailItem}>
        <Text style={styles.detailIcon}>📅</Text>
        <Text style={styles.detailText}>{data.date}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailIcon}>🕒</Text>
        <Text style={styles.detailText}>{data.time}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailIcon}>📍</Text>
        <Text style={styles.detailText}>{data.location}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailIcon}>$</Text>
        <Text style={styles.detailTextBold}>{data.price}</Text>
      </View>
    </View>

    {children}

    <TouchableOpacity style={styles.rescheduleButton}>
      <Text style={styles.rescheduleText}>Reschedule</Text>
    </TouchableOpacity>
  </View>
);

const AppointmentsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.screenTitle}>My Appointments</Text>
        <Text style={styles.screenSubtitle}>Manage and track all your appointments</Text>

        {/* Top Summary Filters */}
        <View style={styles.filterRow}>
          <View style={[styles.filterChip, { backgroundColor: '#FEF9C3' }]}>
            <Text style={{ color: '#854D0E' }}>Pending: 1</Text>
          </View>
          <View style={[styles.filterChip, { backgroundColor: '#1E293B' }]}>
            <Text style={{ color: '#FFFFFF' }}>Approved: 2</Text>
          </View>
          <View style={[styles.filterChip, { backgroundColor: '#DCFCE7' }]}>
            <Text style={{ color: '#166534' }}>Completed: 1</Text>
          </View>
        </View>

        {/* Example 1: Approved & Paid */}
        <AppointmentCard 
          data={{
            name: 'Dr. Sarah Johnson',
            specialty: 'Corporate Law',
            status: 'APPROVED',
            payment: 'PAID',
            date: 'Feb 17, 2026',
            time: '10:00 AM',
            location: 'Office Room 301',
            price: '150.00'
          }}
        >
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>💬 Enter Consultation</Text>
          </TouchableOpacity>
        </AppointmentCard>

        {/* Example 2: Approved but Unpaid with Info Box */}
        <AppointmentCard 
          data={{
            name: 'Mr. Michael Chen',
            specialty: 'Family Law',
            status: 'APPROVED',
            payment: 'UNPAID',
            date: 'Feb 20, 2026',
            time: '2:00 PM',
            location: 'Office Room 205',
            price: '120.00'
          }}
        >
          <View style={styles.infoBoxBlue}>
            <Text style={styles.infoTitleBlue}>Consultation Approved - Payment Required</Text>
            <Text style={styles.infoSubBlue}>Your consultation has been approved. Please proceed with payment to confirm.</Text>
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>$ Proceed to Payment</Text>
            </TouchableOpacity>
          </View>
        </AppointmentCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const badgeStyles = {
  APPROVED: StyleSheet.create({ container: { backgroundColor: '#1E293B', padding: 4, borderRadius: 4 }, text: { color: 'white', fontSize: 10, fontWeight: 'bold' } }),
  PAID: StyleSheet.create({ container: { backgroundColor: '#D97706', padding: 4, borderRadius: 4 }, text: { color: 'white', fontSize: 10, fontWeight: 'bold' } }),
  UNPAID: StyleSheet.create({ container: { backgroundColor: '#FCE7F3', padding: 4, borderRadius: 4 }, text: { color: '#BE185D', fontSize: 10, fontWeight: 'bold' } }),
  PENDING: StyleSheet.create({ container: { backgroundColor: '#FEF9C3', padding: 4, borderRadius: 4 }, text: { color: '#854D0E', fontSize: 10, fontWeight: 'bold' } }),
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: '#0F172A' },
  screenSubtitle: { color: '#64748B', marginBottom: 16 },
  filterRow: { flexDirection: 'row', marginBottom: 24 },
  filterChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  lawyerName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  specialty: { color: '#64748B', fontSize: 14 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  detailItem: { width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  detailIcon: { marginRight: 8, fontSize: 14 },
  detailText: { color: '#64748B', fontSize: 13 },
  detailTextBold: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 },
  rescheduleButton: { backgroundColor: '#D9B041', paddingVertical: 12, borderRadius: 8, marginTop: 12 },
  rescheduleText: { textAlign: 'center', color: 'white', fontWeight: 'bold' },
  actionButton: { backgroundColor: '#1E293B', paddingVertical: 12, borderRadius: 8, marginBottom: 8 },
  actionButtonText: { textAlign: 'center', color: 'white', fontWeight: 'bold' },
  infoBoxBlue: { backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, marginBottom: 12 },
  infoTitleBlue: { color: '#1E40AF', fontWeight: 'bold', marginBottom: 4 },
  infoSubBlue: { color: '#3B82F6', fontSize: 12, marginBottom: 12 },
  payButton: { backgroundColor: '#1E293B', padding: 10, borderRadius: 6 },
  payButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 12 }
});

export default AppointmentsScreen;