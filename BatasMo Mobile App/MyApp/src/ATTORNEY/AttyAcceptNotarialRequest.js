import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, FileText, Calendar, ShieldCheck, Minus, Plus } from 'lucide-react-native';

const AcceptRequestScreen = ({ navigation, route }) => {
  const [isChecked, setIsChecked] = useState(false);
  const title = route?.params?.title || 'Affidavit of Loss';
  const user = route?.params?.user || 'Alice Cooper';
  const caseId = route?.params?.caseId || '#NT-88293';

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
              <Text style={styles.dateText}>Oct 28, 2024 • 11:00 AM</Text>
            </View>
          </View>
        </View>

        {/* Document Review Section */}
        <View style={styles.docReviewHeader}>
          <Text style={styles.sectionLabel}>DOCUMENT REVIEW</Text>
          <Text style={styles.fileNameLink}>affidavit_loss_draft.pdf</Text>
        </View>

        <View style={styles.pdfContainer}>
          <View style={styles.pdfHeader}>
            <View style={styles.windowControls}>
              <View style={[styles.dot, { backgroundColor: '#FF5F56' }]} />
              <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
              <View style={[styles.dot, { backgroundColor: '#27C93F' }]} />
            </View>
            <Text style={styles.pageIndicator}>Page 1 of 3</Text>
          </View>
          
          {/* Mock PDF Content */}
          <View style={styles.pdfBody}>
             <View style={styles.skeletonLineShort} />
             <View style={styles.skeletonLineLong} />
             <View style={styles.skeletonLineLong} />
             <View style={styles.skeletonLineLong} />
             <View style={styles.skeletonLineLong} />
             <View style={styles.skeletonLineMedium} />
          </View>

          {/* Zoom Controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomBtn}><Minus size={18} color="#fff" /></TouchableOpacity>
            <View style={styles.zoomDivider} />
            <TouchableOpacity style={styles.zoomBtn}><Plus size={18} color="#fff" /></TouchableOpacity>
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
          disabled={!isChecked}
          onPress={() => navigation.navigate('AttyNotarialRequestAccepted', { title, user, caseId })}
        >
          <ShieldCheck size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.confirmBtnText}>Confirm & Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn}>
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
  pdfHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  windowControls: { flexDirection: 'row' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  pageIndicator: { fontSize: 11, color: '#94a3b8' },
  pdfBody: { padding: 40, alignItems: 'center', minHeight: 250 },
  skeletonLineShort: { width: '40%', height: 15, backgroundColor: '#f1f5f9', marginBottom: 15 },
  skeletonLineLong: { width: '100%', height: 10, backgroundColor: '#f1f5f9', marginBottom: 10 },
  skeletonLineMedium: { width: '70%', height: 10, backgroundColor: '#f1f5f9' },
  zoomControls: { position: 'absolute', bottom: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, flexDirection: 'row', padding: 4 },
  zoomBtn: { padding: 4 },
  zoomDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 4 },
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