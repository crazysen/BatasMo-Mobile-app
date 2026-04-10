import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

const AttorneyAccountCreated = ({ navigation, route }) => {
  // Get name from route params if passed
  const fullName = route?.params?.fullName || 'Atty. Julianne Smith';
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.topLabel}>Account Created</Text>

        {/* Success Checkmark Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          </View>
        </View>

        {/* Welcome Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.mainHeading}>Welcome to BatasMo!</Text>
          <Text style={styles.description}>
            Your account has been successfully created. You can now start 
            connecting with legal professionals.
          </Text>
        </View>

        {/* Professional Profile Summary Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
             {/* Replace with actual image source */}
             <View style={styles.placeholderAvatar} />
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileLabel}>PROFILE SUMMARY</Text>
            <Text style={styles.attorneyName}>{fullName}</Text>
            <Text style={styles.titleText}>Attorney at Law</Text>
          </View>
        </View>

        {/* Legal Access Branding Box */}
        <View style={styles.accessBox}>
          <Text style={styles.accessIcon}>⚖️</Text>
          <Text style={styles.accessText}>LEGAL ACCESS</Text>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity 
          style={styles.dashboardButton}
          onPress={() => navigation.navigate('AttyLandingPage')}
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  topLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'serif',
    marginBottom: 40,
  },
  illustrationContainer: {
    marginBottom: 40,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#22C55E', // Success green
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#22C55E',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    fontFamily: 'serif',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  placeholderAvatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#CBD5E1',
  },
  profileDetails: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  profileLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563EB',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  attorneyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'serif',
  },
  titleText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    fontFamily: 'serif',
  },
  accessBox: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  accessIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  accessText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
    letterSpacing: 1,
  },
  dashboardButton: {
    backgroundColor: '#0F172A',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'serif',
  },
});

export default AttorneyAccountCreated;