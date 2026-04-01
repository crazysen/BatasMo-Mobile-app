import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingSummary({navigation, route}) {
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  const serviceData = route?.params?.serviceData || { type: 'Power of Attorney', date: 'February 15, 2026', time: '2:00 PM', amount: '₱2,500' };
  const paymentContext = route?.params?.paymentContext || null;

  const handleProceedToPayment = () => {
    navigation.navigate('Payment', { paymentMethod, serviceData, paymentContext });
  };

  const handleClose = () => {
    navigation.canGoBack() ? navigation.goBack() : null;
  };

  const PaymentOption = ({ id, label, icon, color }) => (
    <TouchableOpacity 
      style={[
        styles.paymentCard, 
        paymentMethod === id && styles.paymentCardActive
      ]}
      onPress={() => setPaymentMethod(id)}
    >
      <View style={[styles.paymentIconContainer, { backgroundColor: color }]}>
        <Text style={styles.paymentIconText}>{icon}</Text>
      </View>
      <Text style={styles.paymentLabel}>{label}</Text>
      <View style={[
        styles.radioCircle, 
        paymentMethod === id && styles.radioCircleActive
      ]}>
        {paymentMethod === id && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking Summary</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Appointment Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Attorney:</Text>
              <Text style={styles.detailValue}>Notary Public</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service Type:</Text>
              <Text style={styles.detailValue}>{serviceData.type}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time:</Text>
              <Text style={styles.detailValue}>{serviceData.date} at {serviceData.time}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.totalLabel}>Consultation Fee:</Text>
              <Text style={styles.feeAmount}>{serviceData.amount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.totalLabelBold}>Total Amount:</Text>
              <Text style={styles.totalAmount}>{serviceData.amount}</Text>
            </View>
          </View>

          <Text style={styles.selectionTitle}>Select Payment Method</Text>
          
          <PaymentOption id="gcash" label="GCash" icon="📱" color="#3B82F6" />

          <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToPayment}>
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', padding: 16 },
  modalContent: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  header: { 
    backgroundColor: '#1E293B', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    alignItems: 'center' 
  },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  closeIcon: { color: '#FFFFFF', fontSize: 18 },
  scrollBody: { padding: 20 },
  detailsContainer: { 
    backgroundColor: '#F8FAFC', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 24 
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { color: '#64748B', fontSize: 14 },
  detailValue: { color: '#1E293B', fontSize: 14, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 10 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  totalLabel: { color: '#1E293B', fontSize: 15, fontWeight: '600' },
  totalLabelBold: { color: '#1E293B', fontSize: 16, fontWeight: 'bold' },
  feeAmount: { color: '#D9B041', fontSize: 18, fontWeight: 'bold' },
  totalAmount: { color: '#000000', fontSize: 20, fontWeight: 'bold' },
  selectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  paymentCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    marginBottom: 12 
  },
  paymentCardActive: { borderColor: '#1E293B', borderWidth: 1.5 },
  paymentIconContainer: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  paymentIconText: { fontSize: 20 },
  paymentLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  radioCircleActive: { borderColor: '#D9B041' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#D9B041' },
  proceedButton: { 
    backgroundColor: '#1E293B', 
    paddingVertical: 16, 
    borderRadius: 12, 
    marginTop: 12,
    alignItems: 'center'
  },
  proceedButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

