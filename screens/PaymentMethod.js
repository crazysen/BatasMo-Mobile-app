import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentMethod({navigation, route}) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const serviceData = route?.params?.serviceData || { type: 'Consultation', amount: '₱2,500' };

  const paymentMethods = [
    { id: 'gcash', name: 'GCash', icon: '📱', description: 'Mobile wallet payment' },
    { id: 'paypal', name: 'PayPal', icon: '🏦', description: 'PayPal account' },
    { id: 'banktransfer', name: 'Bank Transfer', icon: '🏧', description: 'Direct bank transfer' },
  ];

  const handleContinue = () => {
    if (selectedMethod) {
      navigation.navigate('Payment', { paymentMethod: selectedMethod, serviceData });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Payment Method</Text>
          <Text style={styles.headerSubtitle}>Select how you want to pay</Text>
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>{serviceData.amount}</Text>
        </View>

        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodContent}>
                <Text style={styles.methodIcon}>{method.icon}</Text>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedMethod === method.id && styles.radioButtonSelected,
                ]}
              >
                {selectedMethod === method.id && <Text style={styles.radioCheck}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.continueButton, !selectedMethod && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!selectedMethod}
          >
            <Text style={styles.continueButtonText}>Continue to Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  backIcon: {
    fontSize: 32,
    color: '#0F172A',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  amountBox: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#0F172A',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  amountLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  amountValue: {
    color: '#EAB308',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  methodsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  methodCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  methodCardSelected: {
    borderColor: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  methodContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 12,
    color: '#64748B',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  radioCheck: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  continueButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  continueButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelText: {
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
  },
});

