import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';

const AttorneyDashboard = ({ navigation }) => {
  const recentConsultations = [
    { id: '1', name: 'Michael Roberts', type: 'CIVIL LITIGATION', time: '10:00 AM', date: 'Oct 24, 2024', initial: 'M' },
    { id: '2', name: 'Sarah Jenkins', type: 'FAMILY LAW', time: '02:30 PM', date: 'Oct 25, 2024', initial: 'S' },
    { id: '3', name: 'David Chen', type: 'CORPORATE LAW', time: '04:00 PM', date: 'Oct 25, 2024', initial: 'D' },
  ];

  const MetricBar = ({ label, percentage, color, value }) => (
    <View style={styles.metricContainer}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}%</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity><Text style={styles.menuIcon}>☰</Text></TouchableOpacity>
        <Text style={styles.navTitle}>ATTORNEY DASHBOARD</Text>
        <View style={styles.navRight}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.profileContainer}>
             <View style={styles.profileCircle} />
             <View style={styles.pendingBadge}><Text style={styles.badgeText}>PENDING</Text></View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcomeText}>Welcome back, Atty. Julianne</Text>
        <Text style={styles.subtitle}>Here's what's happening with your practice today.</Text>

        <TouchableOpacity 
          style={styles.manageAvailabilityBtn}
          onPress={() => navigation.navigate('AttyAvailabilityManager')}
        >
          <Text style={styles.btnIcon}>📅</Text>
          <Text style={styles.btnText}>Manage Availability</Text>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Text style={{ color: '#D97706' }}>🕒</Text>
            </View>
            <Text style={styles.statLabel}>PENDING{"\n"}CONSULTATIONS</Text>
            <Text style={styles.statNumber}>12</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Text style={{ color: '#2563EB' }}>📅</Text>
            </View>
            <Text style={styles.statLabel}>UPCOMING{"\n"}APPOINTMENTS</Text>
            <Text style={styles.statNumber}>5</Text>
          </View>
        </View>

        {/* Recent Consultations */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Consultations</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AttyConsultationRequest')}>
              <Text style={styles.viewAll}>VIEW ALL ›</Text>
            </TouchableOpacity>
          </View>
          
          {recentConsultations.map((item) => (
            <View key={item.id} style={styles.consultationRow}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{item.initial}</Text></View>
              <View style={styles.consultInfo}>
                <Text style={styles.clientName}>{item.name}</Text>
                <Text style={styles.legalType}>{item.type}</Text>
                <Text style={styles.dateInfo}>{item.date}</Text>
              </View>
              <View style={styles.statusCol}>
                <View style={styles.pendingTag}><Text style={styles.tagText}>PENDING</Text></View>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Growth Banner */}
        <View style={styles.growthBanner}>
          <Text style={styles.growthTitle}>Grow your law{"\n"}practice</Text>
          <Text style={styles.growthSub}>Keep your availability updated to receive more consultation requests from premium clients.</Text>
          <TouchableOpacity style={styles.scheduleBtn}>
            <Text style={styles.scheduleBtnText}>Manage My Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Performance Metrics */}
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  navTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', fontFamily: 'serif' },
  navRight: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#CBD5E1', marginLeft: 10 },
  pendingBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#D9B041', paddingHorizontal: 4, borderRadius: 4 },
  badgeText: { fontSize: 6, color: 'white', fontWeight: 'bold' },
  
  scrollContent: { padding: 20 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', fontFamily: 'serif' },
  subtitle: { color: '#64748B', marginTop: 4, marginBottom: 20 },
  
  manageAvailabilityBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, backgroundColor: 'white' },
  btnText: { fontWeight: 'bold', marginLeft: 8, color: '#1E293B' },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  statCard: { width: '48%', backgroundColor: 'white', padding: 20, borderRadius: 20, elevation: 2 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  statLabel: { fontSize: 10, fontWeight: 'bold', color: '#94A3B8' },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#1E293B', marginTop: 5 },

  sectionCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  viewAll: { color: '#D9B041', fontWeight: 'bold', fontSize: 12 },

  consultationRow: { flexDirection: 'row', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  avatar: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: 'bold', color: '#1E293B' },
  consultInfo: { flex: 1, marginLeft: 15 },
  clientName: { fontWeight: 'bold', color: '#1E293B' },
  legalType: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  dateInfo: { fontSize: 12, color: '#64748B', marginTop: 8 },
  statusCol: { alignItems: 'flex-end' },
  pendingTag: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 10, color: '#D97706', fontWeight: 'bold' },
  timeText: { fontSize: 12, color: '#64748B', marginTop: 10 },

  growthBanner: { backgroundColor: '#0F172A', borderRadius: 24, padding: 25, marginTop: 20 },
  growthTitle: { color: 'white', fontSize: 26, fontWeight: 'bold', fontFamily: 'serif' },
  growthSub: { color: '#94A3B8', marginTop: 15, lineHeight: 20 },
  scheduleBtn: { backgroundColor: '#D9B041', padding: 18, borderRadius: 16, marginTop: 20 },
  scheduleBtnText: { textAlign: 'center', fontWeight: 'bold', color: '#1E293B' },

  metricContainer: { marginTop: 20 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metricLabel: { fontSize: 11, fontWeight: 'bold', color: '#94A3B8' },
  metricValue: { fontSize: 11, fontWeight: 'bold', color: '#1E293B' },
  progressBarBg: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3 },
  progressBarFill: { height: 6, borderRadius: 3 },
});

export default AttorneyDashboard;