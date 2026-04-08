import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import {
  getNotarialRequests,
  resolveNotarialDocumentUrl,
  updateNotarialRequestStatus,
} from '../services/notarialService';

const ArrowLeft = (props) => <MaterialCommunityIcons name="arrow-left" {...props} />;
const FileText = (props) => <MaterialCommunityIcons name="file-document" {...props} />;
const Calendar = (props) => <MaterialCommunityIcons name="calendar" {...props} />;
const Download = (props) => <MaterialCommunityIcons name="download" {...props} />;
const Check = (props) => <MaterialCommunityIcons name="check" {...props} />;
const MessageSquare = (props) => <MaterialCommunityIcons name="message-text-outline" {...props} />;
const X = (props) => <MaterialCommunityIcons name="close" {...props} />;

const STATUS_CONFIG = {
  'PENDING REVIEW': { bg: '#FEF3C7', text: '#92400E' },
  'APPROVED': { bg: '#DBEAFE', text: '#1D4ED8' },
  'REVISION REQUESTED': { bg: '#FEE2E2', text: '#B91C1C' },
  'COMPLETED': { bg: '#DCFCE7', text: '#166534' },
};

function mapStatus(status) {
  const normalized = String(status || 'pending').toLowerCase();
  if (normalized === 'accepted') return 'APPROVED';
  if (normalized === 'rejected') return 'REVISION REQUESTED';
  if (normalized === 'completed') return 'COMPLETED';
  return 'PENDING REVIEW';
}

function formatDate(isoDate) {
  if (!isoDate) return 'No date set';
  const value = new Date(isoDate);
  if (Number.isNaN(value.getTime())) return 'No date set';
  return value.toLocaleDateString();
}

const ServiceCard = ({ item, onAccept, onReject, actionLoading }) => {
  const isApproved = item.status === 'APPROVED' || item.status === 'COMPLETED';
  const isBusy = actionLoading;
  const statusStyle = STATUS_CONFIG[item.status] || STATUS_CONFIG['PENDING REVIEW'];
  const submittedName = item.client_name || 'Client';
  const fileName = item.document_url
    ? item.document_url.split('/').pop()
    : 'No document uploaded';

  const handleOpenDocument = async () => {
    const url = resolveNotarialDocumentUrl(item.document_url);
    if (!url) {
      Alert.alert('No document', 'This request has no uploaded document yet.');
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (_) {
      Alert.alert('Error', 'Unable to open this document on your device.');
    }
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <FileText size={24} color="#1E3A8A" />
        </View>
        <View style={styles.headerTextContent}>
          <View style={styles.titleRow}>
            <Text style={styles.serviceTitle}>{item.service_type}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.submittedBy}>
            Submitted by: <Text style={styles.boldText}>{submittedName}</Text>
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoBox}>
        <View style={styles.dateRow}>
          <Calendar size={14} color="#94a3b8" />
          <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
        </View>
        <TouchableOpacity
          style={styles.fileDownload}
          disabled={!item.document_url}
          onPress={handleOpenDocument}>
          <Download size={14} color="#1E3A8A" />
          <Text style={styles.fileName}>{fileName}</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={[styles.actionRow, (isApproved || isBusy) && { opacity: 0.5 }]}>
        <TouchableOpacity 
          disabled={isApproved || isBusy}
          style={[styles.btn, styles.btnAccept]}
          onPress={() => onAccept(item)}
        >
          <Check size={16} color="#166534" />
          <Text style={styles.btnTextAccept}>ACCEPT</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          disabled={isApproved || isBusy}
          style={styles.btnMoreInfo}
          onPress={() => Alert.alert('Request Details', item.details || 'No additional details provided.')}
        >
          <MessageSquare size={16} color="#64748b" />
          <Text style={styles.btnTextMoreInfo}>MORE INFO</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          disabled={isApproved || isBusy}
          style={styles.btnReject}
          onPress={() => onReject(item)}
        >
          <X size={16} color="#991b1b" />
          <Text style={styles.btnTextReject}>REJECT</Text>
        </TouchableOpacity>
      </View>

      {isApproved && (
        <Text style={styles.disabledLabel}>Actions disabled for approved items</Text>
      )}
    </View>
  );
};

export default function NotarialServices({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const loadNotarialRequests = useCallback(async ({showSpinner = true} = {}) => {
    try {
      if (showSpinner) {
        setLoading(true);
      }
      const records = await getNotarialRequests();
      const mapped = (Array.isArray(records) ? records : []).map(item => ({
        ...item,
        status: mapStatus(item.status),
      }));
      setData(mapped);
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to load notarial requests.');
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotarialRequests({showSpinner: true});
    }, [loadNotarialRequests]),
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotarialRequests({showSpinner: false});
  }, [loadNotarialRequests]);

  const handleReject = useCallback(
    item => {
      Alert.alert('Reject Request', 'Are you sure you want to reject this request?', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessingId(item.id);
              await updateNotarialRequestStatus(item.id, 'rejected');
              await loadNotarialRequests({showSpinner: false});
              Alert.alert('Success', 'Notarial request rejected.');
            } catch (error) {
              Alert.alert('Error', error?.message || 'Unable to reject request.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]);
    },
    [loadNotarialRequests],
  );

  const handleAccept = useCallback(
    item => {
      Alert.alert('Accept Request', 'Are you sure you want to accept this request?', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Accept',
          onPress: async () => {
            try {
              setProcessingId(item.id);
              await updateNotarialRequestStatus(item.id, 'accepted');
              await loadNotarialRequests({showSpinner: false});
              Alert.alert('Success', 'Notarial request accepted.');
            } catch (error) {
              Alert.alert('Error', error?.message || 'Unable to accept request.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]);
    },
    [loadNotarialRequests],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.mainTitle}>Notarial Services</Text>
          <Text style={styles.subHeader}>BATASMO PROFESSIONAL NETWORK</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#1e3a8a" />
          <Text style={styles.emptyText}>Loading requests...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          {data.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No notarial requests yet</Text>
              <Text style={styles.emptyText}>Client submissions will appear here automatically.</Text>
            </View>
          ) : (
            data.map((item) => (
              <ServiceCard
                key={item.id}
                item={item}
                onAccept={handleAccept}
                onReject={handleReject}
                actionLoading={processingId === item.id}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  topHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff'
  },
  headerTitles: { marginLeft: 15 },
  mainTitle: { fontSize: 32, fontWeight: 'bold', color: '#1E3A8A' },
  subHeader: { fontSize: 10, color: '#94a3b8', letterSpacing: 0.5, marginTop: 2 },
  scrollContent: { padding: 16 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
  },
  cardHeader: { flexDirection: 'row', marginBottom: 15 },
  iconContainer: { 
    width: 50, height: 50, borderRadius: 12, 
    backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' 
  },
  headerTextContent: { flex: 1, marginLeft: 12 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  serviceTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a', flexShrink: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 9, fontWeight: 'bold' },
  submittedBy: { fontSize: 13, color: '#64748b', marginTop: 4 },
  boldText: { fontWeight: 'bold', color: '#1e3a8a' },
  infoBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 15 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dateText: { fontSize: 12, color: '#64748b', marginLeft: 6 },
  fileDownload: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#fff', padding: 8, borderRadius: 8, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: '#e2e8f0'
  },
  fileName: { fontSize: 12, color: '#475569', marginLeft: 6 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, height: 45, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnAccept: { backgroundColor: '#f0fdf4', marginRight: 8 },
  btnMoreInfo: { flex: 1, height: 45, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  btnReject: { backgroundColor: '#fef2f2' },
  btnTextAccept: { color: '#166534', fontWeight: 'bold', fontSize: 11, marginLeft: 4 },
  btnTextMoreInfo: { color: '#64748b', fontWeight: 'bold', fontSize: 9, marginTop: 2 },
  btnTextReject: { color: '#991b1b', fontWeight: 'bold', fontSize: 11, marginLeft: 4 },
  disabledLabel: { textAlign: 'center', fontSize: 10, color: '#94a3b8', marginTop: 10 }
});
