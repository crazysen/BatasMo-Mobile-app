import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert 
} from 'react-native';

const RequirementRow = ({ label, isMet }) => (
  <View style={styles.reqRow}>
    <View style={[styles.circle, isMet && styles.circleActive]}>
      {isMet && <Text style={styles.checkMark}>✓</Text>}
    </View>
    <Text style={[styles.reqText, isMet && styles.reqTextActive]}>{label}</Text>
  </View>
);

const ResetPassword = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const handleUpdatePassword = () => {
    if (!hasMinLength || !hasNumber || !hasSpecialChar) {
      return Alert.alert('Error', 'Please meet all password requirements');
    }
    if (!passwordsMatch) {
      return Alert.alert('Error', 'Passwords do not match');
    }
    
    Alert.alert(
      'Success', 
      'Your password has been updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 24 }}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Choose a strong and secure password for your account.</Text>

      <View style={styles.form}>
        <Text style={styles.fieldLabel}>New Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput 
            style={styles.input} 
            placeholder="Enter new password" 
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <Text>{showNewPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.fieldLabel, { marginTop: 24 }]}>Confirm New Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput 
            style={styles.input} 
            placeholder="Re-enter new password" 
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Text>{showConfirmPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.requirementsContainer}>
        <Text style={styles.reqHeader}>PASSWORD REQUIREMENTS</Text>
        <RequirementRow label="At least 8 characters" isMet={hasMinLength} />
        <RequirementRow label="Contains a number" isMet={hasNumber} />
        <RequirementRow label="Contains a special character" isMet={hasSpecialChar} />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleUpdatePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24 },
  backArrow: { marginTop: 20, marginBottom: 30 },
  title: { fontSize: 36, fontWeight: '700', color: '#0F172A', marginBottom: 8, fontFamily: 'serif' },
  subtitle: { fontSize: 16, color: '#64748B', marginBottom: 40, lineHeight: 22 },
  fieldLabel: { fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: { flex: 1, color: '#0F172A', fontSize: 16 },
  requirementsContainer: { marginTop: 32 },
  reqHeader: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 1, marginBottom: 16 },
  reqRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  circle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  circleActive: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
  checkMark: { color: '#22C55E', fontSize: 12, fontWeight: 'bold' },
  reqText: { color: '#64748B', fontSize: 15 },
  reqTextActive: { color: '#0F172A' },
  primaryButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 40,
  },
  buttonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '700', fontSize: 16 },
});

export default ResetPassword;