import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AccountCreatedScreen = ({ navigation, route }) => {
  // Get name from route params if passed
  const fullName = route?.params?.fullName || 'Client';
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Close Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Created</Text>
        <View style={{ width: 24 }} /> {/* Spacer to center title */}
      </View>

      <View style={styles.content}>
        {/* Success Icon with Glow */}
        <View style={styles.iconOuterCircle}>
          <View style={styles.iconInnerCircle}>
            <Ionicons name="checkmark-circle" size={80} color="#22C55E" />
          </View>
        </View>

        <Text style={styles.welcomeTitle}>Welcome to BatasMo!</Text>
        
        <Text style={styles.description}>
          Your account has been successfully created. You can now start connecting with legal professionals.
        </Text>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.dashboardButton}
          onPress={() => navigation.navigate('HomepageClient')}
        >
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'serif',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  iconOuterCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(34, 197, 94, 0.05)', // Very faint green glow
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    // Soft glow effect
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  iconInnerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'serif',
    marginBottom: 40,
  },
  dashboardButton: {
    backgroundColor: '#114BCB', // Royal Blue from your design
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#114BCB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'serif',
  },
});

export default AccountCreatedScreen;