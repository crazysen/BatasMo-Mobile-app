import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const GCashPayment = ({navigation, route}) => {
  const [pin, setPin] = useState('••'); // Simulating two digits entered
  const paymentMethod = route?.params?.paymentMethod || 'GCash';
  const serviceData = route?.params?.serviceData || { amount: '₱2,500' };

  const handlePayNow = () => {
    navigation.navigate('PaymentSuccessful', { amount: serviceData.amount });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Helper to render the PIN dots
  const PinDots = () => (
    <View style={styles.pinContainer}>
      {[1, 2, 3, 4].map((i) => (
        <View 
          key={i} 
          style={[
            styles.dot, 
            i <= pin.length ? styles.dotFilled : styles.dotEmpty
          ]} 
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Dark Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerLabel}>GCash Payment</Text>
        
        <View style={styles.amountContainer}>
          <Text style={styles.totalAmountLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.amountValue}>{serviceData.amount}</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* GCash Branding */}
        <View style={styles.brandRow}>
          <View style={styles.gcashIcon}>
            <Text style={styles.gcashIconText}>📱</Text>
          </View>
          <Text style={styles.gcashText}>GCash</Text>
        </View>

        <Text style={styles.instructionText}>
          Please enter your 4-digit GCash MPIN to secure your transaction.
        </Text>

        {/* PIN Input Visualization */}
        <PinDots />

        {/* Action Buttons */}
        <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel and go back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  backButton: { position: 'absolute', left: 20, top: 20 },
  backIcon: { color: 'white', fontSize: 32 },
  headerLabel: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  amountContainer: { alignItems: 'center', marginTop: 30 },
  totalAmountLabel: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  amountValue: { color: 'white', fontSize: 48, fontWeight: 'bold', marginTop: 8 },
  
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 30, paddingTop: 40 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  gcashIcon: { 
    backgroundColor: '#007AFF', 
    width: 44, 
    height: 44, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 12 
  },
  gcashIconText: { fontSize: 24 },
  gcashText: { fontSize: 28, fontWeight: 'bold', color: '#007AFF' },
  
  instructionText: { 
    textAlign: 'center', 
    color: '#64748B', 
    lineHeight: 22, 
    fontSize: 15,
    marginBottom: 40,
    paddingHorizontal: 10
  },
  
  pinContainer: { flexDirection: 'row', marginBottom: 60 },
  dot: { width: 16, height: 16, borderRadius: 8, marginHorizontal: 10 },
  dotFilled: { backgroundColor: '#0F172A' },
  dotEmpty: { borderWidth: 2, borderColor: '#E2E8F0', backgroundColor: 'transparent' },
  
  payButton: { 
    backgroundColor: '#0F172A', 
    width: '100%', 
    paddingVertical: 18, 
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4
  },
  payButtonText: { textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { marginTop: 25 },
  cancelText: { color: '#64748B', fontWeight: '600' }
});

export default GCashPayment;