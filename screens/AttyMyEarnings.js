import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ArrowLeft = (props) => <MaterialCommunityIcons name="arrow-left" {...props} />;
const Wallet = (props) => <MaterialCommunityIcons name="wallet" {...props} />;
const Calendar = (props) => <MaterialCommunityIcons name="calendar" {...props} />;
const Hourglass = (props) => <MaterialCommunityIcons name="hourglass-sand" {...props} />;
const TrendingUp = (props) => <MaterialCommunityIcons name="trending-up" {...props} />;
const CalendarDays = (props) => <MaterialCommunityIcons name="calendar-multiple" {...props} />;
const Download = (props) => <MaterialCommunityIcons name="download" {...props} />;

const STAT_CARDS = [
  {
    id: '1',
    label: 'TOTAL EARNINGS',
    value: '₱184,200',
    growth: '+12.5%',
    icon: <Wallet size={20} color="#B45309" />,
    iconBg: '#FEF3C7',
  },
  {
    id: '2',
    label: 'THIS MONTH',
    value: '₱42,500',
    growth: '+8.2%',
    icon: <Calendar size={20} color="#B45309" />,
    iconBg: '#FEF3C7',
  },
  {
    id: '3',
    label: 'PENDING PAYOUT',
    value: '₱12,800',
    growth: null,
    icon: <Hourglass size={20} color="#B45309" />,
    iconBg: '#FFFBEB',
  },
];

const TRANSACTIONS = [
  { id: '1', name: 'Michael Roberts', type: 'Consultation', date: 'Oct 24, 2024', net: '₱2,250.00', total: '₱2,500.00', fee: '-₱250.00 Fee', status: 'RELEASED' },
  { id: '2', name: 'Sarah Jenkins', type: 'Consultation', date: 'Oct 25, 2024', net: '₱2,250.00', total: '₱2,500.00', fee: '-₱250.00 Fee', status: 'PENDING' },
  { id: '3', name: 'Alice Cooper', type: 'Notarial', date: 'Oct 28, 2024', net: '₱1,350.00', total: '₱1,500.00', fee: '-₱150.00 Fee', status: 'PAID' },
];

const StatCard = ({ item }) => (
  <View style={styles.statCard}>
    <View style={styles.statTop}>
      <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
        {item.icon}
      </View>
      {item.growth && (
        <View style={styles.growthBadge}>
          <TrendingUp size={12} color="#10B981" />
          <Text style={styles.growthText}>{item.growth}</Text>
        </View>
      )}
    </View>
    <Text style={styles.statLabel}>{item.label}</Text>
    <Text style={styles.statValue}>{item.value}</Text>
  </View>
);

const TransactionItem = ({ item, navigation }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'RELEASED': return { bg: '#EFF6FF', text: '#3B82F6' };
      case 'PENDING': return { bg: '#FFF7ED', text: '#F97316' };
      case 'PAID': return { bg: '#ECFDF5', text: '#10B981' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };
  const statusColors = getStatusStyle(item.status);

  return (
    <TouchableOpacity 
      style={styles.transactionCard}
      onPress={() => navigation.navigate('AttyPayoutDetails')}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.clientName}>{item.name}</Text>
          <Text style={styles.clientSub}>{item.type} • {item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
          <Text style={[styles.statusText, { color: statusColors.text }]}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.earningsBox}>
        <View>
          <Text style={styles.earningsLabel}>NET EARNINGS</Text>
          <Text style={styles.netAmount}>{item.net}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalAmount}>{item.total}</Text>
          <Text style={styles.feeAmount}>{item.fee}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MyEarnings({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#1E3A8A" />
        </TouchableOpacity>
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.title}>My Earnings</Text>
          <Text style={styles.networkSub}>BATASMO PROFESSIONAL NETWORK</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {STAT_CARDS.map(stat => <StatCard key={stat.id} item={stat} />)}

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>TRANSACTION HISTORY</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.dateBtn}>
              <CalendarDays size={18} color="#374151" />
              <Text style={styles.dateBtnText}>Date Range</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportBtn}>
              <Download size={18} color="#FFF" />
              <Text style={styles.exportBtnText}>Export CSV</Text>
            </TouchableOpacity>
          </View>

          {TRANSACTIONS.map(tx => <TransactionItem key={tx.id} item={tx} navigation={navigation} />)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E3A8A' },
  networkSub: { fontSize: 10, color: '#94A3B8', letterSpacing: 1, marginTop: 2 },
  scroll: { padding: 20 },
  
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
  },
  statTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  iconCircle: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  growthBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  growthText: { color: '#10B981', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  statLabel: { color: '#64748B', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5 },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#1E3A8A', marginTop: 8 },

  historySection: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 15 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dateBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, marginRight: 10 },
  dateBtnText: { marginLeft: 8, color: '#374151', fontWeight: '500' },
  exportBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: '#0F172A', borderRadius: 10 },
  exportBtnText: { marginLeft: 8, color: '#FFF', fontWeight: 'bold' },

  transactionCard: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  clientName: { fontSize: 16, fontWeight: 'bold', color: '#1E3A8A' },
  clientSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  earningsBox: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: 15, borderRadius: 12, marginTop: 12 },
  earningsLabel: { fontSize: 10, color: '#64748B', fontWeight: 'bold' },
  netAmount: { fontSize: 18, fontWeight: 'bold', color: '#10B981', marginTop: 4 },
  totalLabel: { fontSize: 10, color: '#64748B', textAlign: 'right' },
  totalAmount: { fontSize: 15, fontWeight: 'bold', color: '#1E3A8A', marginTop: 2 },
  feeAmount: { fontSize: 11, color: '#EF4444', marginTop: 2 },
});
