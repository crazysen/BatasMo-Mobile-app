import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { createNotarialRequest } from '../services/notarialService';
import { REFERENCE_THEME as T } from '../constants/referenceTheme';
import { ClientScreenShell, ClientFadeIn } from '../components/ClientScreenShell';
import ClientChevronBack from '../components/ClientChevronBack';

const HEADER_BACK_COL = 28;
const HEADER_BACK_GAP = 8;
const SUBTITLE_INDENT = HEADER_BACK_COL + HEADER_BACK_GAP;

export default function FaceRecognitionScreen({ navigation, route }) {
  const notarialData = route?.params?.notarialData || {};
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const startScan = () => {
    setIsScanning(true);
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
      
      const response = await createNotarialRequest(notarialData);
      const createdRequest = response?.data ?? response;
      const requestId = createdRequest?.id;

      if (!requestId) {
        Alert.alert(
          'Could not save request',
          'We could not confirm your notarial request. Please check your connection and try again.',
        );
        return;
      }

      navigation.replace('BookingSummary', {
        serviceData: {
          type: notarialData.service_type || 'Affidavit of Loss',
          date:
            createdRequest?.created_at != null
              ? new Date(createdRequest.created_at).toLocaleDateString()
              : 'To be confirmed',
          time: '-',
          amount: '₱4,000',
        },
        paymentContext: {
          sourceType: 'notarial',
          sourceId: requestId,
        },
      });
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Failed to submit notarial request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ClientScreenShell>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ClientFadeIn>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.backColumn}>
              <ClientChevronBack
                onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
              />
            </View>
            <Text style={styles.headerTitle} numberOfLines={2}>
              Face Verification
            </Text>
          </View>
          <Text style={styles.headerSubtitle}>Final verification step</Text>
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
                  <ActivityIndicator size="large" color={T.gold[1]} />
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
                  <ActivityIndicator color={T.base} />
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
        </ClientFadeIn>
      </ScrollView>
    </ClientScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backColumn: {
    width: HEADER_BACK_COL,
    marginRight: HEADER_BACK_GAP,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: T.text,
    lineHeight: 28,
  },
  headerSubtitle: {
    fontSize: 13,
    color: T.textSoft,
    marginTop: 6,
    marginLeft: SUBTITLE_INDENT,
    lineHeight: 18,
  },
  content: { padding: 20 },
  formCard: {
    backgroundColor: 'rgba(18, 26, 36, 0.88)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: T.gold[0], marginBottom: 10, alignSelf: 'flex-start' },
  instructionText: { fontSize: 14, color: T.textMuted, marginBottom: 30, lineHeight: 20, alignSelf: 'flex-start' },
  cameraBox: {
    width: 250,
    height: 300,
    borderWidth: 2,
    borderColor: 'rgba(244, 215, 139, 0.2)',
    borderRadius: 20,
    backgroundColor: 'rgba(4, 7, 11, 0.5)',
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
    borderColor: T.textSoft,
    borderStyle: 'dashed',
    borderRadius: 60,
    marginBottom: 15,
  },
  cameraText: { fontSize: 14, fontWeight: '600', color: T.textSoft },
  scanningContainer: { alignItems: 'center' },
  scanningText: { marginTop: 15, fontSize: 14, color: T.gold[0], fontWeight: '600' },
  successContainer: { alignItems: 'center' },
  successIcon: { fontSize: 60, color: '#6EE7B7' },
  successText: { fontSize: 18, color: '#6EE7B7', fontWeight: '700', marginTop: 10 },
  submitButton: {
    backgroundColor: T.gold[1],
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(148, 163, 184, 0.35)',
  },
  submitButtonText: { color: T.base, fontWeight: '700', fontSize: 16 },
});
