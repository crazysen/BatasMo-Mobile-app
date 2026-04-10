import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getMyAppointments} from '../services/appointmentService';
import {REFERENCE_THEME as T} from '../constants/referenceTheme';
import {ClientScreenShell, ClientFadeIn} from '../components/ClientScreenShell';
import ClientChevronBack from '../components/ClientChevronBack';
import {getNotarialRequests} from '../services/notarialService';

const NOTARIAL_FEE_FALLBACK = 4000;
const PAYMENT_METHOD_LABEL = 'GCASH';

/** Plasma / gold borders — same family as REFERENCE_THEME, not slate blues */
const BORDER_GOLD_SOFT = 'rgba(212, 175, 55, 0.12)';
const BORDER_GOLD_MED = 'rgba(212, 175, 55, 0.18)';
const BORDER_GOLD_PILL = 'rgba(212, 175, 55, 0.28)';

const COL = {
  icon: 40,
  date: 80,
};

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `₱${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

function formatCurrencyNegative(value) {
  const amount = Number(value || 0);
  return `-PHP ${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

function isPaidAppointment(item) {
  const s = String(item.status ?? '').toLowerCase();
  return Boolean(item.payment_is_paid) || ['confirmed', 'completed'].includes(s);
}

function isPaidNotarial(item) {
  const s = String(item.status ?? '').toLowerCase();
  return ['accepted', 'completed'].includes(s);
}

export default function TransactionHistory({navigation}) {
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedKey, setExpandedKey] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [appointmentRows, requestRows] = await Promise.all([
        getMyAppointments(),
        getNotarialRequests(),
      ]);
      setAppointments(Array.isArray(appointmentRows) ? appointmentRows : []);
      setRequests(Array.isArray(requestRows) ? requestRows : []);
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Unable to load transaction history.');
      setAppointments([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const allTransactions = useMemo(() => {
    const appointmentTx = appointments.filter(isPaidAppointment).map((item, index) => {
      const amountNum = Number(item.amount ?? 2500);
      const atty = String(item.attorney_name ?? 'Attorney').trim();
      const dateIso = item.updated_at || item.created_at;
      return {
        kind: 'consultation',
        key: `apt-${item.id}-${index}`,
        rawId: item.id,
        titleLine: 'LEGAL CONSULTATION',
        subtitleLine: `CONSULTATION WITH ATTY. ${atty.toUpperCase()}`,
        amountNum,
        date: dateIso,
        statusLabel: 'PAID',
      };
    });

    const requestTx = requests.filter(isPaidNotarial).map((item, index) => {
      const st = String(item.service_type ?? 'Service').trim();
      const atty = String(item.attorney_name ?? 'Attorney').trim();
      const dateIso = item.updated_at || item.created_at;
      return {
        kind: 'notarial',
        key: `not-${item.id}-${index}`,
        rawId: item.id,
        titleLine: `NOTARIAL — ${st.toUpperCase()}`,
        subtitleLine: `NOTARIAL WITH ATTY. ${atty.toUpperCase()}`,
        amountNum: NOTARIAL_FEE_FALLBACK,
        date: dateIso,
        statusLabel: 'PAID',
      };
    });

    return [...appointmentTx, ...requestTx].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [appointments, requests]);

  const stats = useMemo(() => {
    const consultationCount = allTransactions.filter(t => t.kind === 'consultation').length;
    const notarialCount = allTransactions.filter(t => t.kind === 'notarial').length;
    const totalSpent = allTransactions.reduce((sum, t) => sum + (Number(t.amountNum) || 0), 0);
    return {
      totalSpent,
      consultationCount,
      notarialCount,
      totalCount: allTransactions.length,
    };
  }, [allTransactions]);

  const filteredByCategory = useMemo(() => {
    if (filter === 'consultation') {
      return allTransactions.filter(t => t.kind === 'consultation');
    }
    if (filter === 'notarial') {
      return allTransactions.filter(t => t.kind === 'notarial');
    }
    return allTransactions;
  }, [allTransactions, filter]);

  const formatDateParts = iso => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return {dateLine: '—', timeLine: ''};
    }
    return {
      dateLine: d
        .toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})
        .toUpperCase(),
      timeLine: d.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit'}),
    };
  };

  const toggleExpand = key => {
    setExpandedKey(prev => (prev === key ? null : key));
  };

  const renderRow = ({item, index}) => {
    const {dateLine, timeLine} = formatDateParts(item.date);
    const expanded = expandedKey === item.key;
    const isConsult = item.kind === 'consultation';

    return (
      <ClientFadeIn delay={32 + index * 24}>
        <TouchableOpacity
          style={styles.rowCard}
          onPress={() => toggleExpand(item.key)}
          activeOpacity={0.75}>
          <View style={styles.rowTop}>
            <View style={styles.typeIconWrap}>
              <MaterialCommunityIcons
                name={isConsult ? 'message-text' : 'file-document-outline'}
                size={18}
                color={T.gold[1]}
              />
            </View>
            <View style={styles.descBlock}>
              <Text style={styles.descTitle} numberOfLines={2}>
                {item.titleLine}
              </Text>
              <Text style={styles.descSub} numberOfLines={2}>
                {item.subtitleLine}
              </Text>
            </View>
            <View style={styles.chevronHit}>
              <MaterialCommunityIcons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={T.textSoft}
              />
            </View>
          </View>

          <View style={styles.rowMetaLabels}>
            <View style={[styles.metaDateBlock, {width: COL.date}]}>
              <Text style={styles.thInline}>DATE</Text>
            </View>
            <View style={styles.metaMethodSpacer} />
            <View style={styles.metaRightBlock}>
              <Text style={styles.thInline}>AMOUNT</Text>
              <View style={styles.thAmountGap} />
              <View style={styles.thPillSpace} />
            </View>
          </View>

          <View style={styles.rowMeta}>
            <View style={[styles.metaDateBlock, {width: COL.date}]}>
              <Text style={styles.metaDate}>{dateLine}</Text>
              {timeLine ? <Text style={styles.metaTime}>{timeLine}</Text> : null}
            </View>
            <View style={styles.metaMethodBlock}>
              <View style={styles.gcashBadge}>
                <Text style={styles.gcashG}>G</Text>
              </View>
              <Text style={styles.methodText} numberOfLines={1}>
                {PAYMENT_METHOD_LABEL}
              </Text>
            </View>
            <View style={styles.metaRightBlock}>
              <Text style={styles.amountText}>{formatCurrencyNegative(item.amountNum)}</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{item.statusLabel}</Text>
              </View>
            </View>
          </View>

          {expanded ? (
            <View style={styles.expanded}>
              <Text style={styles.expandedLabel}>Reference</Text>
              <Text style={styles.expandedValue}>{item.rawId}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </ClientFadeIn>
    );
  };

  const ListHeader = (
    <ClientFadeIn>
      <ClientChevronBack
        style={styles.backHit}
        onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
      />

      {/* Screen title block intentionally omitted (no receipt icon / title / subtitle). */}

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>TOTAL SPENT</Text>
          <Text style={styles.summaryValue}>{formatCurrency(stats.totalSpent)}</Text>
          <Text style={styles.summaryHint}>{stats.totalCount} transactions</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>CONSULTATIONS</Text>
          <Text style={styles.summaryValueNum}>{stats.consultationCount}</Text>
          <Text style={styles.summaryHint}>Legal consultations paid</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>NOTARIAL SERVICES</Text>
          <Text style={styles.summaryValueNum}>{stats.notarialCount}</Text>
          <Text style={styles.summaryHint}>Notarial fees paid</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
        style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'all' && styles.filterPillActive]}
          onPress={() => setFilter('all')}
          activeOpacity={0.8}>
          <Text style={[styles.filterPillText, filter === 'all' && styles.filterPillTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'consultation' && styles.filterPillActive]}
          onPress={() => setFilter('consultation')}
          activeOpacity={0.8}>
          <Text
            style={[
              styles.filterPillText,
              filter === 'consultation' && styles.filterPillTextActive,
            ]}>
            Consultation {stats.consultationCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'notarial' && styles.filterPillActive]}
          onPress={() => setFilter('notarial')}
          activeOpacity={0.8}>
          <Text
            style={[styles.filterPillText, filter === 'notarial' && styles.filterPillTextActive]}>
            Notarial {stats.notarialCount}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ClientFadeIn>
  );

  return (
    <ClientScreenShell>
      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator color={T.gold[1]} />
          <Text style={styles.emptyText}>Loading transactions...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredByCategory}
          keyExtractor={item => item.key}
          renderItem={renderRow}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={[
            styles.listContent,
            {paddingBottom: Math.max(28, 12 + insets.bottom)},
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {allTransactions.length === 0
                  ? 'No transactions yet.'
                  : 'No transactions match your filters.'}
              </Text>
            </View>
          }
        />
      )}
    </ClientScreenShell>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backHit: {alignSelf: 'flex-start', marginBottom: 12},
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: T.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GOLD_SOFT,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minWidth: 0,
    minHeight: 92,
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: T.textSoft,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '800',
    color: T.text,
    marginBottom: 2,
  },
  summaryValueNum: {
    fontSize: 20,
    fontWeight: '800',
    color: T.text,
    marginBottom: 2,
  },
  summaryHint: {
    fontSize: 10,
    color: T.textSoft,
    lineHeight: 13,
  },
  filterRow: {
    marginBottom: 14,
  },
  filterScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 4,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_GOLD_PILL,
    backgroundColor: T.card,
  },
  filterPillActive: {
    backgroundColor: T.gold[1],
    borderColor: T.gold[1],
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textMuted,
  },
  filterPillTextActive: {
    color: T.base,
  },
  /** DATE / AMOUNT only — same width rhythm as rowMeta (above the value row in each card). */
  rowMetaLabels: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: COL.icon + 10,
    paddingRight: 12,
    paddingBottom: 6,
    marginBottom: 2,
  },
  thInline: {
    fontSize: 9,
    fontWeight: '800',
    color: T.textSoft,
    letterSpacing: 0.8,
    opacity: 0.85,
  },
  thAmountGap: {width: 8},
  thPillSpace: {width: 44, height: 1},
  rowCard: {
    backgroundColor: T.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GOLD_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  typeIconWrap: {
    width: COL.icon,
    height: COL.icon,
    borderRadius: 8,
    backgroundColor: T.plasmaA,
    borderWidth: 1,
    borderColor: BORDER_GOLD_MED,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  descBlock: {flex: 1, minWidth: 0, paddingRight: 4},
  descTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: T.text,
    letterSpacing: 0.3,
  },
  descSub: {
    fontSize: 10,
    color: T.textSoft,
    marginTop: 4,
    lineHeight: 14,
  },
  chevronHit: {
    paddingTop: 2,
    paddingLeft: 4,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    marginLeft: COL.icon + 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER_GOLD_SOFT,
  },
  metaDateBlock: {
    justifyContent: 'center',
  },
  metaDate: {
    fontSize: 10,
    fontWeight: '700',
    color: T.textSoft,
  },
  metaTime: {
    fontSize: 9,
    color: T.textSoft,
    marginTop: 2,
  },
  /** Middle column: wide enough for badge + “GCASH” so text doesn’t overflow onto amount (RN default overflow: visible). */
  metaMethodSpacer: {
    minWidth: 108,
    flexShrink: 0,
  },
  metaMethodBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 0,
    minWidth: 108,
    marginRight: 10,
  },
  gcashBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: T.plasmaB,
    borderWidth: 1,
    borderColor: BORDER_GOLD_MED,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  gcashG: {
    color: T.gold[0],
    fontSize: 11,
    fontWeight: '900',
  },
  methodText: {
    fontSize: 11,
    fontWeight: '700',
    color: T.text,
    flexShrink: 0,
  },
  metaRightBlock: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'nowrap',
  },
  amountText: {
    fontSize: 12,
    fontWeight: '800',
    color: T.text,
    marginRight: 8,
    flexShrink: 0,
    textAlign: 'right',
  },
  statusPill: {
    backgroundColor: 'rgba(212, 175, 55, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_GOLD_MED,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: T.gold[0],
    letterSpacing: 0.4,
  },
  expanded: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER_GOLD_MED,
    marginLeft: COL.icon + 10,
  },
  expandedLabel: {fontSize: 10, color: T.textSoft, marginBottom: 4},
  expandedValue: {fontSize: 12, color: T.textMuted, fontFamily: 'monospace'},
  emptyState: {
    borderWidth: 1,
    borderColor: BORDER_GOLD_SOFT,
    borderRadius: 16,
    backgroundColor: T.card,
    padding: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  emptyText: {color: T.textSoft, marginTop: 8, textAlign: 'center'},
});
