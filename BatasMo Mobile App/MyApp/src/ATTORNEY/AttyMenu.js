import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const AttorneySidebar = ({ navigation }) => {
  const menuItems = [
    { id: '1', label: 'Dashboard', icon: '⊞', active: true, screen: 'AttyLandingPage' },
    { id: '2', label: 'My Schedule', icon: '🕒', active: false, screen: 'AttyAvailabilityManager' },
    { id: '3', label: 'Consultation Requests', icon: '📥', active: false, screen: 'AttyConsultationRequest' },
    { id: '4', label: 'Upcoming Appointments', icon: '📅', active: false, screen: 'AttyMyAppointments' },
    { id: '5', label: 'Notarial Requests', icon: '🛡️', active: false, screen: 'AttyNotarialServices' },
    { id: '6', label: 'Earnings', icon: '💵', active: false, screen: 'AttyMyEarnings' },
  ];

  const handleMenuPress = (screen) => {
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    // Navigate back to login/landing page on logout
    navigation.reset({
      index: 0,
      routes: [{ name: 'LandingPage' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sidebarContent}>
        
        {/* Logo Section */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>⚖️</Text>
          </View>
          <Text style={styles.brandName}>BatasMo</Text>
        </View>

        {/* Navigation Links */}
        <View style={styles.navSection}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.navItem, item.active && styles.activeNavItem]}
              onPress={() => handleMenuPress(item.screen)}
            >
              <Text style={[styles.navIcon, item.active && styles.activeText]}>
                {item.icon}
              </Text>
              <Text style={[styles.navLabel, item.active && styles.activeText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Identity Section */}
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('AttyProfileSettings')}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile Settings</Text>
        </TouchableOpacity>

        {/* Bottom Terminate Action */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.terminateBtn} onPress={handleLogout}>
            <Text style={styles.terminateIcon}>🚪</Text>
            <Text style={styles.terminateText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Deep dark navy background
  },
  sidebarContent: {
    padding: 24,
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#D9B041', // Signature gold
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoIcon: {
    fontSize: 20,
    color: '#0F172A',
  },
  brandName: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  navSection: {
    marginTop: 10,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  activeNavItem: {
    backgroundColor: '#D9B041', // Gold active state
  },
  navIcon: {
    fontSize: 18,
    color: '#94A3B8',
    width: 30,
  },
  navLabel: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
  },
  activeText: {
    color: '#0F172A', // Dark text for gold background
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  terminateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  terminateIcon: {
    fontSize: 18,
    color: '#F43F5E', // Rose/Red for terminate
    marginRight: 15,
  },
  terminateText: {
    fontSize: 15,
    color: '#F43F5E',
    fontWeight: 'bold',
  },
});

export default AttorneySidebar;