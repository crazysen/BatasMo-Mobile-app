import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const attorneys = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Corporate Law',
    experience: '15 years experience',
    rating: '4.9',
    price: '₱2,500.00',
    image: 'https://i.pravatar.cc/150?u=sarah',
  },
  {
    id: '2',
    name: 'Mr. Michael Chen',
    specialty: 'Family Law',
    experience: '12 years experience',
    rating: '4.8',
    price: '₱2,500.00',
    image: 'https://i.pravatar.cc/150?u=michael',
  },
  {
    id: '3',
    name: 'Ms. Emily Rodriguez',
    specialty: 'Criminal Law',
    experience: '10 years experience',
    rating: '4.9',
    price: '₱2,500.00',
    image: 'https://i.pravatar.cc/150?u=emily',
  },
];

const AttorneyCard = ({item, navigation}) => (
  <View style={styles.card}>
    <View style={styles.profileContainer}>
      <Image source={{uri: item.image}} style={styles.avatar} />
    </View>

    <View style={styles.infoContainer}>
      <View style={styles.nameRow}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.verifiedIcon}>✓</Text>
      </View>

      <Text style={styles.specialtyText}>{item.specialty}</Text>
      <Text style={styles.experienceText}>{item.experience}</Text>

      <View style={styles.ratingRow}>
        <Text style={styles.ratingStar}>★</Text>
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>

      <Text style={styles.priceText}>{item.price}</Text>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('BookNow', { attorney: item })}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('AttorneyProfile', { 
          attorney: {
            name: item.name,
            specialty: item.specialty,
            rating: item.rating,
            reviews: '128',
            image: item.image
          }
        })}>
        <Text style={styles.profileButtonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function BookAppointment({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Book an Appointment</Text>
          <Text style={styles.subtitle}>Choose from our experienced attorneys</Text>
        </View>
      </View>

      <FlatList
        data={attorneys}
        keyExtractor={item => item.id}
        renderItem={({item}) => <AttorneyCard item={item} navigation={navigation} />}
        contentContainerStyle={styles.listContent}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    marginBottom: 8,
  },
  backText: {
    color: '#EAB308',
    fontWeight: '700',
    fontSize: 16,
  },
  titleContainer: {
    marginTop: 6,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  profileContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E2E8F0',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 6,
  },
  verifiedIcon: {
    color: '#EAB308',
    fontSize: 16,
    fontWeight: '800',
  },
  specialtyText: {
    fontSize: 13,
    color: '#64748B',
  },
  experienceText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingStar: {
    color: '#EAB308',
    fontSize: 14,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 4,
  },
  priceText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#EAB308',
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: '#1E293B',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  bookButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  profileButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  profileButtonText: {
    color: '#1E293B',
    fontWeight: '700',
    fontSize: 16,
  },
});
