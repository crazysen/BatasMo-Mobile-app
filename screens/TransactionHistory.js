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
import {SafeAreaView} from 'react-native-safe-area-context';
import {getMyAppointments} from '../services/appointmentService';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>Review your payment activity</Text>

        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color="#0F172A" />
            <Text style={styles.emptyText}>Loading transactions...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet.</Text>
          </View>
        ) : (
          transactions.map(item => (
            <View key={item.key} style={styles.card}>
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
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  content: {padding: 20, paddingBottom: 24},
  backButton: {alignSelf: 'flex-start', marginBottom: 10},
  backText: {color: '#EAB308', fontWeight: '700', fontSize: 16},
  title: {fontSize: 28, color: '#0F172A', fontWeight: 'bold'},
  subtitle: {color: '#64748B', marginBottom: 16},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  id: {fontSize: 12, color: '#94A3B8', marginBottom: 4},
  desc: {fontSize: 14, color: '#0F172A', marginBottom: 8},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  amount: {fontSize: 16, fontWeight: '700', color: '#0F172A'},
  status: {fontSize: 12, fontWeight: '700'},
  statusCompleted: {color: '#16A34A'},
  statusPending: {color: '#B45309'},
  date: {marginTop: 6, color: '#64748B', fontSize: 12},
  emptyState: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {color: '#64748B', marginTop: 8},
});
