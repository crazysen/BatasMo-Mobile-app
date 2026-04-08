import React from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOutCurrentUser } from '../services/authService';

const AttorneySidebar = ({navigation, route}) => {
  const stackState = navigation.getState();
  const previousRouteName =
    stackState?.routes?.[Math.max(0, (stackState?.index ?? 0) - 1)]?.name ??
    'AttyLandingPage';
  const activeRoute = route?.params?.activeRoute || previousRouteName;

  const menuItems = [
    {id: '1', label: 'Dashboard', icon: '⊞', route: 'AttyLandingPage'},
    {id: '2', label: 'My Schedule', icon: '🕒', route: 'AttyAvailabilityManager'},
    {id: '3', label: 'Consultation Requests', icon: '📥', route: 'AttyConsultationRequest'},
    {id: '4', label: 'Upcoming Appointments', icon: '📅', route: 'AttyMyAppointments'},
    {id: '5', label: 'Notarial Requests', icon: '🛡️', route: 'AttyNotarialServices'},
    {id: '6', label: 'Earnings', icon: '💵', route: 'AttyMyEarnings'},
  ];

  const handleMenuPress = item => {
    if (item.route) {
      navigation.navigate(item.route);
      return;
    }

    Alert.alert(item.label, `${item.label} screen will be added next.`);
  };

  const handleIdentityPress = () => {
    navigation.navigate('AttyProfileSettings');
  };

  const handleTerminate = async () => {
    try {
      await signOutCurrentUser();
    } catch {
      // Still leave the app shell; session may already be cleared
    }
    navigation.reset({
      index: 0,
      routes: [{name: 'Landing'}],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sidebarContent}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>⚖️</Text>
          </View>
          <Text style={styles.brandName}>BatasMo</Text>
        </View>

        <View style={styles.navSection}>
          {menuItems.map(item => {
            const isActive = activeRoute === item.route;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.navItem, isActive && styles.activeNavItem]}
                onPress={() => handleMenuPress(item)}>
                <Text style={[styles.navIcon, isActive && styles.activeText]}>
                  {item.icon}
                </Text>
                <Text style={[styles.navLabel, isActive && styles.activeText]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.navItem} onPress={handleIdentityPress}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Identity</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.terminateBtn} onPress={handleTerminate}>
            <Text style={styles.terminateIcon}>🚪</Text>
            <Text style={styles.terminateText}>Terminate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
    backgroundColor: '#D9B041',
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
    backgroundColor: '#D9B041',
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
    color: '#0F172A',
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
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(244,63,94,0.08)',
  },
  terminateIcon: {
    fontSize: 18,
    color: '#F43F5E',
    marginRight: 15,
  },
  terminateText: {
    fontSize: 15,
    color: '#F43F5E',
    fontWeight: 'bold',
  },
});

export default AttorneySidebar;

