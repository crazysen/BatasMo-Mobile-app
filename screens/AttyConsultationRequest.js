import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Search = (props) => <MaterialCommunityIcons name="magnify" {...props} />;
const SlidersHorizontal = (props) => <MaterialCommunityIcons name="tune" {...props} />;
const Calendar = (props) => <MaterialCommunityIcons name="calendar" {...props} />;
const FileText = (props) => <MaterialCommunityIcons name="file-document" {...props} />;
const Check = (props) => <MaterialCommunityIcons name="check" {...props} />;
const X = (props) => <MaterialCommunityIcons name="close" {...props} />;
const Clock = (props) => <MaterialCommunityIcons name="clock-outline" {...props} />;

const DATA = [
  {
    id: '1',
    initials: 'MR',
    name: 'Michael Roberts',
    type: 'Civil Litigation',
    date: 'Oct 24, 2024',
    time: '10:00 AM',
    status: 'PENDING',
    paymentStatus: 'PAID',
    description: 'Neighbor boundary dispute resulting in property damage to my fence and garden area.',
  },
  {
    id: '2',
    initials: 'SJ',
    name: 'Sarah Jenkins',
    type: 'Family Law',
    date: 'Oct 25, 2024',
    time: '02:30 PM',
    status: 'APPROVED',
    paymentStatus: 'PAID',
    description: 'Questions regarding child custody arrangements and visitation rights for upcoming holiday season.',
  },
  {
    id: '3',
    initials: 'DC',
    name: 'David Chen',
    type: 'Corporate Law',
    date: 'Oct 25, 2024',
    time: '04:00 PM',
    status: 'PENDING',
    paymentStatus: 'PAID',
    description: 'Drafting of a service agreement for a new startup venture in the fintech sector.',
  },
  {
    id: '4',
    initials: 'ET',
    name: 'Emma Thompson',
    type: 'Property Dispute',
    date: 'Oct 26, 2024',
    time: '09:15 AM',
    status: 'PENDING',
    paymentStatus: 'UNPAID',
    description: '',
  },
];

const ConsultationCard = ({ item, navigation }) => {
  const isApproved = item.status === 'APPROVED';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.clientName}>{item.name}</Text>
            <View style={[styles.statusBadge, isApproved ? styles.statusApproved : styles.statusPending]}>
              <Text style={[styles.statusText, isApproved ? styles.textApproved : styles.textPending]}>
                {item.status}
              </Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <FileText size={14} color="#6B7280" />
            <Text style={styles.metaText}>{item.type}</Text>
          </View>
          <View style={styles.metaRow}>
            <Calendar size={14} color="#6B7280" />
            <Text style={styles.metaText}>{item.date} • {item.time}</Text>
            <View style={[styles.dot, { backgroundColor: item.paymentStatus === 'PAID' ? '#10B981' : '#D1D5DB' }]} />
            <Text style={[styles.paymentText, { color: item.paymentStatus === 'PAID' ? '#10B981' : '#9CA3AF' }]}>
              {item.paymentStatus}
            </Text>
          </View>
        </View>
      </View>

      {isApproved ? (
        <TouchableOpacity 
          style={styles.enterBtn}
          onPress={() => navigation.navigate('AttyConsultationMessage', { clientName: item.name, clientInitials: item.initials })}
        >
          <View style={styles.enterBtnContent}>
            <Text style={styles.enterBtnText}>💬 ENTER CONSULTATION</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.acceptBtn} onPress={() => navigation.navigate('AttyMyAppointments')}>
            <Check size={16} color="#9CA3AF" style={{marginRight: 4}} />
            <Text style={styles.acceptBtnText}>ACCEPT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rescheduleBtn} onPress={() => navigation.navigate('AttyAvailabilityManager')}>
            <Calendar size={16} color="#9CA3AF" style={{marginRight: 4}} />
            <Text style={styles.rescheduleBtnText}>RESCHEDULE</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isApproved && (
        <TouchableOpacity style={styles.rejectBtn} onPress={() => navigation.navigate('AttyNotarialRequestRejected', { title: item.type, user: item.name })}>
          <X size={16} color="#9CA3AF" style={{marginRight: 4}} />
          <Text style={styles.rescheduleBtnText}>REJECT</Text>
        </TouchableOpacity>
      )}

      {item.description ? (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>BRIEF DESCRIPTION OF CONCERN</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default function App({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
          <Text style={{ fontSize: 24 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Consultation Requests</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput 
            placeholder="Search by client name or case type..." 
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterBtn}>
          <SlidersHorizontal size={18} color="#1F2937" />
          <Text style={styles.filterBtnText}>FILTER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortBtn}>
          <Text style={styles.sortBtnText}>SORT BY DATE</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={DATA}
        renderItem={({ item }) => <ConsultationCard item={item} navigation={navigation} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', fontFamily: 'serif' },
  searchSection: { paddingHorizontal: 20, marginBottom: 15 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '45%',
    justifyContent: 'center',
  },
  filterBtnText: { marginLeft: 8, fontWeight: '600', color: '#1F2937' },
  sortBtn: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 8,
    width: '50%',
    alignItems: 'center',
  },
  sortBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  cardHeader: { flexDirection: 'row', marginBottom: 15 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#1E40AF', fontWeight: 'bold', fontSize: 18 },
  headerInfo: { flex: 1, marginLeft: 15 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  clientName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusPending: { backgroundColor: '#FFF7ED' },
  statusApproved: { backgroundColor: '#EEF2FF' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  textPending: { color: '#F97316' },
  textApproved: { color: '#4F46E5' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaText: { color: '#6B7280', marginLeft: 6, fontSize: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, marginLeft: 10, marginRight: 6 },
  paymentText: { fontSize: 11, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  acceptBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: { color: '#9CA3AF', fontWeight: 'bold', fontSize: 12 },
  rescheduleBtn: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleBtnText: { color: '#9CA3AF', fontWeight: 'bold', fontSize: 12 },
  rejectBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  enterBtn: { backgroundColor: '#0F172A', padding: 15, borderRadius: 12, marginTop: 10 },
  enterBtnText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold', fontSize: 13 },
  descriptionContainer: { marginTop: 20 },
  descriptionLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: 'bold', marginBottom: 8 },
  descriptionBox: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 15 },
  descriptionText: { color: '#374151', lineHeight: 20 },
});
