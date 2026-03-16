import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Payment({navigation, route}) {
  const [pin, setPin] = useState('');
  const paymentMethod = route?.params?.paymentMethod || 'gcash';
  const serviceData = route?.params?.serviceData || { amount: '₱2,500' };

  const getPaymentMethodLabel = () => {
    const methods = {
      gcash: 'GCash',
      paypal: 'PayPal',
      banktransfer: 'Bank Transfer'
    };
    return methods[paymentMethod] || 'Payment';
  };

  const handlePayNow = () => {
    if (pin.length === 4) {
      navigation.navigate('PaymentSuccessful', { amount: serviceData.amount });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleKeyPress = (digit) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

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

  const Keypad = () => (
    <View style={styles.keypad}>
      {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', '⌫']].map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keypadRow}>
          {row.map((key, keyIndex) => (
            <TouchableOpacity
              key={keyIndex}
              style={[styles.keypadButton, key === '' && styles.keypadButtonEmpty]}
              onPress={() => {
                if (key === '⌫') handleBackspace();
                else if (key !== '') handleKeyPress(key);
              }}
              disabled={key === ''}
            >
              <Text style={styles.keypadText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerLabel}>{getPaymentMethodLabel()} Payment</Text>
        
        <View style={styles.amountContainer}>
          <Text style={styles.totalAmountLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.amountValue}>{serviceData.amount}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.gcashIcon}>
            <Text style={styles.gcashIconText}>
              {paymentMethod === 'gcash' ? '📱' : paymentMethod === 'paypal' ? '🏦' : '🏧'}
            </Text>
          </View>
          <Text style={styles.gcashText}>{getPaymentMethodLabel()}</Text>
        </View>

        <Text style={styles.instructionText}>
          Please enter your 4-digit PIN to secure your transaction.
        </Text>

        <PinDots />

        <Keypad />

        <TouchableOpacity 
          style={[styles.payButton, pin.length < 4 && styles.payButtonDisabled]} 
          onPress={handlePayNow}
          disabled={pin.length < 4}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel and go back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  
  pinContainer: { flexDirection: 'row', marginBottom: 30 },
  dot: { width: 16, height: 16, borderRadius: 8, marginHorizontal: 10 },
  dotFilled: { backgroundColor: '#0F172A' },
  dotEmpty: { borderWidth: 2, borderColor: '#E2E8F0', backgroundColor: 'transparent' },

  keypad: { width: '100%', marginBottom: 30 },
  keypadRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  keypadButton: { 
    width: 70, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 12 
  },
  keypadButtonEmpty: { backgroundColor: 'transparent' },
  keypadText: { fontSize: 24, fontWeight: '600', color: '#0F172A' },
  
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
  payButtonDisabled: { backgroundColor: '#94A3B8' },
  cancelButton: { marginTop: 25 },
  cancelText: { color: '#64748B', fontWeight: '600' }
});

