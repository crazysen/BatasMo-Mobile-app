import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentSuccessful({navigation, route}) {
  const amount = route?.params?.amount || '₱2,500.00';
  const transactionId = route?.params?.transactionId || 'BTMS-UNKNOWN';

  const handleBackToDashboard = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'HomepageClient'}],
    });
  };

  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>

        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.transactionId}>TRANSACTION ID: {transactionId}</Text>

        <View style={styles.completedPill}>
          <Text style={styles.completedPillText}>STATUS: COMPLETED</Text>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>AMOUNT PAID</Text>
          <Text style={styles.amountValue}>{amount}</Text>
        </View>

        <Text style={styles.infoText}>
          A digital receipt has been sent to your email and is available in your 
          <Text style={styles.boldText}> Documents vault</Text>.
        </Text>

        <TouchableOpacity style={styles.dashboardButton} onPress={handleBackToDashboard}>
          <Text style={styles.buttonText}>Go back to dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D9B041',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  transactionId: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  completedPill: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 24,
  },
  completedPillText: {
    color: '#166534',
    fontWeight: '700',
    fontSize: 12,
  },
  amountCard: {
    backgroundColor: '#1E293B',
    width: '100%',
    paddingVertical: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  amountLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  amountValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#475569',
  },
  dashboardButton: {
    backgroundColor: '#D9B041',
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#D9B041',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

