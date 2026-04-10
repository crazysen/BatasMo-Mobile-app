import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { ChevronLeft, Calendar, Clock, MessageSquare, AlertCircle } from 'lucide-react-native';

const APPOINTMENTS = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Corporate Law',
    date: 'Feb 17, 2026',
    time: '10:00 AM',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Mr. Michael Chen',
    specialty: 'Family Law',
    date: 'Feb 20, 2026',
    time: '2:00 PM',
    status: 'INACTIVE',
  },
  {
    id: '3',
    name: 'Ms. Emily Rodriguez',
    specialty: 'Criminal Law',
    date: 'Feb 22, 2026',
    time: '11:00 AM',
    status: 'INACTIVE',
    iconColor: '#F59E0B', // Orange variation seen in screenshot
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Civil Law',
    date: 'Feb 10, 2026',
    time: '3:00 PM',
    status: 'REJECTED',
  },
  {
    id: '5',
    name: 'Ms. Amanda Lee',
    specialty: 'Tax Law',
    date: 'Feb 5, 2026',
    time: '1:00 PM',
    status: 'REJECTED',
  },
];

const AppointmentCard = ({ item, navigation }) => {
  const isRejected = item.status === 'REJECTED';
  const isActive = item.status === 'ACTIVE';
  const iconColor = item.iconColor || '#4F46E5';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.name, isRejected && styles.fadedText]}>{item.name}</Text>
          <Text style={[styles.specialty, isRejected && styles.fadedText]}>{item.specialty}</Text>
        </View>
        {isRejected && (
          <View style={styles.rejectedBadge}>
            <Text style={styles.rejectedBadgeText}>REJECTED</Text>
          </View>
        )}
      </View>

      <View style={styles.dateTimeRow}>
        <View style={styles.metaItem}>
          <Calendar size={16} color={isRejected ? '#D1D5DB' : iconColor} />
          <Text style={[styles.metaText, isRejected && styles.fadedText]}>{item.date}</Text>
        </View>
        <View style={styles.metaItem}>
          <Clock size={16} color={isRejected ? '#D1D5DB' : iconColor} />
          <Text style={[styles.metaText, isRejected && styles.fadedText]}>{item.time}</Text>
        </View>
      </View>

      {isRejected ? (
        <View style={styles.declinedBox}>
          <AlertCircle size={16} color="#EF4444" />
          <Text style={styles.declinedText}>Consultation Request Declined</Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={[styles.consultBtn, !isActive && styles.disabledBtn]}
          disabled={!isActive}
          onPress={() => navigation && navigation.navigate('AttyConsultationMessage', { clientName: item.name, clientInitials: item.name.split(' ').map(n => n[0]).join('') })}
        >
          {isActive && <MessageSquare size={18} color="#FFF" style={{marginRight: 8}} />}
          <Text style={[styles.consultBtnText, !isActive && styles.disabledBtnText]}>
            Enter Consultation
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function MyAppointments({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>My Appointments</Text>
      </View>
      
      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>Manage and track all your legal appointments</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {APPOINTMENTS.map((item) => (
          <AppointmentCard key={item.id} item={item} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  navTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'serif',
    marginLeft: 8,
  },
  subHeader: { paddingHorizontal: 20, marginTop: 8, marginBottom: 20 },
  subTitle: { color: '#6B7280', fontSize: 14 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 15 
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  specialty: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  fadedText: { color: '#9CA3AF' },
  
  rejectedBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rejectedBadgeText: { color: '#EF4444', fontSize: 10, fontWeight: 'bold' },
  
  dateTimeRow: { flexDirection: 'row', marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 30 },
  metaText: { marginLeft: 8, color: '#374151', fontWeight: '500' },
  
  consultBtn: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  disabledBtn: { backgroundColor: '#E5E7EB' },
  disabledBtnText: { color: '#9CA3AF' },
  
  declinedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  declinedText: { marginLeft: 10, color: '#B91C1C', fontSize: 13, fontWeight: '500' },
});