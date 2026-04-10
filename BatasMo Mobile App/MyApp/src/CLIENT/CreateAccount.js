// CreateProfilePage.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

const navy = '#0F1E36';
const blueGray = '#7B8BA3';
const lightGray = '#F3F4F6';

export default function CreateProfilePage({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateAndSubmit = () => {
    if (!fullName) return Alert.alert('Error', 'Full name is required');
    if (!email) return Alert.alert('Error', 'Email is required');
    if (!email.includes('@') || !email.includes('.'))
      return Alert.alert('Error', 'Enter valid email');
    if (!password) return Alert.alert('Error', 'Password is required');
    if (password.length < 6)
      return Alert.alert('Error', 'Minimum 6 characters');
    if (!confirmPassword)
      return Alert.alert('Error', 'Confirm your password');
    if (password !== confirmPassword)
      return Alert.alert('Error', 'Passwords do not match');

    if (!contactNumber) return Alert.alert('Error', 'Contact number is required');
    if (!/^\d+$/.test(contactNumber)) return Alert.alert('Error', 'Contact number must contain only numbers');
    if (contactNumber.length < 10) return Alert.alert('Error', 'Contact number must be at least 10 digits');

    // Hardcode role to Client for public sign up
    navigation.navigate('VerifyAccount', { email, fullName, contactNumber, role: 'client' });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingVertical: 40 }}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: navy, fontSize: 20 }}>←</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Profile</Text>
        <Text style={styles.subtitle}>Join the BatasMo legal network.</Text>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Alexander Hamilton"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Contact Number */}
        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="09171234567"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="name@domain.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={validateAndSubmit}
        >
          <Text style={styles.submitText}>Create Account</Text>
        </TouchableOpacity>

        {/* Login Text */}
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>Log In</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E9ECEF',
    flex: 1,
  },
  backButton: {
    marginLeft: 20,
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 15 },
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: navy,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: blueGray,
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: lightGray,
    borderRadius: 14,
    marginBottom: 24,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleText: {
    fontWeight: '600',
    color: blueGray,
  },
  activeToggle: {
    backgroundColor: '#fff',
    borderRadius: 14,
  },
  activeText: {
    color: navy,
  },
  label: {
    fontWeight: '600',
    color: navy,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8F9FB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  submitButton: {
    backgroundColor: navy,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  loginText: {
    textAlign: 'center',
    fontSize: 14,
    color: blueGray,
  },
  loginLink: {
    color: '#D4AF37',
    fontWeight: '600',
  },
});