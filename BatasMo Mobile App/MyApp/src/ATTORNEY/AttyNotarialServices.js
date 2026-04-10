import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Download, 
  Check, 
  MessageSquare, 
  X 
} from 'lucide-react-native';

const STATUS_CONFIG = {
  'PENDING REVIEW': { bg: '#FFF7ED', text: '#C2410C' },
  'APPROVED': { bg: '#EFF6FF', text: '#2563EB' },
  'REVISION REQUESTED': { bg: '#FEF2F2', text: '#DC2626' },
};

const ServiceCard = ({ item, navigation }) => {
  const isApproved = item.status === 'APPROVED';
  const statusStyle = STATUS_CONFIG[item.status] || STATUS_CONFIG['PENDING REVIEW'];

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <FileText size={24} color="#6366f1" />
        </View>
        <View style={styles.headerTextContent}>
          <View style={styles.titleRow}>
            <Text style={styles.serviceTitle}>{item.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.submittedBy}>
            Submitted by: <Text style={styles.boldText}>{item.user}</Text>
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoBox}>
        <View style={styles.dateRow}>
          <Calendar size={14} color="#94a3b8" />
          <Text style={styles.dateText}>{item.date} • {item.time}</Text>
        </View>
        <TouchableOpacity style={styles.fileDownload}>
          <Download size={14} color="#6366f1" />
          <Text style={styles.fileName}>{item.fileName}</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={[styles.actionRow, isApproved && { opacity: 0.5 }]}>
        <TouchableOpacity 
          disabled={isApproved}
          style={[styles.btn, styles.btnAccept]}
          onPress={() => navigation.navigate('AttyAcceptNotarialRequest', { title: item.title, user: item.user, caseId: '#NT-88293' })}
        >
          <Check size={16} color="#166534" />
          <Text style={styles.btnTextAccept}>ACCEPT</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          disabled={isApproved} 
          style={styles.btnMoreInfo}
        >
          <MessageSquare size={16} color="#64748b" />
          <Text style={styles.btnTextMoreInfo}>MORE INFO</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          disabled={isApproved}
          style={styles.btnReject}
          onPress={() => navigation.navigate('AttyNotarialRequestRejected', { title: item.title, user: item.user })}
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
  const data = [
    { id: '1', title: 'Affidavit of Loss', status: 'PENDING REVIEW', user: 'Alice Cooper', date: 'Oct 28, 2024', time: '11:00 AM', fileName: 'affidavit_loss_draft.pdf' },
    { id: '2', title: 'Deed of Sale', status: 'APPROVED', user: 'Bob Marley', date: 'Oct 29, 2024', time: '03:00 PM', fileName: 'property_sale_v2.pdf' },
    { id: '3', title: 'Power of Attorney', status: 'REVISION REQUESTED', user: 'Charlie Brown', date: 'Oct 30, 2024', time: '09:15 AM', fileName: 'poa_draft_final.pdf' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.mainTitle}>Notarial Services</Text>
          <Text style={styles.subHeader}>BATASMO PROFESSIONAL NETWORK</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {data.map((item) => <ServiceCard key={item.id} item={item} navigation={navigation} />)}
      </ScrollView>
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
  mainTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e3a8a' },
  subHeader: { fontSize: 10, color: '#94a3b8', letterSpacing: 0.5, marginTop: 2 },
  scrollContent: { padding: 16 },
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
    backgroundColor: '#f5f3ff', justifyContent: 'center', alignItems: 'center' 
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