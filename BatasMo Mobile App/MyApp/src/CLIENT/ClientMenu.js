import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { 
  MaterialCommunityIcons, 
  Ionicons, 
  Octicons, 
  FontAwesome5 
} from '@expo/vector-icons';

const SidebarDrawer = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: 'grid-outline', library: Ionicons },
    { name: 'Book Appointment', icon: 'calendar-plus', library: MaterialCommunityIcons },
    { name: 'My Appointments', icon: 'calendar-month-outline', library: MaterialCommunityIcons },
    { name: 'Notarial Requests', icon: 'file-text', library: Octicons },
    { name: 'Announcements', icon: 'pulse', library: Ionicons },
    { name: 'Transaction History', icon: 'history', library: MaterialCommunityIcons },
    { name: 'Profile', icon: 'user', library: FontAwesome5 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.drawerContent}>
        
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="scale-balance" size={32} color="#F5A623" />
          <Text style={styles.logoText}>BatasMo</Text>
        </View>

        <View style={styles.divider} />

        {/* Navigation Items */}
        <ScrollView style={styles.navContainer}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            const IconComponent = item.library;
            
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.navItem, isActive && styles.activeNavItem]}
                onPress={() => setActiveTab(item.name)}
              >
                <IconComponent 
                  name={item.icon} 
                  size={22} 
                  color={isActive ? "#FFF" : "#94A3B8"} 
                />
                <Text style={[styles.navText, isActive && styles.activeNavText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2C', // Deep dark navy background
    maxWidth: 280, // Typical drawer width
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logoText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#2D2D3F',
    marginHorizontal: 10,
    marginBottom: 20,
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
    backgroundColor: '#F5A623', // Gold/Yellow accent
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8', // Muted text color
    marginLeft: 15,
  },
  activeNavText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

export default SidebarDrawer;