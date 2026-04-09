import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getFeedbackForAttorney} from '../services/consultationFeedbackService';

function StarRow({rating}) {
  const r = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
  return (
    <View style={styles.starRow} accessibilityLabel={`${r} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={i <= r ? styles.starOn : styles.starOff}>
          ★
        </Text>
      ))}
    </View>
  );
}

const AttorneyProfile = ({navigation, route}) => {
  const attorney = route?.params?.attorney || {
    id: null,
    name: 'Dr. Sarah Johnson',
    specialty: 'Corporate Law Expert',
    prc_id: 'PRC-12345-67890',
    rating: '4.9',
    reviews: '128',
    image: 'https://i.pravatar.cc/150?u=sarah',
  };

  const attorneyId = attorney?.id;
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState(null);
  const [allModalVisible, setAllModalVisible] = useState(false);

  const loadFeedback = useCallback(async () => {
    if (!attorneyId) {
      setFeedbackList([]);
      setFeedbackLoading(false);
      return;
    }
    setFeedbackLoading(true);
    setFeedbackError(null);
    try {
      const rows = await getFeedbackForAttorney(attorneyId, {limit: 50});
      setFeedbackList(rows);
    } catch (e) {
      setFeedbackError(e?.message || 'Could not load reviews');
      setFeedbackList([]);
    } finally {
      setFeedbackLoading(false);
    }
  }, [attorneyId]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const {avgRating, reviewCount} = useMemo(() => {
    if (!feedbackList.length) {
      return {
        avgRating: Number(attorney.rating) || 0,
        reviewCount: Number(String(attorney.reviews).replace(/\D/g, '')) || 0,
      };
    }
    const sum = feedbackList.reduce((a, x) => a + (Number(x.rating) || 0), 0);
    return {
      avgRating: sum / feedbackList.length,
      reviewCount: feedbackList.length,
    };
  }, [feedbackList, attorney.rating, attorney.reviews]);

  const previewFeedback = useMemo(() => feedbackList.slice(0, 10), [feedbackList]);

  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.canGoBack() ? navigation.goBack() : null;
    }
  };

  const handleBookConsultation = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('BookNow', {
        attorney: {
          id: attorney.id,
          name: attorney.name,
          specialty: attorney.specialty,
          price: attorney.price,
          image: attorney.image,
        },
      });
    }
  };

  const StatCard = ({label, value}) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const Badge = ({text}) => (
    <View style={styles.tagBadge}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );

  const renderFeedbackCard = (item, index, fullWidth) => {
    const name = item.client_display_name?.trim() || 'Verified client';
    const quote = item.comment?.trim() || 'No written comment.';
    return (
      <View
        key={item.id || String(index)}
        style={[styles.feedbackCard, fullWidth ? styles.feedbackCardFull : null]}>
        <StarRow rating={item.rating} />
        <Text style={styles.feedbackText}>"{quote}"</Text>
        <View style={styles.clientInfo}>
          <View style={styles.avatarPlaceholder} />
          <View style={{flex: 1}}>
            <Text style={styles.clientName} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.clientRole}>Consultation client</Text>
          </View>
        </View>
      </View>
    );
  };

  const ratingDisplay = avgRating.toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerBackground}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.profileImageContainer}>
            <Image source={{uri: attorney.image}} style={styles.profileImage} />
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{attorney.name} ✓</Text>
            <Text style={styles.titleText}>{attorney.specialty}</Text>
            {attorney.prc_id ? <Text style={styles.prcText}>PRC License: {attorney.prc_id}</Text> : null}
            <Text style={styles.ratingText}>
              ★ {ratingDisplay} ({reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'})
            </Text>
          </View>

          <View style={styles.statsOverlay}>
            <StatCard value="15+" label="YEARS EXP" />
            <StatCard value="500+" label="CASES" />
            <StatCard value="98%" label="SUCCESS" />
          </View>
        </View>

        <View style={styles.contentPadding}>
          <Text style={styles.sectionTitle}>Biography</Text>
          <Text style={styles.bioText}>
            {attorney.name} is a distinguished {attorney.specialty} with over 15 years of experience in
            facilitating complex international mergers and navigating high-stakes regulatory landscapes.
          </Text>

          <View style={styles.tagContainer}>
            <Badge text="Mergers & Acquisitions" />
            <Badge text="Contract Law" />
            <Badge text="Intellectual Property" />
          </View>

          <View style={styles.feedbackHeader}>
            <Text style={styles.sectionTitle}>Recent Client Feedback</Text>
            {feedbackList.length > 2 ? (
              <TouchableOpacity onPress={() => setAllModalVisible(true)}>
                <Text style={styles.viewAll}>VIEW ALL</Text>
              </TouchableOpacity>
            ) : (
              <View style={{width: 56}} />
            )}
          </View>

          {feedbackLoading ? (
            <View style={styles.feedbackLoading}>
              <ActivityIndicator color="#EAB308" />
              <Text style={styles.feedbackLoadingText}>Loading reviews…</Text>
            </View>
          ) : feedbackError ? (
            <Text style={styles.feedbackError}>{feedbackError}</Text>
          ) : previewFeedback.length === 0 ? (
            <Text style={styles.feedbackEmpty}>No client feedback yet. Reviews appear after consultations end.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.feedbackScroll}>
              {previewFeedback.map((item, i) => renderFeedbackCard(item, i, false))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookConsultation} activeOpacity={0.8}>
          <Text style={styles.bookButtonText}>Book a Consultation</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={allModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAllModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>All feedback</Text>
              <TouchableOpacity onPress={() => setAllModalVisible(false)} hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {feedbackList.map((item, i) => renderFeedbackCard(item, i, true))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  headerBackground: {
    backgroundColor: '#0F172A',
    paddingTop: 20,
    paddingBottom: 80,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  backButton: {position: 'absolute', left: 20, top: 20, zIndex: 10},
  backIcon: {color: 'white', fontSize: 32},
  profileImageContainer: {marginTop: 20},
  profileImage: {width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#1E293B'},
  nameContainer: {alignItems: 'center', marginTop: 15},
  nameText: {color: 'white', fontSize: 24, fontWeight: 'bold', fontFamily: 'serif'},
  titleText: {color: '#94A3B8', fontSize: 16, marginTop: 4},
  prcText: {color: '#CBD5E1', fontSize: 13, marginTop: 4, fontStyle: 'italic'},
  ratingText: {color: '#EAB308', marginTop: 8, fontWeight: 'bold'},
  statsOverlay: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -40,
    width: '90%',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    width: '31%',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statValue: {fontSize: 20, fontWeight: 'bold', color: '#0F172A'},
  statLabel: {fontSize: 10, color: '#64748B', marginTop: 4, fontWeight: '800'},
  contentPadding: {paddingHorizontal: 20, marginTop: 60},
  sectionTitle: {fontSize: 22, fontWeight: 'bold', color: '#0F172A', fontFamily: 'serif', marginBottom: 12},
  bioText: {color: '#64748B', lineHeight: 22, fontSize: 15},
  tagContainer: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 15},
  tagBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {color: '#475569', fontSize: 12, fontWeight: '600'},
  feedbackHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25},
  viewAll: {color: '#EAB308', fontWeight: 'bold', fontSize: 12},
  feedbackScroll: {marginTop: 15, marginBottom: 100},
  feedbackCard: {
    backgroundColor: 'white',
    width: 280,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginRight: 15,
  },
  feedbackCardFull: {
    width: '100%',
    marginRight: 0,
    marginBottom: 16,
  },
  starRow: {flexDirection: 'row', marginBottom: 10},
  starOn: {color: '#EAB308', fontSize: 16},
  starOff: {color: '#E2E8F0', fontSize: 16},
  feedbackText: {color: '#475569', fontStyle: 'italic', lineHeight: 20},
  clientInfo: {flexDirection: 'row', alignItems: 'center', marginTop: 15},
  avatarPlaceholder: {width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', marginRight: 10},
  clientName: {fontWeight: 'bold', color: '#0F172A'},
  clientRole: {fontSize: 11, color: '#94A3B8'},
  footer: {position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: 'white'},
  bookButton: {backgroundColor: '#EAB308', paddingVertical: 18, borderRadius: 15},
  bookButtonText: {textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 18},
  feedbackLoading: {paddingVertical: 24, alignItems: 'center'},
  feedbackLoadingText: {marginTop: 8, color: '#64748B', fontSize: 13},
  feedbackError: {color: '#B91C1C', marginTop: 8, fontSize: 13},
  feedbackEmpty: {color: '#64748B', fontSize: 14, lineHeight: 20, marginTop: 8, marginBottom: 24},
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', color: '#0F172A', fontFamily: 'serif'},
  modalClose: {color: '#EAB308', fontWeight: '700', fontSize: 15},
  modalScroll: {paddingHorizontal: 20, paddingTop: 12},
});

export default AttorneyProfile;
