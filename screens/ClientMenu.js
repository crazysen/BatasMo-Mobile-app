import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOutCurrentUser } from '../services/authService';

const menuItems = [
  {name: 'Dashboard', icon: '🏠', route: 'HomepageClient'},
  {name: 'Book Appointment', icon: '📅', route: 'BookAppointment'},
  {name: 'My Appointments', icon: '🗂️', route: 'MyAppointments'},
  {name: 'Notarial Requests', icon: '📄', route: 'ClientNotarial'},
  {name: 'Announcements', icon: '📢', route: 'ClientNotification'},
  {name: 'Transaction History', icon: '🧾', route: 'TransactionHistory'},
  {name: 'Profile', icon: '👤', route: 'ProfileSettingsClient'},
];

export default function ClientMenu({navigation, route}) {
  const stackState = navigation.getState();
  const previousRouteName =
    stackState?.routes?.[Math.max(0, (stackState?.index ?? 0) - 1)]?.name ??
    'HomepageClient';
  const activeRoute = route?.params?.activeRoute || previousRouteName;

  const onMenuPress = item => {
    if (item.route) {
      navigation.navigate(item.route);
      return;
    }

    Alert.alert(item.name, `${item.name} will open here soon.`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOutCurrentUser();
            } catch {
              // still leave app
            }
            navigation.reset({
              index: 0,
              routes: [{ name: 'Landing' }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.drawerContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>⚖️</Text>
          <Text style={styles.logoText}>BatasMo</Text>
        </View>

        <View style={styles.divider} />

        <ScrollView style={styles.navContainer} showsVerticalScrollIndicator={false}>
          {menuItems.map(item => {
            const isActive = activeRoute === item.route;
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.navItem, isActive && styles.activeNavItem]}
                onPress={() => onMenuPress(item)}>
                <Text style={styles.navIcon}>{item.icon}</Text>
                <Text style={[styles.navText, isActive && styles.activeNavText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.logoutSection}>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2C',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 10,
  },
  headerRow: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backText: {
    color: '#EAB308',
    fontSize: 16,
    fontWeight: '700',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  logoText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#2D2D3F',
    marginHorizontal: 10,
    marginBottom: 18,
  },
  navContainer: {
    paddingHorizontal: 10,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  activeNavItem: {
    backgroundColor: '#EAB308',
  },
  navIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
    marginLeft: 15,
  },
  activeNavText: {
    color: '#111827',
    fontWeight: '700',
  },
  logoutSection: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    marginTop: 12,
  },
  logoutIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 15,
  },
});
