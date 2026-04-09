import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { REFERENCE_THEME as T } from '../constants/referenceTheme';
import { ClientScreenShell, ClientFadeInSoft } from '../components/ClientScreenShell';
import ClientChevronBack from '../components/ClientChevronBack';
import {updateAppointmentStatus, createAppointment} from '../services/appointmentService';
import {updateNotarialRequestStatus} from '../services/notarialService';

export default function Payment({navigation, route}) {
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const paymentMethod = route?.params?.paymentMethod || 'gcash';
  const serviceData = route?.params?.serviceData || { amount: '₱2,500' };
  const paymentContext = route?.params?.paymentContext || null;

  const getPaymentMethodLabel = () => {
    const methods = {
      gcash: 'GCash',
      paypal: 'PayPal',
      card: 'Credit/Debit Card',
      banktransfer: 'Bank Transfer',
    };
    return methods[String(paymentMethod).toLowerCase()] || 'Payment';
  };

  const getMethodIcon = () => {
    const normalizedMethod = String(paymentMethod).toLowerCase();
    if (normalizedMethod === 'gcash') return '📱';
    if (normalizedMethod === 'paypal') return '🏦';
    if (normalizedMethod === 'card') return '💳';
    return '🏧';
  };

  const completePaidService = async () => {
    if (!paymentContext?.sourceType) {
      return;
    }

    if (paymentContext.sourceType === 'appointment_booking' && paymentContext.payload) {
      await createAppointment(paymentContext.payload);
      return;
    }

    if (!paymentContext?.sourceId) return;

    if (paymentContext.sourceType === 'appointment') {
      await updateAppointmentStatus(paymentContext.sourceId, 'completed');
      return;
    }

    if (paymentContext.sourceType === 'notarial') {
      await updateNotarialRequestStatus(paymentContext.sourceId, 'accepted');
    }
  };

  const handlePayNow = async () => {
    if (pin.length !== 4 || submitting) {
      return;
    }

    const needsSourceId =
      paymentContext?.sourceType === 'notarial' ||
      paymentContext?.sourceType === 'appointment';
    if (needsSourceId && !paymentContext?.sourceId) {
      Alert.alert(
        'Cannot complete payment',
        'This booking is missing a reference. Go back to the summary and try again, or restart the request.',
      );
      return;
    }

    try {
      setSubmitting(true);
      await completePaidService();

      const transactionId = `BTMS-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      navigation.replace('PaymentSuccessful', {
        amount: serviceData.amount,
        transactionId,
        paymentContext,
        serviceData,
      });
    } catch (error) {
      Alert.alert('Payment Failed', error?.message ?? 'Unable to complete payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.canGoBack() ? navigation.goBack() : null;
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
    <ClientScreenShell>
      <ClientFadeInSoft style={styles.fill}>
      <View style={styles.header}>
        <ClientChevronBack onPress={handleCancel} style={styles.backButton} />

        <Text style={styles.headerLabel}>{getPaymentMethodLabel()} Payment</Text>
        
        <View style={styles.amountContainer}>
          <Text style={styles.totalAmountLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.amountValue}>{serviceData.amount}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.gcashIcon}>
            <Text style={styles.gcashIconText}>{getMethodIcon()}</Text>
          </View>
          <Text style={styles.gcashText}>{getPaymentMethodLabel()}</Text>
        </View>

        <Text style={styles.instructionText}>
          Please enter your 4-digit PIN to secure your transaction.
        </Text>

        <PinDots />

        <Keypad />

        <TouchableOpacity 
          style={[styles.payButton, (pin.length < 4 || submitting) && styles.payButtonDisabled]} 
          onPress={handlePayNow}
          disabled={pin.length < 4 || submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={T.base} />
          ) : (
            <Text style={styles.payButtonText}>Pay Now</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel and go back</Text>
        </TouchableOpacity>
      </View>
      </ClientFadeInSoft>
    </ClientScreenShell>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    backgroundColor: 'rgba(18, 26, 36, 0.95)',
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
  },
  backButton: { position: 'absolute', left: 16, top: 18 },
  headerLabel: { color: T.text, fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  amountContainer: { alignItems: 'center', marginTop: 30 },
  totalAmountLabel: { color: T.textSoft, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  amountValue: { color: T.gold[0], fontSize: 48, fontWeight: 'bold', marginTop: 8 },
  
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 30, paddingTop: 40 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  gcashIcon: { 
    backgroundColor: 'rgba(59, 130, 246, 0.35)', 
    width: 44, 
    height: 44, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.4)',
  },
  gcashIconText: { fontSize: 24 },
  gcashText: { fontSize: 28, fontWeight: 'bold', color: '#60A5FA' },
  
  instructionText: { 
    textAlign: 'center', 
    color: T.textSoft, 
    lineHeight: 22, 
    fontSize: 15,
    marginBottom: 40,
    paddingHorizontal: 10
  },
  
  pinContainer: { flexDirection: 'row', marginBottom: 30 },
  dot: { width: 16, height: 16, borderRadius: 8, marginHorizontal: 10 },
  dotFilled: { backgroundColor: T.gold[1] },
  dotEmpty: { borderWidth: 2, borderColor: 'rgba(244, 215, 139, 0.35)', backgroundColor: 'transparent' },

  keypad: { width: '100%', marginBottom: 30 },
  keypadRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  keypadButton: { 
    width: 70, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
  },
  keypadButtonEmpty: { backgroundColor: 'transparent', borderWidth: 0 },
  keypadText: { fontSize: 24, fontWeight: '600', color: T.text },
  
  payButton: { 
    backgroundColor: T.gold[1], 
    width: '100%', 
    paddingVertical: 18, 
    borderRadius: 15,
    shadowColor: 'rgba(212, 175, 55, 0.45)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6
  },
  payButtonText: { textAlign: 'center', color: T.base, fontWeight: 'bold', fontSize: 16 },
  payButtonDisabled: { backgroundColor: 'rgba(148, 163, 184, 0.4)' },
  cancelButton: { marginTop: 25 },
  cancelText: { color: T.textSoft, fontWeight: '600' }
});

