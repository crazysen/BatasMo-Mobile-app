import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useUserProfile} from '../context/UserProfileContext';
import {getMyAppointments} from '../services/appointmentService';

function resolveScheduleValue(item) {
  return (
    item?.scheduled_at ||
    item?.preferred_date ||
    item?.updated_at ||
    item?.created_at ||
    null
  );
}

const AttorneyDashboard = ({navigation}) => {
  const {width} = useWindowDimensions();
  const isSmallScreen = width < 380;
  const {profile} = useUserProfile();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await getMyAppointments();
      setAppointments(Array.isArray(rows) ? rows : []);
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Failed to load dashboard data.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

  const pendingCount = appointments.filter(
    item => (item.status ?? '').toLowerCase() === 'pending',
  ).length;
  const upcomingCount = appointments.filter(item => {
    const status = (item.status ?? '').toLowerCase();
    return status === 'confirmed' || status === 'rescheduled';
  }).length;

  const recentConsultations = appointments.slice(0, 3).map(item => {
    const scheduleValue = resolveScheduleValue(item);
    let dateValue = null;
    if (scheduleValue) {
      const raw = String(scheduleValue).trim();
      const hasTimezoneInfo = /([zZ]|[+-]\d{2}:?\d{2})$/.test(raw);

      if (hasTimezoneInfo) {
        const normalized = raw.replace(' ', 'T').replace(/\+00$/, 'Z');
        dateValue = new Date(normalized);
      } else {
        const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
        if (match) {
          dateValue = new Date(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3]),
            Number(match[4]),
            Number(match[5]),
          );
        } else {
          dateValue = new Date(raw.replace(' ', 'T'));
        }
      }
    }
    return {
      id: item.id,
      name: item.client_name || 'Client',
      type: item.title || 'Consultation',
      time: dateValue && !Number.isNaN(dateValue.getTime())
        ? dateValue.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        : '--:--',
      date: dateValue && !Number.isNaN(dateValue.getTime())
        ? dateValue.toLocaleDateString()
        : 'No schedule',
      status: (item.status || 'pending').toUpperCase(),
      initial: (item.client_name || 'C').trim()[0]?.toUpperCase() || 'C',
    };
  });

  const displayName = profile?.name?.trim() || profile?.full_name?.trim() || 'Attorney';

  const MetricBar = ({label, percentage, color, value}) => (
    <View style={styles.metricContainer}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}%</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, {width: `${percentage}%`, backgroundColor: color}]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('AttyMenu')}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.navTitleWrap}>
          <Text
            style={[styles.navTitle, isSmallScreen && styles.navTitleSmall]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}>
            ATTORNEY DASHBOARD
          </Text>
        </View>
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => navigation.navigate('AttyProfileSettings')}>
            <View style={styles.profileCircle} />
            <View style={styles.pendingBadge}>
              <Text style={styles.badgeText}>PENDING</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isSmallScreen && styles.scrollContentSmall]}>
        <Text style={[styles.welcomeText, isSmallScreen && styles.welcomeTextSmall]} numberOfLines={2}>
          Welcome back, Atty. {displayName}
        </Text>
        <Text style={styles.subtitle}>Here&apos;s what&apos;s happening with your practice today.</Text>

        <TouchableOpacity
          style={styles.manageAvailabilityBtn}
          onPress={() => navigation.navigate('AttyAvailabilityManager')}>
          <Text style={styles.btnIcon}>📅</Text>
          <Text style={styles.btnText}>Manage Availability</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.statCard, isSmallScreen && styles.statCardSmall]}
            onPress={() => navigation.navigate('AttyConsultationRequest')}>
            <View style={[styles.iconCircle, {backgroundColor: '#FEF3C7'}]}>
              <Text style={{color: '#D97706'}}>🕒</Text>
            </View>
            <Text style={styles.statLabel}>PENDING{'\n'}CONSULTATIONS</Text>
            <Text style={[styles.statNumber, isSmallScreen && styles.statNumberSmall]}>
              {loading ? '--' : pendingCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, isSmallScreen && styles.statCardSmall]}
            onPress={() => navigation.navigate('AttyMyAppointments')}>
            <View style={[styles.iconCircle, {backgroundColor: '#DBEAFE'}]}>
              <Text style={{color: '#2563EB'}}>📅</Text>
            </View>
            <Text style={styles.statLabel}>UPCOMING{'\n'}APPOINTMENTS</Text>
            <Text style={[styles.statNumber, isSmallScreen && styles.statNumberSmall]}>
              {loading ? '--' : upcomingCount}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Consultations</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AttyConsultationRequest')}>
              <Text style={styles.viewAll}>VIEW ALL ›</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator color="#1E293B" />
            </View>
          ) : recentConsultations.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.emptyText}>No consultations yet.</Text>
            </View>
          ) : (
            recentConsultations.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.consultationRow}
                onPress={() => navigation.navigate('AttyConsultationRequest')}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.initial}</Text>
                </View>
                <View style={styles.consultInfo}>
                  <Text style={styles.clientName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.legalType}>{String(item.type).toUpperCase()}</Text>
                  <Text style={styles.dateInfo}>{item.date}</Text>
                </View>
                <View style={styles.statusCol}>
                  <View style={styles.pendingTag}>
                    <Text style={styles.tagText}>{item.status}</Text>
                  </View>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.growthBanner}>
          <Text style={[styles.growthTitle, isSmallScreen && styles.growthTitleSmall]}>
            Grow your law{'\n'}practice
          </Text>
          <Text style={styles.growthSub}>
            Keep your availability updated to receive more consultation requests from premium clients.
          </Text>
          <TouchableOpacity style={styles.scheduleBtn} onPress={() => navigation.navigate('AttyAvailabilityManager')}>
            <Text style={styles.scheduleBtnText}>Manage My Schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>PERFORMANCE METRICS</Text>
          <MetricBar label="PROFILE VISIBILITY" percentage={85} color="#D9B041" value={85} />
          <MetricBar label="CLIENT SATISFACTION" percentage={94} color="#10B981" value={94} />
          <MetricBar label="RESPONSE RATE" percentage={98} color="#1E293B" value={98} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  navButton: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  navTitleWrap: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6},
  navTitle: {fontSize: 16, fontWeight: 'bold', color: '#1E293B'},
  navTitleSmall: {fontSize: 14},
  navRight: {flexDirection: 'row', alignItems: 'center'},
  profileContainer: {position: 'relative'},
  profileCircle: {width: 32, height: 32, borderRadius: 16, backgroundColor: '#CBD5E1', marginLeft: 4},
  pendingBadge: {position: 'absolute', bottom: -5, right: -5, backgroundColor: '#D9B041', paddingHorizontal: 4, borderRadius: 4},
  badgeText: {fontSize: 6, color: 'white', fontWeight: 'bold'},
  menuIcon: {fontSize: 20, color: '#1E293B'},
  bellIcon: {fontSize: 17},
  scrollContent: {padding: 20, paddingBottom: 28},
  scrollContentSmall: {paddingHorizontal: 14},
  welcomeText: {fontSize: 24, fontWeight: 'bold', color: '#1E293B'},
  welcomeTextSmall: {fontSize: 21},
  subtitle: {color: '#64748B', marginTop: 4, marginBottom: 20},
  manageAvailabilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  btnIcon: {fontSize: 20},
  btnText: {fontWeight: 'bold', marginLeft: 8, color: '#1E293B'},
  statsRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 10},
  statCard: {flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 20, elevation: 2},
  statCardSmall: {padding: 12},
  iconCircle: {width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15},
  statLabel: {fontSize: 10, fontWeight: 'bold', color: '#94A3B8'},
  statNumber: {fontSize: 32, fontWeight: 'bold', color: '#1E293B', marginTop: 5},
  statNumberSmall: {fontSize: 26},
  sectionCard: {backgroundColor: 'white', borderRadius: 20, padding: 20, marginTop: 20},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', color: '#1E293B'},
  viewAll: {color: '#D9B041', fontWeight: 'bold', fontSize: 12},
  centerBox: {paddingVertical: 20, alignItems: 'center'},
  emptyText: {fontSize: 13, color: '#64748B'},
  consultationRow: {flexDirection: 'row', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9'},
  avatar: {width: 45, height: 45, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center'},
  avatarText: {fontWeight: 'bold', color: '#1E293B'},
  consultInfo: {flex: 1, marginLeft: 15},
  clientName: {fontWeight: 'bold', color: '#1E293B'},
  legalType: {fontSize: 10, color: '#94A3B8', marginTop: 2},
  dateInfo: {fontSize: 12, color: '#64748B', marginTop: 8},
  statusCol: {alignItems: 'flex-end', minWidth: 88},
  pendingTag: {backgroundColor: '#FEF9C3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6},
  tagText: {fontSize: 10, color: '#854D0E', fontWeight: 'bold'},
  timeText: {fontSize: 12, color: '#64748B', marginTop: 10},
  growthBanner: {backgroundColor: '#0F172A', borderRadius: 24, padding: 25, marginTop: 20},
  growthTitle: {color: 'white', fontSize: 26, fontWeight: 'bold'},
  growthTitleSmall: {fontSize: 22},
  growthSub: {color: '#94A3B8', marginTop: 15, lineHeight: 20},
  scheduleBtn: {backgroundColor: '#D9B041', padding: 18, borderRadius: 16, marginTop: 20},
  scheduleBtnText: {textAlign: 'center', fontWeight: 'bold', color: '#1E293B'},
  metricContainer: {marginTop: 20},
  metricHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8},
  metricLabel: {fontSize: 11, fontWeight: 'bold', color: '#94A3B8'},
  metricValue: {fontSize: 11, fontWeight: 'bold', color: '#1E293B'},
  progressBarBg: {height: 6, backgroundColor: '#F1F5F9', borderRadius: 3},
  progressBarFill: {height: 6, borderRadius: 3},
});

export default AttorneyDashboard;
