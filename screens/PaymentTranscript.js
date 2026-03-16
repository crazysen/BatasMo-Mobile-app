import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PaymentTranscript({navigation, route}) {
  const transactionId = route?.params?.transactionId || 'BTMS-UNKNOWN';
  const amount = route?.params?.amount || '₱0.00';
  const paymentContext = route?.params?.paymentContext || null;
  const serviceData = route?.params?.serviceData || null;

  const sourceType = paymentContext?.sourceType === 'notarial' ? 'Notarial Request' : 'Appointment';
  const sourceId = paymentContext?.sourceId || 'N/A';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Payment Transcript</Text>
        <Text style={styles.subtitle}>Your payment is recorded and the service is now completed.</Text>

        <View style={styles.card}>
          <Row label="Status" value="Completed" />
          <Row label="Transaction ID" value={transactionId} />
          <Row label="Amount" value={amount} />
          <Row label="Service" value={serviceData?.type || sourceType} />
          <Row label="Reference Type" value={sourceType} />
          <Row label="Reference ID" value={sourceId} />
        </View>

        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'HomepageClient'}]})}>
          <Text style={styles.dashboardText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({label, value}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  backText: {
    color: '#EAB308',
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '700',
  },
  dashboardButton: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 14,
  },
  dashboardText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});
