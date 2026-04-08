import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import {
  createNotarialRequest,
  getNotarialRequests,
} from '../services/notarialService';

export default function ClientNotarial({navigation}) {
  const [activeTab, setActiveTab] = useState('New Request');
  const [requests, setRequests] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const loadRequests = useCallback(async () => {
    try {
      setLoadingStatus(true);
      const records = await getNotarialRequests();
      setRequests(Array.isArray(records) ? records : []);
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Failed to load notarial requests.');
      setRequests([]);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
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
        {activeTab === 'New Request' ? (
          <NewRequestForm navigation={navigation} onSubmitted={loadRequests} />
        ) : (
          <RequestStatusList
            navigation={navigation}
            requests={requests}
            loadingStatus={loadingStatus}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const NewRequestForm = ({navigation, onSubmitted}) => {
  const [serviceType, setServiceType] = useState('Affidavit of Loss');
  const [details, setDetails] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        return;
      }

      setDocumentFile(asset);
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Unable to pick document.');
    }
  };

  const handleSubmit = async () => {
    if (!serviceType.trim()) {
      Alert.alert('Error', 'Type of document is required.');
      return;
    }
    if (!documentFile?.uri) {
      Alert.alert('Error', 'Please upload a document before submitting.');
      return;
    }

    try {
      setSubmitting(true);

      let documentBase64 = null;
      if (documentFile?.uri) {
        documentBase64 = await FileSystem.readAsStringAsync(documentFile.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const notarialData = {
        service_type: serviceType.trim(),
        details: details.trim() || null,
        document_name: documentFile?.name || null,
        document_base64: documentBase64,
      };

      setSubmitting(false);
      navigation.navigate('UploadIDScreen', { notarialData });
    } catch (error) {
      setSubmitting(false);
      Alert.alert('Error', error?.message ?? 'Unable to process request.');
    }
  };

  return (
    <View style={styles.formCard}>
      <Text style={styles.sectionTitle}>New Request</Text>

      <Text style={styles.inputLabel}>Type of Document</Text>
      <View style={styles.dropdownButton}>
        <Text style={[styles.dropdownText, { fontWeight: '600' }]}>
          Affidavit of Loss
        </Text>
      </View>

      <Text style={styles.inputLabel}>Upload Document</Text>
      <TouchableOpacity style={styles.uploadArea} onPress={pickDocument}>
        <Text style={styles.uploadMainText}>
          {documentFile?.name || 'Click to upload your document'}
        </Text>
        <Text style={styles.uploadSubText}>PDF, DOC, DOCX (max 10MB)</Text>
      </TouchableOpacity>

      <Text style={styles.inputLabel}>Additional Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Any special instructions or requirements..."
        multiline
        numberOfLines={4}
        value={details}
        onChangeText={setDetails}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={submitting}>
        <Text style={styles.submitButtonText}>
          {submitting ? 'Submitting...' : 'Submit Request'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const RequestStatusNotificationHint = () => (
  <View style={styles.statusNoticeBox}>
    <Text style={styles.statusNoticeText}>
      🔔 You will be notified in the app when your request is done or when the status is updated.
    </Text>
  </View>
);

const RequestStatusList = ({navigation, requests, loadingStatus}) => {
  if (loadingStatus) {
    return (
      <View style={styles.statusContainer}>
        <Text style={[styles.sectionTitle, styles.statusTabTitle]}>Request Status</Text>
        <RequestStatusNotificationHint />
        <View style={styles.statusCardCentered}>
          <ActivityIndicator color="#0F172A" />
          <Text style={styles.subInfoText}>Loading request status...</Text>
        </View>
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.statusContainer}>
        <Text style={[styles.sectionTitle, styles.statusTabTitle]}>Request Status</Text>
        <RequestStatusNotificationHint />
        <View style={styles.statusCardCentered}>
          <Text style={styles.docTypeTitle}>No requests yet</Text>
          <Text style={styles.subInfoText}>Your notarial requests will appear here.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.statusContainer}>
      <Text style={[styles.sectionTitle, styles.statusTabTitle]}>Request Status</Text>
      <RequestStatusNotificationHint />

      {requests.map(item => {
        const status = (item.status ?? 'PENDING').toUpperCase();
        const submittedDate = item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : 'N/A';
        return (
          <View key={item.id} style={styles.statusCard}>
            <View style={styles.statusHeaderRow}>
              <Text style={styles.docTypeTitle}>{item.service_type}</Text>
              <View
                style={[
                  styles.badge,
                  status === 'ACCEPTED'
                    ? {backgroundColor: '#1E293B'}
                    : status === 'REJECTED'
                      ? {backgroundColor: '#FEE2E2'}
                      : {backgroundColor: '#FEF9C3'},
                ]}>
                <Text
                  style={[
                    styles.badgeText,
                    status === 'ACCEPTED'
                      ? {color: '#FFF'}
                      : status === 'REJECTED'
                        ? {color: '#B91C1C'}
                        : {color: '#854D0E'},
                  ]}>
                  {status}
                </Text>
              </View>
            </View>
            <Text style={styles.subInfoText}>Submitted on {submittedDate}</Text>

            {status === 'PENDING' && (
              <TouchableOpacity
                style={styles.paymentButton}
                onPress={() =>
                  navigation.navigate('BookingSummary', {
                    serviceData: {
                      type: item.service_type,
                      date: submittedDate,
                      time: 'To be confirmed',
                      amount: '₱4,000',
                    },
                    paymentContext: {
                      sourceType: 'notarial',
                      sourceId: item.id,
                    },
                  })
                }>
                <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
};

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
  statusTabTitle: {
    marginBottom: 12,
  },
  statusNoticeBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  statusNoticeText: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 20,
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
  statusCardCentered: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 1,
    alignItems: 'center',
  },
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
  subInfoText: {fontSize: 12, color: '#94A3B8', marginTop: 8, textAlign: 'center'},
  paymentButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
  },
  paymentButtonText: {color: '#FFF', fontWeight: '700'},
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {color: '#1E293B', fontSize: 14},
  dropdownPlaceholder: {color: '#94A3B8', fontSize: 14},
  dropdownArrow: {color: '#94A3B8', fontSize: 10},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '80%',
    maxHeight: 400,
    paddingVertical: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOptionSelected: {backgroundColor: '#EFF6FF'},
  modalOptionText: {fontSize: 15, color: '#334155'},
  modalOptionTextSelected: {color: '#1E40AF', fontWeight: '700'},
});
