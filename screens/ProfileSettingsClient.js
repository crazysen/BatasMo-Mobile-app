import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useUserProfile} from '../context/UserProfileContext';
import {getMyProfile, updateMyProfile} from '../services/profileService';

const ProfileSettingsClient = ({navigation}) => {
  const {profile, updateProfile} = useUserProfile();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getMyProfile();
        const resolvedName = data?.full_name ?? profile.name;
        const resolvedEmail = data?.email ?? profile.email;
        const resolvedPhone = data?.phone ?? profile.phone;
        const resolvedAddress = data?.address ?? profile.address;

        setName(resolvedName || '');
        setEmail(resolvedEmail || '');
        setPhone(resolvedPhone || '');
        setAddress(resolvedAddress || '');

        updateProfile({
          name: resolvedName || '',
          email: resolvedEmail || '',
          phone: resolvedPhone || '',
          address: resolvedAddress || '',
          role: (data?.role || profile.role || 'client').toLowerCase() === 'attorney' ? 'Attorney' : 'Client',
        });
      } catch (error) {
        Alert.alert('Error', error?.message ?? 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Full name is required.');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'Contact number is required.');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Error', 'Address is required.');
      return;
    }

    try {
      setSaving(true);
      const updated = await updateMyProfile({
        full_name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        role: 'client',
      });

      updateProfile({
        name: updated?.full_name ?? name.trim(),
        email: updated?.email ?? email.trim(),
        phone: updated?.phone ?? phone.trim(),
        address: updated?.address ?? address.trim(),
        role: 'Client',
      });

      Alert.alert('Saved', 'Profile settings updated.');
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Unable to save profile settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setAddress(profile.address);
    navigation.goBack();
  };

  const initials = name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'AJ';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#0F172A" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Full name"
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={email}
            editable={false}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="name@domain.com"
          />

          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="09xxxxxxxxx"
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={address}
            onChangeText={setAddress}
            placeholder="Street, City"
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving || loading}>
              <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSettingsClient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    marginBottom: 4,
  },
  backText: {
    color: '#EAB308',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F1E36',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {fontSize: 13, color: '#64748B'},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 2,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignSelf: 'center',
    backgroundColor: '#0F1E36',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
  },
  name: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1E36',
  },
  email: {
    textAlign: 'center',
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1E36',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    color: '#0F1E36',
  },
  disabledInput: {
    backgroundColor: '#EEF2F7',
    color: '#64748B',
  },
  multilineInput: {
    minHeight: 82,
    textAlignVertical: 'top',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#0F1E36',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonRow: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    width: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#0F1E36',
    fontSize: 15,
    fontWeight: '600',
  },
});
