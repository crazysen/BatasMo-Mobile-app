import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClientNotarial({navigation}) {
  const [activeTab, setActiveTab] = useState('New Request');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notarial Service Request</Text>
          <Text style={styles.headerSubtitle}>
            Submit your documents for notarization
          </Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'New Request' && styles.activeTab]}
          onPress={() => setActiveTab('New Request')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'New Request' && styles.activeTabText,
            ]}>
            New Request
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Request Status' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Request Status')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Request Status' && styles.activeTabText,
            ]}>
            Request Status
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {activeTab === 'New Request' ? <NewRequestForm navigation={navigation} /> : <RequestStatusList navigation={navigation} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const NewRequestForm = ({navigation}) => (
  <View style={styles.formCard}>
    <Text style={styles.sectionTitle}>New Request</Text>

    <Text style={styles.inputLabel}>Type of Document</Text>
    <TextInput style={styles.input} placeholder="Affidavit / Contract / POA" />

    <Text style={styles.inputLabel}>Upload Document</Text>
    <TouchableOpacity
      style={styles.uploadArea}
      onPress={() => Alert.alert('Upload', 'Document upload picker coming soon')}>
      <Text style={styles.uploadMainText}>Click to upload your document</Text>
      <Text style={styles.uploadSubText}>PDF, DOC, DOCX (max 10MB)</Text>
    </TouchableOpacity>

    <View style={styles.row}>
      <View style={styles.halfInputLeft}>
        <Text style={styles.inputLabel}>Preferred Date</Text>
        <TextInput style={styles.input} placeholder="mm/dd/yyyy" />
      </View>
      <View style={styles.halfInputRight}>
        <Text style={styles.inputLabel}>Preferred Time</Text>
        <TextInput style={styles.input} placeholder="10:00 AM" />
      </View>
    </View>

    <Text style={styles.inputLabel}>Additional Notes</Text>
    <TextInput
      style={[styles.input, styles.textArea]}
      placeholder="Any special instructions or requirements..."
      multiline
      numberOfLines={4}
    />

    <TouchableOpacity
      style={styles.submitButton}
      onPress={() => navigation.navigate('NotarialRequestSubmitted')}>
      <Text style={styles.submitButtonText}>Submit Request</Text>
    </TouchableOpacity>
  </View>
);

const RequestStatusList = ({navigation}) => (
  <View style={styles.statusContainer}>
    <Text style={styles.sectionTitle}>Request Status</Text>

    <View style={styles.statusCard}>
      <View style={styles.statusHeaderRow}>
        <Text style={styles.docTypeTitle}>Affidavit</Text>
        <View style={[styles.badge, {backgroundColor: '#FEF9C3'}]}>
          <Text style={[styles.badgeText, {color: '#854D0E'}]}>PENDING</Text>
        </View>
      </View>
      <Text style={styles.subInfoText}>Submitted on 2/16/2026</Text>
      <Text style={styles.scheduleText}>Scheduled: 2/19/2026 at 10:00 AM</Text>
    </View>

    <View style={styles.statusCard}>
      <View style={styles.statusHeaderRow}>
        <Text style={styles.docTypeTitle}>Power of Attorney</Text>
        <View style={[styles.badge, {backgroundColor: '#1E293B'}]}>
          <Text style={[styles.badgeText, {color: '#FFF'}]}>APPROVED</Text>
        </View>
      </View>
      <Text style={styles.subInfoText}>Submitted on 2/12/2026</Text>
      <Text style={styles.scheduleText}>Scheduled: 2/15/2026 at 2:00 PM</Text>
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => navigation.navigate('BookingSummary', { 
          serviceData: { type: 'Power of Attorney', date: 'February 15, 2026', time: '2:00 PM', amount: '₱4,000' }
        })}>
        <Text style={styles.paymentButtonText}>Proceed to Payment - ₱4,000.00</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  header: {padding: 20, flexDirection: 'row', alignItems: 'flex-start'},
  backButton: {paddingVertical: 6, marginRight: 8},
  backText: {color: '#EAB308', fontWeight: '700', fontSize: 16},
  headerTitleContainer: {flex: 1},
  headerTitle: {fontSize: 22, fontWeight: '800', color: '#0F172A'},
  headerSubtitle: {fontSize: 13, color: '#64748B'},
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10},
  activeTab: {backgroundColor: '#FFF', elevation: 2},
  tabText: {fontSize: 14, fontWeight: '600', color: '#64748B'},
  activeTabText: {color: '#1E40AF'},
  scrollContent: {paddingBottom: 30},
  formCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginTop: 15,
  },
  uploadArea: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  uploadMainText: {fontSize: 14, fontWeight: '700', color: '#1E293B'},
  uploadSubText: {fontSize: 12, color: '#64748B', marginTop: 4},
  row: {flexDirection: 'row'},
  halfInputLeft: {flex: 1, marginRight: 10},
  halfInputRight: {flex: 1},
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    color: '#1E293B',
  },
  textArea: {height: 100, textAlignVertical: 'top'},
  submitButton: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 25,
  },
  submitButtonText: {color: '#FFF', fontWeight: '700', fontSize: 16},
  statusContainer: {marginHorizontal: 20},
  statusCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 1,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docTypeTitle: {fontSize: 18, fontWeight: '700', color: '#0F172A'},
  badge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8},
  badgeText: {fontSize: 10, fontWeight: '800'},
  subInfoText: {fontSize: 12, color: '#94A3B8', marginTop: 2},
  scheduleText: {fontSize: 13, color: '#475569', marginTop: 10},
  paymentButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
  },
  paymentButtonText: {color: '#FFF', fontWeight: '700'},
});
