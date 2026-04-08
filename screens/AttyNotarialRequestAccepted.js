import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Check = (props) => <MaterialCommunityIcons name="check" {...props} />;
const Hash = (props) => <MaterialCommunityIcons name="pound" {...props} />;
const Calendar = (props) => <MaterialCommunityIcons name="calendar" {...props} />;
const Inbox = (props) => <MaterialCommunityIcons name="inbox" {...props} />;

const RequestSuccessScreen = ({ navigation, route }) => {
  const title = route?.params?.title || 'Notarial Request';
  const user = route?.params?.user || 'Client';
  const caseId = route?.params?.caseId || 'N/A';
  const submittedAt = route?.params?.submittedAt || '—';
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Animated-style Success Icon */}
        <View style={styles.successIconOuter}>
          <View style={styles.successIconInner}>
            <Check size={48} color="#fff" strokeWidth={3} />
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Request Accepted Successfully</Text>
        <Text style={styles.subtitle}>
          You have successfully accepted <Text style={styles.boldText}>{user}'s</Text> request for an <Text style={styles.boldText}>{title}</Text>.
        </Text>

        {/* Case Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
              <Hash size={18} color="#2563eb" />
            </View>
            <View>
              <Text style={styles.label}>CASE ID</Text>
              <Text style={styles.value}>{caseId}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: '#f5f3ff' }]}>
              <Calendar size={18} color="#7c3aed" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>SUBMITTED</Text>
              <Text style={styles.value}>
                Request received on <Text style={styles.blueValue}>{submittedAt}</Text>. Coordinate with the client for notarization.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('AttyNotarialServices')}
        >
          <Inbox size={20} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.primaryBtnText}>Back to Inbox</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('AttyMyAppointments')}
        >
          <Text style={styles.secondaryBtnText}>View My Schedule</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  
  // Success Icon Styling
  successIconOuter: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#22c55e', shadowOpacity: 0.2, shadowRadius: 15, elevation: 5,
  },
  successIconInner: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#22c55e', justifyContent: 'center', alignItems: 'center'
  },

  title: { fontSize: 26, fontWeight: '800', color: '#1e3a8a', textAlign: 'center', marginBottom: 15 },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },
  boldText: { color: '#1e293b', fontWeight: 'bold' },

  // Info Card
  infoCard: { 
    backgroundColor: '#fff', borderRadius: 24, padding: 25, width: '100%', 
    marginTop: 40, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1 },
  value: { fontSize: 15, fontWeight: '700', color: '#1e3a8a', marginTop: 2 },
  blueValue: { color: '#1e3a8a' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 20 },

  // Footer Buttons
  footer: { padding: 25, paddingBottom: 40 },
  primaryBtn: { 
    backgroundColor: '#0c2061', height: 60, borderRadius: 16, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    shadowColor: '#0c2061', shadowOpacity: 0.3, shadowRadius: 10, elevation: 4
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: { 
    backgroundColor: '#f1f5f9', height: 60, borderRadius: 16, 
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' 
  },
  secondaryBtnText: { color: '#64748b', fontSize: 16, fontWeight: 'bold' }
});

export default RequestSuccessScreen;
