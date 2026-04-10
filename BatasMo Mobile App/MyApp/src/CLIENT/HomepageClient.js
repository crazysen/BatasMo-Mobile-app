// ClientDashboard.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialSymbols from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const ClientDashboard = ({ navigation }) => {
  const appointments = [
    {
      title: 'Property Dispute',
      attorney: 'ATTY. CLARA SANTOS',
      type: 'Consultation',
      date: '2026-02-24',
      time: '10:00',
      law: 'CIVIL LAW',
      status: 'Approved',
      payment: true,
    },
    {
      title: 'Property Title Verification',
      attorney: 'ATTY. CLARA SANTOS',
      type: 'Consultation',
      date: '2026-02-24',
      time: '10:00 AM',
      law: 'CIVIL LAW',
      status: 'Approved',
      payment: true,
    },
    {
      title: 'Deed of Sale Notarization',
      attorney: 'ATTY. MARK REYES',
      type: 'Notarial',
      date: '2026-02-24',
      time: '2:30 PM',
      law: 'CORPORATE LAW',
      status: 'Payment Confirmed',
      payment: false,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton}>
          <MaterialIcons name="menu" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.navButton}>
            <MaterialIcons name="notifications" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.navAvatar}>
            <Text style={styles.navAvatarText}>AJ</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Welcome */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome Back, Client</Text>
          <Text style={styles.headerSubtitle}>
            Here's what's happening with your legal matters today.
          </Text>
        </View>

        {/* Action Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <MaterialIcons name="calendar-today" size={28} color="#0F172A" />
            </View>
            <Text style={styles.cardTitle}>Book New Appointment</Text>
            <Text style={styles.cardSubtitle}>
              Consult with top-tier legal experts.
            </Text>
            <View style={styles.cardProceed}>
              <Text style={styles.cardProceedText}>PROCEED</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#EAB308" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <MaterialIcons name="description" size={28} color="#0F172A" />
            </View>
            <Text style={styles.cardTitle}>Request Notarial Service</Text>
            <Text style={styles.cardSubtitle}>
              Fast and secure document processing.
            </Text>
            <View style={styles.cardProceed}>
              <Text style={styles.cardProceedText}>PROCEED</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#EAB308" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Appointments */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Appointments</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Full History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appointmentList}>
          {appointments.map((item, index) => (
            <View key={index} style={styles.appointmentCard}>
              <View style={styles.appointmentLeft}>
                <View style={styles.appointmentDateBox}>
                  <MaterialIcons
                    name="calendar-month"
                    size={20}
                    color="#94A3B8"
                  />
                  <Text style={styles.appointmentDate}>{item.date}</Text>
                </View>
              </View>
              <View style={styles.appointmentRight}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentTitle}>{item.title}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.appointmentInfo}>
                  {item.attorney} • {item.law}
                </Text>
                <View style={styles.appointmentDetails}>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="schedule" size={16} color="#94A3B8" />
                    <Text style={styles.detailText}>{item.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons
                      name="radio-button-unchecked"
                      size={16}
                      color="#94A3B8"
                    />
                    <Text style={styles.detailText}>{item.type}</Text>
                  </View>
                </View>
                <View style={styles.appointmentActions}>
                  {item.payment ? (
                    <TouchableOpacity style={styles.paymentButton}>
                      <MaterialIcons
                        name="credit-card"
                        size={18}
                        color="#fff"
                      />
                      <Text style={styles.paymentText}>Proceed to Payment</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.confirmedBadge}>
                      <MaterialIcons
                        name="check-circle"
                        size={18}
                        color="#059669"
                      />
                      <Text style={styles.confirmedText}>Confirmed</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.arrowButton}>
                    <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Chat Button */}
      <TouchableOpacity style={styles.chatButton}>
        <MaterialIcons name="smart-toy" size={32} color="#EAB308" />
        <View style={styles.chatBadge} />
      </TouchableOpacity>
    </View>
  );
};

export default ClientDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  navButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navAvatarText: { color: '#fff', fontWeight: 'bold' },
  header: { padding: 16 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#0F172A' },
  headerSubtitle: { marginTop: 4, color: '#64748B' },
  cardsContainer: { paddingHorizontal: 16, marginBottom: 16 },
  card: {
    backgroundColor: '#0F172A',
    padding: 20,
    borderRadius: 24,
    marginBottom: 12,
  },
  cardIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#EAB308',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  cardSubtitle: { fontSize: 14, color: '#94A3B8', marginBottom: 12 },
  cardProceed: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardProceedText: { color: '#EAB308', fontWeight: '700', fontSize: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 10, fontWeight: '700', color: '#94A3B8' },
  sectionLink: { fontSize: 10, fontWeight: '700', color: '#D4AF37' },
  appointmentList: { paddingHorizontal: 16 },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 32,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  appointmentLeft: { marginRight: 12 },
  appointmentDateBox: {
    width: 64,
    height: 64,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentDate: { fontSize: 9, color: '#94A3B8', marginTop: 2 },
  appointmentRight: { flex: 1 },
  appointmentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  appointmentTitle: { fontWeight: '700', fontSize: 16 },
  statusBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 16,
  },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  appointmentInfo: { fontSize: 10, color: '#94A3B8', marginBottom: 6 },
  appointmentDetails: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  detailText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: '#64748B' },
  appointmentActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paymentButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#EAB308',
    paddingVertical: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  confirmedBadge: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingVertical: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmedText: { color: '#059669', fontWeight: '700', fontSize: 12 },
  arrowButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0F172A',
  },
});