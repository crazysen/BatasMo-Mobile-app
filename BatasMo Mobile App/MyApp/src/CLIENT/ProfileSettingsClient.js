import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const ProfileSettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Profile Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your account information</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Picture Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile Picture</Text>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>J</Text>
              </View>
              <TouchableOpacity style={styles.cameraBadge}>
                <Ionicons name="camera" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
            
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Upload New Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information Card */}
        <View style={styles.card}>
          <div style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <TouchableOpacity style={styles.editProfileBtn}>
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </div>

          <InputField label="Full Name" value="John Doe" icon="user" />
          <InputField label="Age" value="17" icon="calendar" />
          <InputField label="Email Address" value="john.doe@example.com" icon="mail" />
          <InputField label="Contact Number" value="+1 (555) 123-4567" icon="smartphone" />
          <InputField label="Address" value="123 Main Street, City, State 12345" icon="map-pin" multiline />
          <InputField label="Guardian Details (If Minor)" value="Jane Doe (Mother) - +1 (555) 987-6543" icon="shield" multiline />
        </View>

        {/* Security Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>
          <SecurityField label="Current Password" icon="lock" />
          <SecurityField label="New Password" icon="lock" />
          <SecurityField label="Confirm New Password" icon="lock" />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Update Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// Helper Components
const InputField = ({ label, value, icon, multiline }) => (
  <View style={styles.inputGroup}>
    <View style={styles.labelRow}>
      <Feather name={icon} size={14} color="#114BCB" />
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
    <TextInput 
      style={[styles.input, multiline && styles.textArea]} 
      value={value} 
      editable={false}
      multiline={multiline}
    />
  </View>
);

const SecurityField = ({ label }) => (
  <View style={styles.inputGroup}>
    <View style={styles.labelRow}>
      <Feather name="lock" size={14} color="#64748B" />
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
    <TextInput style={styles.input} secureTextEntry />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  headerTextContainer: { marginLeft: 15 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  headerSubtitle: { fontSize: 13, color: '#64748B' },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 20 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  avatarSection: { alignItems: 'center' },
  avatarContainer: { marginBottom: 15 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { color: '#FFF', fontSize: 40, fontWeight: '600' },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#EAB308',
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  userEmail: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  uploadButtonText: { fontWeight: '600', color: '#1E293B' },
  editProfileBtn: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  editProfileBtnText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  inputGroup: { marginBottom: 15 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginLeft: 8 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    color: '#1E293B',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  updateButton: { backgroundColor: '#1E293B', borderRadius: 10, flex: 0.65, paddingVertical: 14, alignItems: 'center' },
  updateButtonText: { color: '#FFF', fontWeight: '700' },
  cancelButton: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, flex: 0.3, paddingVertical: 14, alignItems: 'center' },
  cancelButtonText: { color: '#1E293B', fontWeight: '600' },
});

export default ProfileSettingsScreen;