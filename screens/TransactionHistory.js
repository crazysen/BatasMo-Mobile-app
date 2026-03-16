import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const transactions = [
  {
    id: 'TXN-1001',
    description: 'Consultation Payment - Dr. Sarah Johnson',
    amount: '₱2,500.00',
    date: 'Mar 02, 2026',
    status: 'Completed',
  },
  {
    id: 'TXN-1002',
    description: 'Notarial Service Fee',
    amount: '₱1,200.00',
    date: 'Feb 26, 2026',
    status: 'Completed',
  },
];

export default function TransactionHistory({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>Review your payment activity</Text>

        {transactions.map(item => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.id}>{item.id}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <View style={styles.row}>
              <Text style={styles.amount}>{item.amount}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        ))}
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
  status: {fontSize: 12, color: '#16A34A', fontWeight: '700'},
  date: {marginTop: 6, color: '#64748B', fontSize: 12},
});

