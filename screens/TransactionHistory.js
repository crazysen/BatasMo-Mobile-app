import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getMyAppointments} from '../services/appointmentService';
import {REFERENCE_THEME as T} from '../constants/referenceTheme';
import {ClientScreenShell, ClientFadeIn} from '../components/ClientScreenShell';
import ClientChevronBack from '../components/ClientChevronBack';
import {getNotarialRequests} from '../services/notarialService';

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `₱${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

export default function TransactionHistory({navigation}) {
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const transactions = useMemo(() => {
    const appointmentTx = appointments
      .filter(item => ['confirmed', 'completed'].includes((item.status ?? '').toLowerCase()))
      .map(item => ({
        id: `APT-${item.id.slice(0, 8).toUpperCase()}`,
        description: `Consultation Payment - ${item.attorney_name ?? 'Attorney'}`,
        amount: formatCurrency(item.amount || 2500),
        date: item.updated_at || item.created_at,
        status: (item.status ?? 'confirmed').toLowerCase() === 'completed' ? 'Completed' : 'Pending Payment',
      }));

    const requestTx = requests
      .filter(item => ['accepted', 'completed'].includes((item.status ?? '').toLowerCase()))
      .map(item => ({
        id: `NOT-${item.id.slice(0, 8).toUpperCase()}`,
        description: `Notarial Service Fee - ${item.service_type}`,
        amount: formatCurrency(4000),
        date: item.updated_at || item.created_at,
        status: (item.status ?? 'accepted').toLowerCase() === 'completed' ? 'Completed' : 'Pending Payment',
      }));

    return [...appointmentTx, ...requestTx]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((item, index) => ({
        ...item,
        dateLabel: new Date(item.date).toLocaleDateString(),
        key: `${item.id}-${index}`,
      }));
  }, [appointments, requests]);

  return (
    <ClientScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <ClientFadeIn>
        <ClientChevronBack
          style={styles.backHit}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
        />

        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>Review your payment activity</Text>
        </ClientFadeIn>

        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color={T.gold[1]} />
            <Text style={styles.emptyText}>Loading transactions...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet.</Text>
          </View>
        ) : (
          transactions.map((item, index) => (
            <ClientFadeIn key={item.key} delay={70 + index * 45}>
            <View style={styles.card}>
              <Text style={styles.id}>{item.id}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <View style={styles.row}>
                <Text style={styles.amount}>{item.amount}</Text>
                <Text
                  style={[
                    styles.status,
                    item.status === 'Completed' ? styles.statusCompleted : styles.statusPending,
                  ]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.date}>{item.dateLabel}</Text>
            </View>
            </ClientFadeIn>
          ))
        )}
      </ScrollView>
    </ClientScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {padding: 20, paddingBottom: 24},
  backHit: {alignSelf: 'flex-start', marginBottom: 10},
  title: {fontSize: 28, color: T.text, fontWeight: 'bold'},
  subtitle: {color: T.textSoft, marginBottom: 16},
  card: {
    backgroundColor: 'rgba(18, 26, 36, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
    padding: 14,
    marginBottom: 12,
  },
  id: {fontSize: 12, color: T.textSoft, marginBottom: 4},
  desc: {fontSize: 14, color: T.text, marginBottom: 8},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  amount: {fontSize: 16, fontWeight: '700', color: T.gold[0]},
  status: {fontSize: 12, fontWeight: '700'},
  statusCompleted: {color: '#6EE7B7'},
  statusPending: {color: T.gold[0]},
  date: {marginTop: 6, color: T.textSoft, fontSize: 12},
  emptyState: {
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
    borderRadius: 16,
    backgroundColor: 'rgba(18, 26, 36, 0.62)',
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {color: T.textSoft, marginTop: 8},
});
