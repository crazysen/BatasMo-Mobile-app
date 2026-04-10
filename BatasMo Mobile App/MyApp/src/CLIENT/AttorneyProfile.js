import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const AttorneyProfile = () => {
  const StatCard = ({ label, value }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const Badge = ({ text }) => (
    <View style={styles.tagBadge}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Dark Header Section */}
        <View style={styles.headerBackground}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/150' }} 
              style={styles.profileImage} 
            />
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>Dr. Sarah Johnson ✓</Text>
            <Text style={styles.titleText}>Corporate Law Expert</Text>
            <Text style={styles.titleText}>PRC License: 0123456</Text>
            <Text style={styles.ratingText}>★ 4.9 (128 Reviews)</Text>
          </View>

          {/* Stats Overlay */}
          <View style={styles.statsOverlay}>
            <StatCard value="15+" label="YEARS EXP" />
            <StatCard value="500+" label="CASES" />
            <StatCard value="98%" label="SUCCESS" />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentPadding}>
          <Text style={styles.sectionTitle}>Biography</Text>
          <Text style={styles.bioText}>
            Dr. Sarah Johnson is a distinguished Corporate Law Expert with over 15 years of 
            experience in facilitating complex international mergers and navigating 
            high-stakes regulatory landscapes.
          </Text>

          <View style={styles.tagContainer}>
            <Badge text="Mergers & Acquisitions" />
            <Badge text="Contract Law" />
            <Badge text="Intellectual Property" />
          </View>

          <View style={styles.feedbackHeader}>
            <Text style={styles.sectionTitle}>Recent Client Feedback</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Feedback Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.feedbackScroll}>
            {[1, 2].map((i) => (
              <View key={i} style={styles.feedbackCard}>
                <Text style={styles.stars}>★★★★★</Text>
                <Text style={styles.feedbackText}>
                  "Dr. Johnson provided exceptional guidance during our acquisition. Highly professional and insightful."
                </Text>
                <View style={styles.clientInfo}>
                  <View style={styles.avatarPlaceholder} />
                  <View>
                    <Text style={styles.clientName}>Robert T.</Text>
                    <Text style={styles.clientRole}>CEO, TechCore Inc.</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book a Consultation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerBackground: {
    backgroundColor: '#0F172A',
    paddingTop: 20,
    paddingBottom: 80,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  backButton: { position: 'absolute', left: 20, top: 20 },
  backIcon: { color: 'white', fontSize: 32 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#1E293B' },
  nameContainer: { alignItems: 'center', marginTop: 15 },
  nameText: { color: 'white', fontSize: 24, fontWeight: 'bold', fontFamily: 'serif' },
  titleText: { color: '#94A3B8', fontSize: 16, marginTop: 4 },
  ratingText: { color: '#EAB308', marginTop: 8, fontWeight: 'bold' },
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
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  statLabel: { fontSize: 10, color: '#64748B', marginTop: 4, fontWeight: '800' },
  contentPadding: { paddingHorizontal: 20, marginTop: 60 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#0F172A', fontFamily: 'serif', marginBottom: 12 },
  bioText: { color: '#64748B', lineHeight: 22, fontSize: 15 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 },
  tagBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  tagText: { color: '#475569', fontSize: 12, fontWeight: '600' },
  feedbackHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 },
  viewAll: { color: '#EAB308', fontWeight: 'bold', fontSize: 12 },
  feedbackScroll: { marginTop: 15, marginBottom: 100 },
  feedbackCard: { backgroundColor: 'white', width: 280, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', marginRight: 15 },
  stars: { color: '#EAB308', marginBottom: 10 },
  feedbackText: { color: '#475569', fontStyle: 'italic', lineHeight: 20 },
  clientInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', marginRight: 10 },
  clientName: { fontWeight: 'bold', color: '#0F172A' },
  clientRole: { fontSize: 11, color: '#94A3B8' },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: 'white' },
  bookButton: { backgroundColor: '#EAB308', paddingVertical: 18, borderRadius: 15 },
  bookButtonText: { textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 18 }
});

export default AttorneyProfile;