import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Gavel = (props) => <MaterialCommunityIcons name="gavel" {...props} />;
const Info = (props) => <MaterialCommunityIcons name="information" {...props} />;
const ArrowLeft = (props) => <MaterialCommunityIcons name="arrow-left" {...props} />;

const RequestRejectedScreen = ({ navigation, route }) => {
  const title = route?.params?.title || 'Affidavit of Loss';
  const user = route?.params?.user || 'Alice Cooper';
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Optional: Navigation Header if not part of a stack */}
      <View style={styles.content}>
        
        {/* Rejection Icon (Gavel/Hammer) */}
        <View style={styles.errorIconOuter}>
          <View style={styles.errorIconInner}>
            <Gavel size={40} color="#ef4444" strokeWidth={2.5} />
          </View>
        </View>

        {/* Rejection Message */}
        <Text style={styles.title}>Request Rejected</Text>
        <Text style={styles.subtitle}>
          The request from <Text style={styles.boldText}>{user}</Text> for an <Text style={styles.boldText}>{title}</Text> has been rejected.
        </Text>

        {/* Case & Reason Card */}
        <View style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Case ID</Text>
            <Text style={styles.caseId}>#NT-88293</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Reason</Text>
            <Text style={styles.reasonValue}>Incomplete Information</Text>
          </View>
        </View>

        {/* Notification Hint */}
        <View style={styles.hintContainer}>
          <Info size={18} color="#94a3b8" />
          <Text style={styles.hintText}>
            The client has been automatically notified about this decision via email and app notification.
          </Text>
        </View>
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Back to Inbox</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  
  // Icon Styling
  errorIconOuter: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#fef2f2', justifyContent: 'center', alignItems: 'center',
    marginBottom: 40,
  },
  errorIconInner: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center'
  },

  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 15 },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 24, paddingHorizontal: 15 },
  boldText: { color: '#334155', fontWeight: 'bold' },

  // Info Card
  infoCard: { 
    backgroundColor: '#f8fafc', borderRadius: 20, padding: 25, width: '100%', 
    marginTop: 40, borderWidth: 1, borderColor: '#f1f5f9' 
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  caseId: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  reasonValue: { fontSize: 16, fontWeight: 'bold', color: '#ef4444', textAlign: 'right', width: '60%' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 20 },

  // Hint Section
  hintContainer: { flexDirection: 'row', marginTop: 30, paddingHorizontal: 10 },
  hintText: { flex: 1, fontSize: 13, color: '#94a3b8', marginLeft: 10, lineHeight: 18 },

  // Footer
  footer: { padding: 25, paddingBottom: 40 },
  backBtn: { 
    backgroundColor: '#ef4444', height: 60, borderRadius: 16, 
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#ef4444', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default RequestRejectedScreen;
