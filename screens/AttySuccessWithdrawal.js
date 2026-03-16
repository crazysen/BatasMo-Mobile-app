import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Check = (props) => <MaterialCommunityIcons name="check" {...props} />;
const Info = (props) => <MaterialCommunityIcons name="information" {...props} />;
const Clock = (props) => <MaterialCommunityIcons name="clock-outline" {...props} />;

export default function WithdrawalSuccess({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Success</Text>

        {/* Animated Checkmark Circle */}
        <View style={styles.successCircleWrapper}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Check size={48} color="#FFF" strokeWidth={3} />
            </View>
          </View>
          {/* Decorative floating dots */}
          <View style={[styles.dot, { backgroundColor: '#FDE047', top: 0, left: -20 }]} />
          <View style={[styles.dot, { backgroundColor: '#93C5FD', top: 40, right: -30 }]} />
          <View style={[styles.dot, { backgroundColor: '#F9A8D4', bottom: 20, left: -40, width: 8, height: 8 }]} />
        </View>

        <Text style={styles.mainTitle}>Withdrawal Initiated</Text>
        <Text style={styles.description}>
          Your request for <Text style={styles.bold}>₱184,200</Text> is being processed and will arrive in your GCash account shortly.
        </Text>

        {/* Transaction Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>#WDR-77421</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.label}>Estimated Arrival</Text>
            <View style={styles.arrivalBox}>
              <Clock size={16} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.value}>1-3 Business Days</Text>
            </View>
          </View>
        </View>

        {/* Notification Info Box */}
        <View style={styles.infoBox}>
          <Info size={20} color="#3B82F6" />
          <Text style={styles.infoText}>
            You will receive a notification and SMS once the funds are credited to your account.
          </Text>
        </View>
      </View>

      {/* Footer Action */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('AttyLandingPage')}
        >
          <Text style={styles.buttonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 30 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#0F172A', marginTop: 20 },
  
  successCircleWrapper: { marginTop: 60, marginBottom: 40, position: 'relative' },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    // Slight shadow for the green button
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  dot: { position: 'absolute', width: 12, height: 12, borderRadius: 6 },

  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#0F172A', textAlign: 'center' },
  description: { fontSize: 15, color: '#64748B', textAlign: 'center', marginTop: 15, lineHeight: 22 },
  bold: { color: '#0F172A', fontWeight: 'bold' },

  summaryCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 24,
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 14, color: '#94A3B8' },
  value: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  arrivalBox: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 15 },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 25,
    alignItems: 'center',
  },
  infoText: { flex: 1, marginLeft: 12, fontSize: 13, color: '#3B82F6', lineHeight: 18 },

  footer: { padding: 20, paddingBottom: 40 },
  button: {
    backgroundColor: '#0F172A',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    // Shadow matching the previous confirm button
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
