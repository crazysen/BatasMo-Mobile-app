import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNotarialRequest } from '../services/notarialService';

export default function FaceRecognitionScreen({ navigation, route }) {
  const notarialData = route?.params?.notarialData || {};
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    // Simulate Face Scan Delay
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2000);
  };

  const handleProceed = async () => {
    if (!scanComplete) {
      Alert.alert('Error', 'Please complete the face scan first.');
      return;
    }

    try {
      setSubmitting(true);
      
      // The old flow created a service request here
      // But now we create it, mark it depending on payment, and then go to payment.
      // For now, let's create the Request so we have an ID for Payment.
      
      const response = await createNotarialRequest(notarialData);
      const createdRequest = response?.data || response;
      const requestId = createdRequest?.id;

      if (!requestId) {
          // If we can't fetch it, we can still proceed to payment but it might be unsafe.
          console.warn('Failed to retrieve request ID from create API');
      }

      navigation.replace('BookingSummary', {
        serviceData: {
          type: notarialData.service_type || 'Affidavit of Loss',
          date:
            createdRequest?.created_at != null
              ? new Date(createdRequest.created_at).toLocaleDateString()
              : 'To be confirmed',
          time: '-',
          amount: '₱4,000', // Mock amount or fetch from somewhere
        },
        paymentContext: {
          sourceType: 'notarial',
          sourceId: requestId, // will be updated to 'completed' or 'accepted' on payment success
        },
      });
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Failed to submit notarial request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Face Verification</Text>
          <Text style={styles.headerSubtitle}>
             Final verification step
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Face Recognition</Text>
          <Text style={styles.instructionText}>
            Position your face within the frame and click Start Scan to verify your identity.
          </Text>

          <View style={styles.cameraBox}>
            {isScanning ? (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color="#EAB308" />
                <Text style={styles.scanningText}>Scanning face...</Text>
              </View>
            ) : scanComplete ? (
              <View style={styles.successContainer}>
                <Text style={styles.successIcon}>✓</Text>
                <Text style={styles.successText}>Scan Complete!</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.dummyCameraArea} onPress={startScan}>
                <View style={styles.faceOutline} />
                <Text style={styles.cameraText}>Tap to Start Scan</Text>
              </TouchableOpacity>
            )}
          </View>

          {scanComplete ? (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleProceed}
              disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Proceed to Payment</Text>
              )}
            </TouchableOpacity>
          ) : (
             <TouchableOpacity
             style={[styles.submitButton, styles.submitButtonDisabled]}
             disabled={true}>
             <Text style={styles.submitButtonText}>Proceed to Payment</Text>
           </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, flexDirection: 'row', alignItems: 'flex-start' },
  backButton: { paddingVertical: 6, marginRight: 8 },
  backText: { color: '#EAB308', fontWeight: '700', fontSize: 16 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  headerSubtitle: { fontSize: 13, color: '#64748B' },
  content: { padding: 20 },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 10, alignSelf: 'flex-start' },
  instructionText: { fontSize: 14, color: '#475569', marginBottom: 30, lineHeight: 20, alignSelf: 'flex-start' },
  cameraBox: {
    width: 250,
    height: 300,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden',
  },
  dummyCameraArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOutline: {
    width: 120,
    height: 160,
    borderWidth: 3,
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
    borderRadius: 60,
    marginBottom: 15,
  },
  cameraText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  scanningContainer: { alignItems: 'center' },
  scanningText: { marginTop: 15, fontSize: 14, color: '#EAB308', fontWeight: '600' },
  successContainer: { alignItems: 'center' },
  successIcon: { fontSize: 60, color: '#22C55E' },
  successText: { fontSize: 18, color: '#22C55E', fontWeight: '700', marginTop: 10 },
  submitButton: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
