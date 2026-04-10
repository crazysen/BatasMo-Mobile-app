import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const NotarialServiceScreen = () => {
  const [activeTab, setActiveTab] = useState('New Request');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notarial Service Request</Text>
          <Text style={styles.headerSubtitle}>Submit your documents for notarization</Text>
        </View>
      </View>

      {/* Segmented Tab Control */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'New Request' && styles.activeTab]}
          onPress={() => setActiveTab('New Request')}
        >
          <Text style={[styles.tabText, activeTab === 'New Request' && styles.activeTabText]}>
            New Request
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Request Status' && styles.activeTab]}
          onPress={() => setActiveTab('Request Status')}
        >
          <Text style={[styles.tabText, activeTab === 'Request Status' && styles.activeTabText]}>
            Request Status
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'New Request' ? <NewRequestForm /> : <RequestStatusList />}
        
        {/* Quick Tips Section */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <MaterialCommunityIcons name="check-decagram-outline" size={20} color="#1E40AF" />
            <Text style={styles.tipsTitle}>Quick Tips</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Ensure all documents are clear and legible</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Upload documents in PDF format when possible</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Requests typically processed within 24-48 hours</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>You'll receive email confirmation once approved</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Sub-Component: New Request Form ---
const NewRequestForm = () => (
  <View style={styles.formCard}>
    <Text style={styles.sectionTitle}>New Request</Text>
    
    <Text style={styles.inputLabel}>Type of Document</Text>
    <View style={styles.pickerSubstitute}>
      <Text style={styles.pickerText}>Select document type</Text>
      <Feather name="chevron-down" size={20} color="#64748B" />
    </View>

    <Text style={styles.inputLabel}>Upload Document</Text>
    <TouchableOpacity style={styles.uploadArea}>
      <Feather name="upload" size={30} color="#1E40AF" />
      <Text style={styles.uploadMainText}>Click to upload or drag and drop</Text>
      <Text style={styles.uploadSubText}>PDF, DOC, DOCX (max 10MB)</Text>
    </TouchableOpacity>

    <View style={styles.row}>
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text style={styles.inputLabel}><Feather name="calendar" /> Preferred Date</Text>
        <TextInput style={styles.input} placeholder="mm/dd/yyyy" placeholderTextColor="#94A3B8" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.inputLabel}><Feather name="clock" /> Preferred Time</Text>
        <View style={styles.pickerSubstitute}>
          <Text style={styles.pickerText}>Select time</Text>
          <Feather name="chevron-down" size={18} color="#64748B" />
        </View>
      </View>
    </View>

    <Text style={styles.inputLabel}>Additional Notes</Text>
    <TextInput 
      style={[styles.input, styles.textArea]} 
      placeholder="Any special instructions or requirements..."
      multiline
      numberOfLines={4}
    />

    <TouchableOpacity style={styles.submitButton}>
      <Text style={styles.submitButtonText}>Submit Request</Text>
    </TouchableOpacity>
  </View>
);

// --- Sub-Component: Request Status List ---
const RequestStatusList = () => (
  <View style={styles.statusContainer}>
    <Text style={styles.sectionTitle}>Request Status</Text>

    {/* Pending Item */}
    <View style={styles.statusCard}>
      <View style={styles.statusHeaderRow}>
        <Text style={styles.docTypeTitle}>Affidavit</Text>
        <View style={[styles.badge, { backgroundColor: '#FEF9C3' }]}>
          <Text style={[styles.badgeText, { color: '#854D0E' }]}>PENDING</Text>
        </View>
      </View>
      <Text style={styles.subInfoText}>Submitted on 2/16/2026</Text>
      <View style={styles.scheduleRow}>
        <Feather name="calendar" size={14} color="#64748B" />
        <Text style={styles.scheduleText}>Scheduled: 2/19/2026 at 10:00 AM</Text>
      </View>
      <View style={styles.alertBox}>
        <Feather name="info" size={14} color="#854D0E" />
        <Text style={styles.alertText}>Waiting for approval. Payment required after approval.</Text>
      </View>
    </View>

    {/* Approved Item */}
    <View style={styles.statusCard}>
      <View style={styles.statusHeaderRow}>
        <Text style={styles.docTypeTitle}>Power of Attorney</Text>
        <View style={[styles.badge, { backgroundColor: '#1E293B' }]}>
          <Text style={[styles.badgeText, { color: '#FFF' }]}>APPROVED</Text>
        </View>
      </View>
      <Text style={styles.subInfoText}>Submitted on 2/12/2026</Text>
      <View style={styles.scheduleRow}>
        <Feather name="calendar" size={14} color="#64748B" />
        <Text style={styles.scheduleText}>Scheduled: 2/15/2026 at 2:00 PM</Text>
      </View>
      <TouchableOpacity style={styles.paymentButton}>
        <Text style={styles.paymentButtonText}>Proceed to Payment - ₱4,000.00</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center' },
  headerTitleContainer: { marginLeft: 15 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  headerSubtitle: { fontSize: 13, color: '#64748B' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  activeTabText: { color: '#1E40AF' },
  scrollContent: { paddingBottom: 30 },
  formCard: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 20, padding: 20, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 15 },
  pickerSubstitute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
  pickerText: { color: '#1E293B' },
  uploadArea: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  uploadMainText: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginTop: 10 },
  uploadSubText: { fontSize: 12, color: '#64748B', marginTop: 4 },
  row: { flexDirection: 'row' },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    color: '#1E293B',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitButton: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 25,
  },
  submitButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  statusContainer: { marginHorizontal: 20 },
  statusCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 1 },
  statusHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docTypeTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  subInfoText: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  scheduleText: { fontSize: 13, color: '#475569', marginLeft: 6 },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  alertText: { fontSize: 12, color: '#92400E', marginLeft: 8, flex: 1 },
  paymentButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
  },
  paymentButtonText: { color: '#FFF', fontWeight: '700' },
  tipsCard: { backgroundColor: '#EFF6FF', margin: 20, borderRadius: 20, padding: 20 },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  tipsTitle: { fontSize: 16, fontWeight: '700', color: '#1E3A8A', marginLeft: 10 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  tipDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#1E40AF', marginTop: 8, marginRight: 10 },
  tipText: { fontSize: 13, color: '#334155', flex: 1 },
});

export default NotarialServiceScreen;