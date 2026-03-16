import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useUserProfile} from '../context/UserProfileContext';

const HomepageClient = ({navigation}) => {
  const {profile} = useUserProfile();
  const appointments = [
    {
      title: 'Property Dispute',
      attorney: 'ATTY. CLARA SANTOS',
      type: 'Consultation',
      date: '2026-02-24',
      time: '10:00 AM',
      law: 'CIVIL LAW',
      status: 'Approved',
      payment: true,
    },
    {
      title: 'Property Title Verification',
      attorney: 'ATTY. CLARA SANTOS',
      type: 'Consultation',
      date: '2026-02-24',
      time: '1:00 PM',
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

  const handleMenu = () => navigation.navigate('ClientMenu');
  const handleNotifications = () => navigation.navigate('ClientNotification');
  const handleBookAppointment = () => navigation.navigate('BookAppointment');
  const handleNotarialService = () => navigation.navigate('ClientNotarial');
  const handleFullHistory = () =>
    Alert.alert('Full History', 'Showing full appointment history.');
  const handlePayment = () =>
    navigation.navigate('Payment', { serviceData: { type: 'Consultation', amount: '₱2,500' } });
  const handleAppointmentDetails = () =>
    Alert.alert('Appointment Details', 'Opening appointment details.');
  const handleChat = () =>
    navigation.navigate('Chatbot');
  const handleProfileSettings = () =>
    navigation.navigate('ProfileSettingsClient');

  const displayName = profile?.name?.trim() || 'Client';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'AJ';

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navButton, styles.menuButton]}
          onPress={handleMenu}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Text style={[styles.navIcon, styles.menuIcon]}>☰</Text>
        </TouchableOpacity>
        <View style={styles.navRight}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNotifications}>
            <Text style={styles.navIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navAvatar}
            onPress={handleProfileSettings}>
            <Text style={styles.navAvatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome Back, {displayName}</Text>
          <Text style={styles.headerSubtitle}>
            Here's what's happening with your legal matters today.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card} onPress={handleBookAppointment}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>📅</Text>
            </View>
            <Text style={styles.cardTitle}>Book New Appointment</Text>
            <Text style={styles.cardSubtitle}>
              Consult with top-tier legal experts.
            </Text>
            <View style={styles.cardProceed}>
              <Text style={styles.cardProceedText}>PROCEED</Text>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleNotarialService}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>📄</Text>
            </View>
            <Text style={styles.cardTitle}>Request Notarial Service</Text>
            <Text style={styles.cardSubtitle}>
              Fast and secure document processing.
            </Text>
            <View style={styles.cardProceed}>
              <Text style={styles.cardProceedText}>PROCEED</Text>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Appointments</Text>
          <TouchableOpacity onPress={handleFullHistory}>
            <Text style={styles.sectionLink}>Full History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appointmentList}>
          {appointments.map((item, index) => (
            <View key={index} style={styles.appointmentCard}>
              <View style={styles.appointmentLeft}>
                <View style={styles.appointmentDateBox}>
                  <Text style={styles.dateIcon}>📆</Text>
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
                    <Text style={styles.detailIcon}>🕐</Text>
                    <Text style={styles.detailText}>{item.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>⭕</Text>
                    <Text style={styles.detailText}>{item.type}</Text>
                  </View>
                </View>

                <View style={styles.appointmentActions}>
                  {item.payment ? (
                    <TouchableOpacity
                      style={styles.paymentButton}
                      onPress={handlePayment}>
                      <Text style={styles.paymentIcon}>💳</Text>
                      <Text style={styles.paymentText}>Proceed to Payment</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.confirmedBadge}>
                      <Text style={styles.confirmedIcon}>✓</Text>
                      <Text style={styles.confirmedText}>Confirmed</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={handleAppointmentDetails}>
                    <Text style={styles.arrowButtonText}>›</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
        <Text style={styles.chatButtonIcon}>💬</Text>
        <View style={styles.chatBadge} />
      </TouchableOpacity>
    </View>
  );
};

export default HomepageClient;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  scrollContent: {paddingBottom: 120},
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  navButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {fontSize: 20},
  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
  },
  menuIcon: {fontSize: 24},
  navRight: {flexDirection: 'row', alignItems: 'center', gap: 8},
  navAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navAvatarText: {color: '#fff', fontWeight: '700', fontSize: 14},
  header: {padding: 16},
  headerTitle: {fontSize: 28, fontWeight: '700', color: '#0F172A'},
  headerSubtitle: {marginTop: 4, color: '#64748B', fontSize: 14},
  cardsContainer: {paddingHorizontal: 16, marginBottom: 16},
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
  cardIconText: {fontSize: 28},
  cardTitle: {fontSize: 20, fontWeight: '700', color: '#fff'},
  cardSubtitle: {fontSize: 14, color: '#94A3B8', marginBottom: 12},
  cardProceed: {flexDirection: 'row', alignItems: 'center', gap: 4},
  arrowText: {color: '#EAB308', fontSize: 16, fontWeight: '700'},
  cardProceedText: {color: '#EAB308', fontWeight: '700', fontSize: 12},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {fontSize: 10, fontWeight: '700', color: '#94A3B8'},
  sectionLink: {fontSize: 10, fontWeight: '700', color: '#D4AF37'},
  appointmentList: {paddingHorizontal: 16},
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 32,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    elevation: 2,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
  },
  appointmentLeft: {marginRight: 12},
  appointmentDateBox: {
    width: 64,
    height: 64,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateIcon: {fontSize: 24},
  appointmentDate: {fontSize: 9, color: '#94A3B8', marginTop: 2},
  appointmentRight: {flex: 1},
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  appointmentTitle: {fontWeight: '700', fontSize: 16},
  statusBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 16,
  },
  statusText: {color: '#fff', fontSize: 10, fontWeight: '700'},
  appointmentInfo: {fontSize: 10, color: '#94A3B8', marginBottom: 6},
  appointmentDetails: {flexDirection: 'row', gap: 16, marginBottom: 8},
  detailItem: {flexDirection: 'row', alignItems: 'center', gap: 2},
  detailIcon: {fontSize: 14},
  detailText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#64748B',
  },
  appointmentActions: {flexDirection: 'row', alignItems: 'center', gap: 8},
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
  paymentIcon: {fontSize: 16},
  paymentText: {color: '#fff', fontWeight: '700', fontSize: 12},
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
  confirmedIcon: {fontSize: 16, color: '#059669', fontWeight: '700'},
  confirmedText: {color: '#059669', fontWeight: '700', fontSize: 12},
  arrowButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonText: {fontSize: 28, color: '#94A3B8', fontWeight: '300'},
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
  chatButtonIcon: {fontSize: 32},
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