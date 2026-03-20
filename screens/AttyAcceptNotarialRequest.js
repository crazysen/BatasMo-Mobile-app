import React, { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  resolveNotarialDocumentUrl,
  updateNotarialRequestStatus,
} from '../services/notarialService';

const ArrowLeft = (props) => <MaterialCommunityIcons name="arrow-left" {...props} />;
const FileText = (props) => <MaterialCommunityIcons name="file-document" {...props} />;
const Calendar = (props) => <MaterialCommunityIcons name="calendar" {...props} />;
const ShieldCheck = (props) => <MaterialCommunityIcons name="shield-check" {...props} />;

const AcceptRequestScreen = ({ navigation, route }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const request = route?.params?.request;
  const title = request?.service_type || route?.params?.title || 'Notarial Request';
  const user = request?.client_name || route?.params?.user || 'Client';
  const caseId = request?.id || route?.params?.caseId || 'N/A';
  const preferredDate = useMemo(() => {
    if (!request?.preferred_date) return 'No preferred date set';
    const value = new Date(request.preferred_date);
    if (Number.isNaN(value.getTime())) return 'No preferred date set';
    return value.toLocaleString();
  }, [request?.preferred_date]);

  const documentName = request?.document_url
    ? request.document_url.split('/').pop()
    : 'No document uploaded';

  const handleConfirm = async () => {
    if (!request?.id) {
      Alert.alert('Error', 'Request details are missing. Please go back and try again.');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateNotarialRequestStatus(request.id, 'accepted');
      navigation.replace('AttyNotarialRequestAccepted', {
        title,
        user,
        caseId,
        preferredDate,
      });
    } catch (error) {
      Alert.alert('Error', error?.message || 'Unable to accept request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDocument = async () => {
    const url = resolveNotarialDocumentUrl(request?.document_url);
    if (!url) {
      Alert.alert('No document', 'This request has no document attached.');
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (_) {
      Alert.alert('Error', 'Unable to open this document on your device.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Accept Notarial Request</Text>
          <Text style={styles.headerSub}>Review details before confirmation</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Request Summary Section */}
        <Text style={styles.sectionLabel}>REQUEST SUMMARY</Text>
        <View style={styles.summaryCard}>
          <View style={styles.iconCircle}>
            <FileText size={24} color="#6366f1" />
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.docTitle}>{title}</Text>
            <Text style={styles.clientName}>Client: <Text style={styles.darkText}>{user}</Text></Text>
            <View style={styles.dateRow}>
              <Calendar size={14} color="#94a3b8" />
              <Text style={styles.dateText}>{preferredDate}</Text>
            </View>
          </View>
        </View>

        {/* Document Review Section */}
        <View style={styles.docReviewHeader}>
          <Text style={styles.sectionLabel}>DOCUMENT REVIEW</Text>
          <TouchableOpacity onPress={openDocument}>
            <Text style={styles.fileNameLink}>{documentName}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pdfContainer}>
          <View style={styles.previewBody}>
            <Text style={styles.previewTitle}>Request Details</Text>
            <Text style={styles.previewText}>{request?.details || 'No additional details provided.'}</Text>
            <Text style={styles.previewHint}>Tap the file name above to open the uploaded document.</Text>
          </View>
        </View>

        {/* Terms Section */}
        <Text style={styles.sectionLabel}>TERMS OF ACCEPTANCE</Text>
        <TouchableOpacity 
          style={styles.termsCard} 
          onPress={() => setIsChecked(!isChecked)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
            {isChecked && <View style={styles.checkboxInner} />}
          </View>
          <Text style={styles.termsText}>
            I confirm that I have reviewed the attached document and it meets the necessary legal requirements for notarization.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.confirmBtn, !isChecked && styles.disabledBtn]}
          disabled={!isChecked || isSubmitting}
          onPress={handleConfirm}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <ShieldCheck size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.confirmBtnText}>Confirm & Accept</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f9' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  headerText: { marginLeft: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#001d57' },
  headerSub: { fontSize: 12, color: '#94a3b8' },
  scrollContent: { padding: 20 },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 12, letterSpacing: 0.5 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  iconCircle: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#f5f3ff', justifyContent: 'center', alignItems: 'center' },
  summaryInfo: { marginLeft: 15 },
  docTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  clientName: { color: '#64748b', fontSize: 14, marginVertical: 2 },
  darkText: { color: '#334155', fontWeight: '500' },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  dateText: { fontSize: 12, color: '#94a3b8', marginLeft: 6 },
  docReviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fileNameLink: { fontSize: 11, color: '#1e3a8a', fontWeight: 'bold', textDecorationLine: 'underline' },
  pdfContainer: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 25 },
  previewBody: { padding: 20, minHeight: 120 },
  previewTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  previewText: { fontSize: 13, color: '#334155', lineHeight: 20 },
  previewHint: { fontSize: 12, color: '#94a3b8', marginTop: 12 },
  termsCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, flexDirection: 'row' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: '#cbd5e1', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { borderColor: '#1e3a8a' },
  checkboxInner: { width: 12, height: 12, borderRadius: 3, backgroundColor: '#1e3a8a' },
  termsText: { flex: 1, color: '#475569', fontSize: 13, lineHeight: 20 },
  footer: { padding: 20, backgroundColor: '#fff' },
  confirmBtn: { backgroundColor: '#001d57', borderRadius: 15, height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  disabledBtn: { opacity: 0.6 },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { alignItems: 'center', marginTop: 15 },
  cancelText: { color: '#64748b', fontWeight: '600' }
});

export default AcceptRequestScreen;
