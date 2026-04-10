import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { 
  ChevronLeft, 
  Camera, 
  Edit3, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  UploadCloud,
  Plus
} from 'lucide-react-native';

const SpecializationTag = ({ label, isAdd = false }) => (
  <TouchableOpacity style={[styles.tag, isAdd && styles.addTag]}>
    {isAdd && <Plus size={14} color="#64748B" style={{marginRight: 4}} />}
    <Text style={[styles.tagText, isAdd && styles.addTagText]}>{label}</Text>
  </TouchableOpacity>
);

const DocRow = ({ title, size }) => (
  <View style={styles.docCard}>
    <View style={styles.docIconContainer}>
      <FileText size={20} color="#1E3A8A" />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.docTitle}>{title}</Text>
      <Text style={styles.docSize}>{size}</Text>
    </View>
    <CheckCircle2 size={20} color="#22C55E" />
  </View>
);

export default function ProfileSettings({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#1E3A8A" />
        </TouchableOpacity>
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.title}>Profile Settings</Text>
          <Text style={styles.networkSub}>BATASMO PROFESSIONAL NETWORK</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner and Profile Header */}
        <View style={styles.banner} />
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.cameraBtn}>
              <Camera size={14} color="#1E3A8A" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.editBtn}>
            <Edit3 size={16} color="#FFF" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>

          <Text style={styles.userName}>Atty. Julianne Smith</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
          <Text style={styles.bioText}>
            Senior Partner at BatasMo Chambers. Specialized in Civil Litigation and Corporate Law with over 12 years of courtroom experience.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Mail size={18} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>
          
          <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
          <Text style={styles.fieldValue}>j.smith@batasmo.com</Text>

          <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
          <Text style={styles.fieldValue}>+63 917 123 4567</Text>

          <Text style={styles.fieldLabel}>OFFICE ADDRESS</Text>
          <Text style={styles.fieldValue}>Level 24, Premium Law Tower, BGC, Taguig City</Text>
        </View>

        {/* Professional Info */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Briefcase size={18} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.sectionTitle}>Professional Info</Text>
          </View>
          
          <Text style={styles.fieldLabel}>CONSULTATION FEE</Text>
          <Text style={styles.fieldValue}>₱2,500.00 / hour</Text>

          <Text style={styles.fieldLabel}>YEARS OF PRACTICE</Text>
          <Text style={styles.fieldValue}>12 Years</Text>
        </View>

        {/* Legal Specializations */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleAlt}>Legal Specializations</Text>
          <View style={styles.tagContainer}>
            <SpecializationTag label="Civil Litigation" />
            <SpecializationTag label="Corporate Law" />
            <SpecializationTag label="Family Law" />
            <SpecializationTag label="Estate Planning" />
            <SpecializationTag label="Intellectual Property" />
            <SpecializationTag label="Add Specialty" isAdd />
          </View>
        </View>

        {/* Verification Documents */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleAlt}>Verification Documents</Text>
          <DocRow title="IBP Identification Card" size="2.4 MB" />
          <DocRow title="Certificate of Good Standing" size="1.8 MB" />
          
          <TouchableOpacity style={styles.uploadBtn}>
            <UploadCloud size={18} color="#64748B" />
            <Text style={styles.uploadBtnText}>Upload New Credentials</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E3A8A' },
  networkSub: { fontSize: 10, color: '#94A3B8', letterSpacing: 1, marginTop: 2 },
  
  banner: { height: 100, backgroundColor: '#0F172A' },
  profileSection: { 
    backgroundColor: '#FFF', 
    marginHorizontal: 20, 
    borderRadius: 24, 
    marginTop: -40, 
    padding: 20,
    alignItems: 'flex-start',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  avatarWrapper: { position: 'relative', marginTop: -60 },
  avatar: { width: 100, height: 100, borderRadius: 20, borderWidth: 4, borderColor: '#FFF' },
  cameraBtn: { 
    position: 'absolute', bottom: -5, right: -5, 
    backgroundColor: '#FFF', padding: 6, borderRadius: 15,
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  editBtn: { 
    flexDirection: 'row', alignSelf: 'flex-end', 
    backgroundColor: '#0F172A', paddingVertical: 8, paddingHorizontal: 16, 
    borderRadius: 10, marginTop: -40 
  },
  editBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 6, fontSize: 13 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1E3A8A', marginTop: 15 },
  verifiedBadge: { backgroundColor: '#BBF7D0', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 6, marginTop: 8 },
  verifiedText: { color: '#166534', fontSize: 12, fontWeight: '500' },
  bioText: { color: '#64748B', lineHeight: 20, marginTop: 12, fontSize: 14 },

  sectionCard: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 24, padding: 20, marginTop: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A', marginLeft: 10 },
  sectionTitleAlt: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 15 },
  
  fieldLabel: { fontSize: 10, color: '#94A3B8', fontWeight: 'bold', marginTop: 15 },
  fieldValue: { fontSize: 15, color: '#1E3A8A', fontWeight: '500', marginTop: 4 },

  tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: '#F1F5F9', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginRight: 8, marginBottom: 8 },
  tagText: { color: '#1E3A8A', fontWeight: '500', fontSize: 13 },
  addTag: { backgroundColor: '#FFF', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1', flexDirection: 'row', alignItems: 'center' },
  addTagText: { color: '#64748B' },

  docCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 15, borderRadius: 16, marginBottom: 12 },
  docIconContainer: { width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  docTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E3A8A' },
  docSize: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  
  uploadBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    padding: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 16, marginTop: 8 
  },
  uploadBtnText: { color: '#64748B', fontWeight: 'bold', marginLeft: 8 }
});