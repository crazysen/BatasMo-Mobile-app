import React, {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getAttorneys} from '../services/attorneyService';
import {REFERENCE_THEME as T} from '../constants/referenceTheme';
import {ClientScreenShell, ClientFadeIn} from '../components/ClientScreenShell';
import ClientChevronBack from '../components/ClientChevronBack';

const ATTORNEYS_CACHE_KEY = 'book_attorneys_cache_v1';
const ATTORNEYS_CACHE_TTL_MS = 5 * 60 * 1000;

/** Back column + gap so subtitle aligns with title text, not the chevron. */
const HEADER_BACK_COL = 28;
const HEADER_BACK_GAP = 8;
const SUBTITLE_INDENT = HEADER_BACK_COL + HEADER_BACK_GAP;

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
            ...item,
            reviews: '128',
          },
        })}>
        <Text style={styles.profileButtonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function BookAppointment({navigation}) {
  const [attorneys, setAttorneys] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapRecords = useCallback(records => {
    return (Array.isArray(records) ? records : []).map(record => ({
      id: record.id,
      name: record.full_name || record.email || 'Attorney',
      specialty: record.specialties || 'General Practice',
      experience: record.years_experience
        ? `${record.years_experience} years experience`
        : 'Experience not set',
      rating: '4.9',
      price: record.consultation_fee
        ? `₱${Number(record.consultation_fee).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : '₱2,500.00',
      image: record.avatar_url || `https://i.pravatar.cc/150?u=${encodeURIComponent(record.email || record.id)}`,
    }));
  }, []);

  const loadAttorneys = useCallback(async () => {
    let usedCache = false;
    try {
      const raw = await AsyncStorage.getItem(ATTORNEYS_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed?.data &&
          Array.isArray(parsed.data) &&
          parsed.data.length > 0 &&
          Date.now() - (parsed.ts || 0) < ATTORNEYS_CACHE_TTL_MS
        ) {
          setAttorneys(parsed.data);
          setLoading(false);
          usedCache = true;
        }
      }
      if (!usedCache) {
        setLoading(true);
      }

      const records = await getAttorneys();
      const mapped = mapRecords(records);
      setAttorneys(mapped);
      await AsyncStorage.setItem(
        ATTORNEYS_CACHE_KEY,
        JSON.stringify({ts: Date.now(), data: mapped}),
      );
    } catch (error) {
      if (!usedCache) {
        Alert.alert('Error', error?.message ?? 'Failed to load attorneys.');
        setAttorneys([]);
      }
    } finally {
      setLoading(false);
    }
  }, [mapRecords]);

  useEffect(() => {
    loadAttorneys();
  }, [loadAttorneys]);

  return (
    <ClientScreenShell>
      <ClientFadeIn>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.backColumn}>
              <ClientChevronBack
                onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
              />
            </View>
            <Text style={styles.mainTitle} numberOfLines={2}>
              Book an Appointment
            </Text>
          </View>
          <Text style={styles.subtitle}>Choose from our experienced attorneys</Text>
        </View>
      </ClientFadeIn>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator color={T.gold[1]} />
          <Text style={styles.emptyText}>Loading attorney directory...</Text>
        </View>
      ) : attorneys.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No attorneys found yet.</Text>
        </View>
      ) : (
        <FlatList
          style={styles.listFlex}
          data={attorneys}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <ClientFadeIn delay={80 + index * 50}>
              <AttorneyCard item={item} navigation={navigation} />
            </ClientFadeIn>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews
        />
      )}
    </ClientScreenShell>
  );
}

const styles = StyleSheet.create({
  listFlex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backColumn: {
    width: HEADER_BACK_COL,
    marginRight: HEADER_BACK_GAP,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  mainTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: T.text,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: T.textSoft,
    marginTop: 6,
    marginLeft: SUBTITLE_INDENT,
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {marginTop: 8, color: T.textSoft, fontSize: 14, textAlign: 'center'},
  card: {
    backgroundColor: 'rgba(18, 26, 36, 0.85)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.2)',
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
    color: T.text,
    marginRight: 6,
  },
  verifiedIcon: {
    color: T.gold[1],
    fontSize: 16,
    fontWeight: '800',
  },
  specialtyText: {
    fontSize: 13,
    color: T.textSoft,
  },
  experienceText: {
    fontSize: 12,
    color: T.textMuted,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingStar: {
    color: T.gold[1],
    fontSize: 14,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 22,
    fontWeight: '800',
    color: T.gold[0],
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: T.gold[1],
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  bookButtonText: {
    color: T.base,
    fontWeight: '700',
    fontSize: 16,
  },
  profileButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(244, 215, 139, 0.45)',
    alignItems: 'center',
  },
  profileButtonText: {
    color: T.gold[0],
    fontWeight: '700',
    fontSize: 16,
  },
});
