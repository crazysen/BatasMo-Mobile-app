import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const notifications = [
  {
    id: '1',
    icon: '📅',
    iconBg: '#FEF3C7',
    title: 'Appointment Approved',
    time: '2M AGO',
    description:
      'Atty. Clara Santos has approved your request for Property Title Verification.',
    action: 'PAY NOW',
  },
  {
    id: '2',
    icon: '💬',
    iconBg: '#E2E8F0',
    title: 'New Message',
    time: '1H AGO',
    description: 'You have a new encrypted message from Atty. Mark Reyes.',
    action: 'VIEW',
  },
  {
    id: '3',
    icon: '✅',
    iconBg: '#DCFCE7',
    title: 'Payment Successful',
    time: 'YESTERDAY',
    description: 'Payment for Deed of Sale Notarization was successful.',
    action: null,
  },
];

const NotificationCard = ({item, navigation}) => {
  const handleAction = () => {
    if (item.action === 'PAY NOW') {
      navigation.navigate('PaymentMethod', { serviceData: { type: 'Consultation', amount: '₱2,500' } });
    } else if (item.action === 'VIEW') {
      navigation.navigate('Messages');
    }
  };

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, {backgroundColor: item.iconBg}]}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <Text style={styles.descriptionText}>{item.description}</Text>

        {item.action ? (
          <TouchableOpacity onPress={handleAction}>
            <Text style={styles.actionText}>{item.action} ›</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default function ClientNotification({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>Notifications</Text>
        <Text style={styles.subtitle}>Stay updated on your legal proceedings.</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({item}) => <NotificationCard item={item} navigation={navigation} />}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  backText: {
    color: '#EAB308',
    fontSize: 16,
    fontWeight: '700',
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 18,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: 'row',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  cardContent: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
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
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EAB308',
  },
});
