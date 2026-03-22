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

const ChevronLeft = (props) => <MaterialCommunityIcons name="chevron-left" {...props} />;
const Info = (props) => <MaterialCommunityIcons name="information" {...props} />;
const Wallet = (props) => <MaterialCommunityIcons name="wallet" {...props} />;
const ChevronRight = (props) => <MaterialCommunityIcons name="chevron-right" {...props} />;
const Filter = (props) => <MaterialCommunityIcons name="filter" {...props} />;

const HISTORY = [
  { id: '1', amount: '₱15,000.00', date: 'Oct 24, 2023 • 10:45 AM', status: 'COMPLETED' },
  { id: '2', amount: '₱42,500.00', date: 'Oct 20, 2023 • 02:15 PM', status: 'PROCESSING' },
  { id: '3', amount: '₱8,200.00', date: 'Oct 15, 2023 • 09:30 AM', status: 'COMPLETED' },
  { id: '4', amount: '₱22,000.00', date: 'Oct 12, 2023 • 11:20 AM', status: 'COMPLETED' },
  { id: '5', amount: '₱12,400.00', date: 'Oct 05, 2023 • 04:55 PM', status: 'FAILED' },
];

const HistoryItem = ({ item, navigation }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'COMPLETED': return { bg: '#ECFDF5', text: '#10B981' };
      case 'PROCESSING': return { bg: '#EEF2FF', text: '#4F46E5' };
      case 'FAILED': return { bg: '#FEF2F2', text: '#EF4444' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const statusStyle = getStatusStyles(item.status);

  return (
    <TouchableOpacity style={styles.historyRow} onPress={() => navigation && navigation.navigate('AttyConfirmPayout')}>
      <View style={{ flex: 1 }}>
        <Text style={styles.historyAmount}>{item.amount}</Text>
        <Text style={styles.historyDate}>{item.date}</Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
        </View>
        <ChevronRight size={18} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );
};

export default function PayoutDetails({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
          <ChevronLeft size={28} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Payout Details</Text>
        <TouchableOpacity><Info size={24} color="#1E3A8A" /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Balance Card */}
        <View
          style={[styles.balanceCard, { backgroundColor: '#0000FF' }]}
        >
          <Text style={styles.balanceLabel}>Withdrawal Balance</Text>
          <Text style={styles.balanceValue}>₱184,200</Text>
          
          <View style={styles.balanceFooter}>
            <View>
              <Text style={styles.payoutSubLabel}>NEXT PAYOUT</Text>
              <Text style={styles.payoutDate}>Auto-process: Oct 30</Text>
            </View>
            <TouchableOpacity 
              style={styles.withdrawBtn}
              onPress={() => navigation.navigate('AttyConfirmPayout')}
            >
              <Text style={styles.withdrawBtnText}>Withdraw Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payout Settings */}
        <Text style={styles.sectionHeader}>PAYOUT SETTINGS</Text>
        <View style={styles.settingsCard}>
          <View style={styles.methodIcon}>
            <Wallet size={20} color="#4F46E5" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.methodName}>GCash - 0912****345</Text>
            <Text style={styles.methodSub}>Primary payout method</Text>
          </View>
          <TouchableOpacity><Text style={styles.editText}>Edit</Text></TouchableOpacity>
        </View>

        {/* Withdrawal History */}
        <View style={styles.historyHeader}>
          <Text style={styles.sectionHeader}>WITHDRAWAL HISTORY</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Filter</Text>
            <Filter size={14} color="#4F46E5" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {HISTORY.map(item => <HistoryItem key={item.id} item={item} navigation={navigation} />)}

        <TouchableOpacity style={styles.viewFullBtn}>
          <Text style={styles.viewFullText}>View full transaction history</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  navTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  scrollContent: { padding: 20 },
  
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
  },
  balanceLabel: { color: '#CBD5E1', fontSize: 14 },
  balanceValue: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginVertical: 10 },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  payoutSubLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  payoutDate: { color: '#FFF', fontSize: 15, marginTop: 2 },
  withdrawBtn: {
    backgroundColor: '#0000FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  withdrawBtnText: { color: '#FFF', fontWeight: 'bold' },

  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 0.5 },
  settingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  methodIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#E0E7FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  methodSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  editText: { color: '#0000FF', fontWeight: 'bold' },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterBtn: { flexDirection: 'row', alignItems: 'center' },
  filterText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 13 },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyAmount: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  historyDate: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  statusContainer: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  statusText: { fontSize: 10, fontWeight: '800' },

  viewFullBtn: {
    marginTop: 25,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  viewFullText: { color: '#64748B', fontWeight: '500' },
});
