import React from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {ClientScreenShell} from '../components/ClientScreenShell';
import {REFERENCE_THEME as T} from '../constants/referenceTheme';

const accentGold = T.gold[1];

const ArrowLeft = props => <MaterialCommunityIcons name="arrow-left" {...props} />;
const Wallet = props => <MaterialCommunityIcons name="wallet" {...props} />;
const Calendar = props => <MaterialCommunityIcons name="calendar" {...props} />;
const Hourglass = props => <MaterialCommunityIcons name="hourglass-sand" {...props} />;
const TrendingUp = props => <MaterialCommunityIcons name="trending-up" {...props} />;
const CalendarDays = props => <MaterialCommunityIcons name="calendar-multiple" {...props} />;
const Download = props => <MaterialCommunityIcons name="download" {...props} />;

const STAT_CARDS = [
  {
    id: '1',
    label: 'TOTAL EARNINGS',
    value: '₱184,200',
    growth: '+12.5%',
    icon: <Wallet size={20} color={accentGold} />,
    iconBg: 'rgba(215, 177, 74, 0.15)',
  },
  {
    id: '2',
    label: 'THIS MONTH',
    value: '₱42,500',
    growth: '+8.2%',
    icon: <Calendar size={20} color={accentGold} />,
    iconBg: 'rgba(215, 177, 74, 0.15)',
  },
  {
    id: '3',
    label: 'PENDING PAYOUT',
    value: '₱12,800',
    growth: null,
    icon: <Hourglass size={20} color={accentGold} />,
    iconBg: 'rgba(215, 177, 74, 0.12)',
  },
];

const TRANSACTIONS = [
  {
    id: '1',
    name: 'Michael Roberts',
    type: 'Consultation',
    date: 'Oct 24, 2024',
    net: '₱2,250.00',
    total: '₱2,500.00',
    fee: '-₱250.00 Fee',
    status: 'RELEASED',
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    type: 'Consultation',
    date: 'Oct 25, 2024',
    net: '₱2,250.00',
    total: '₱2,500.00',
    fee: '-₱250.00 Fee',
    status: 'PENDING',
  },
  {
    id: '3',
    name: 'Alice Cooper',
    type: 'Notarial',
    date: 'Oct 28, 2024',
    net: '₱1,350.00',
    total: '₱1,500.00',
    fee: '-₱150.00 Fee',
    status: 'PAID',
  },
];

const StatCard = ({item}) => (
  <View style={styles.statCard}>
    <View style={styles.statTop}>
      <View style={[styles.iconCircle, {backgroundColor: item.iconBg}]}>{item.icon}</View>
      {item.growth && (
        <View style={styles.growthBadge}>
          <TrendingUp size={12} color="#34D399" />
          <Text style={styles.growthText}>{item.growth}</Text>
        </View>
      )}
    </View>
    <Text style={styles.statLabel}>{item.label}</Text>
    <Text style={styles.statValue}>{item.value}</Text>
  </View>
);

const TransactionItem = ({item, navigation}) => {
  const getStatusStyle = status => {
    switch (status) {
      case 'RELEASED':
        return {bg: 'rgba(59, 130, 246, 0.15)', text: '#93C5FD'};
      case 'PENDING':
        return {bg: 'rgba(249, 115, 22, 0.15)', text: '#FDBA74'};
      case 'PAID':
        return {bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7'};
      default:
        return {bg: 'rgba(148, 163, 184, 0.2)', text: T.textMuted};
    }
  };
  const statusColors = getStatusStyle(item.status);

  return (
    <TouchableOpacity style={styles.transactionCard} onPress={() => navigation.navigate('AttyPayoutDetails')}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.clientName}>{item.name}</Text>
          <Text style={styles.clientSub}>
            {item.type} • {item.date}
          </Text>
        </View>
        <View style={[styles.statusBadge, {backgroundColor: statusColors.bg}]}>
          <Text style={[styles.statusText, {color: statusColors.text}]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.earningsBox}>
        <View>
          <Text style={styles.earningsLabel}>NET EARNINGS</Text>
          <Text style={styles.netAmount}>{item.net}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalAmount}>{item.total}</Text>
          <Text style={styles.feeAmount}>{item.fee}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MyEarnings({navigation}) {
  return (
    <ClientScreenShell edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}>
          <ArrowLeft size={24} color={T.text} />
        </TouchableOpacity>
        <View style={{marginLeft: 15}}>
          <Text style={styles.title}>My Earnings</Text>
          <Text style={styles.networkSub}>BATASMO PROFESSIONAL NETWORK</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {STAT_CARDS.map(stat => (
          <StatCard key={stat.id} item={stat} />
        ))}

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>TRANSACTION HISTORY</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.dateBtn}>
              <CalendarDays size={18} color={T.textMuted} />
              <Text style={styles.dateBtnText}>Date Range</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportBtn}>
              <Download size={18} color="#101B2C" />
              <Text style={styles.exportBtnText}>Export CSV</Text>
            </TouchableOpacity>
          </View>

          {TRANSACTIONS.map(tx => (
            <TransactionItem key={tx.id} item={tx} navigation={navigation} />
          ))}
        </View>
      </ScrollView>
    </ClientScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 215, 139, 0.1)',
  },
  title: {fontSize: 22, fontWeight: '900', color: T.text},
  networkSub: {fontSize: 10, color: T.textSoft, letterSpacing: 1, marginTop: 2},
  scroll: {padding: 20, paddingBottom: 40},

  statCard: {
    backgroundColor: 'rgba(12, 19, 30, 0.92)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
  },
  statTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20},
  iconCircle: {width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center'},
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  growthText: {color: '#6EE7B7', fontSize: 12, fontWeight: '800', marginLeft: 4},
  statLabel: {color: T.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 0.5},
  statValue: {fontSize: 32, fontWeight: 'bold', color: T.text, marginTop: 8},

  historySection: {
    backgroundColor: 'rgba(12, 19, 30, 0.92)',
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
  },
  sectionTitle: {fontSize: 18, fontWeight: '900', color: T.text, marginBottom: 15},
  filterRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20},
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.2)',
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: 'rgba(4, 7, 11, 0.4)',
  },
  dateBtnText: {marginLeft: 8, color: T.text, fontWeight: '600'},
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: accentGold,
    borderRadius: 10,
  },
  exportBtnText: {marginLeft: 8, color: '#101B2C', fontWeight: '800'},

  transactionCard: {paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(244, 215, 139, 0.08)'},
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  clientName: {fontSize: 16, fontWeight: '800', color: T.text},
  clientSub: {fontSize: 12, color: T.textMuted, marginTop: 2},
  statusBadge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8},
  statusText: {fontSize: 10, fontWeight: '800'},

  earningsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(4, 7, 11, 0.45)',
    padding: 15,
    borderRadius: 12,
    marginTop: 12,
  },
  earningsLabel: {fontSize: 10, color: T.textSoft, fontWeight: '800'},
  netAmount: {fontSize: 18, fontWeight: 'bold', color: '#34D399', marginTop: 4},
  totalLabel: {fontSize: 10, color: T.textSoft, textAlign: 'right'},
  totalAmount: {fontSize: 15, fontWeight: 'bold', color: accentGold, marginTop: 2},
  feeAmount: {fontSize: 11, color: '#f87171', marginTop: 2},
});
