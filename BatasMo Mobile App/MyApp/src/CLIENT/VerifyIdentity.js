import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView 
} from 'react-native';

const VerifyIdentity = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Verify Identity</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your email to access your secure legal portal.
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.label}>SECURE CODE</Text>
        <View style={styles.otpRow}>
          {[1, 2, 3, 4, 5].map((item) => (
            <TextInput
              key={item}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive the code? <Text style={styles.resendLink}>Resend Code</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => navigation.navigate('ResetPassword')}
      >
        <Text style={styles.buttonText}>Verify & Proceed</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.backButtonText}>← Back to Log In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24 },
  headerContainer: { marginTop: 80, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '700', color: '#0F172A', marginBottom: 12, fontFamily: 'serif' },
  subtitle: { textAlign: 'center', color: '#64748B', lineHeight: 20, paddingHorizontal: 20 },
  inputSection: { marginTop: 48 },
  label: { fontSize: 12, fontWeight: '800', color: '#0F172A', letterSpacing: 1.5, marginBottom: 16 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  otpInput: {
    width: 58,
    height: 68,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  resendContainer: { marginTop: 24, alignItems: 'center' },
  resendText: { color: '#64748B' },
  resendLink: { color: '#D97706', fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '700', fontSize: 16 },
  backButton: { marginTop: 32, alignItems: 'center' },
  backButtonText: { color: '#64748B', fontSize: 15 },
});

export default VerifyIdentity;