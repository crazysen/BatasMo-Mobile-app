import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'appointment',
    title: 'Appointment Approved',
    time: '2M AGO',
    description: 'Atty. Clara Santos has approved your request for Property Title Verification.',
    action: 'PAY NOW',
    icon: 'calendar-blank-outline',
    iconColor: '#EAB308',
    bgColor: '#FEFCE8',
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    time: '1H AGO',
    description: 'You have a new encrypted message from Atty. Mark Reyes.',
    action: 'VIEW',
    icon: 'chatbubble-ellipses',
    iconColor: '#0F172A',
    bgColor: '#F1F5F9',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Successful',
    time: 'YESTERDAY',
    description: 'Payment for Deed of Sale Notarization was successful.',
    action: null,
    icon: 'checkmark-circle-outline',
    iconColor: '#22C55E',
    bgColor: '#F0FDF4',
  },
];

const NotificationCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
        {item.type === 'appointment' ? (
          <MaterialCommunityIcons name={item.icon} size={24} color={item.iconColor} />
        ) : (
          <Ionicons name={item.icon} size={24} color={item.iconColor} />
        )}
      </View>
      <View style={styles.titleContainer}>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.descriptionText}>{item.description}</Text>
        {item.action && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>{item.action}  ›</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
);

const NotificationsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#556270" />
      </TouchableOpacity>

      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>Notifications</Text>
        <Text style={styles.subtitle}>Stay updated on your legal proceedings.</Text>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard item={item} />}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerSection: {
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'serif',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 10,
  },
  actionButton: {
    marginTop: 5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EAB308',
  },
});

export default NotificationsScreen;