import React, {useMemo, useState} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {updatePasswordForCurrentUser} from '../services/authService';

const colors = {
  bg: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  muted: '#64748B',
  primary: '#0F172A',
  accent: '#EAB308',
  success: '#16A34A',
};

const RequirementRow = ({label, isMet}) => (
  <View style={styles.reqRow}>
    <View style={[styles.circle, isMet && styles.circleActive]}>
      {isMet && <Text style={styles.checkMark}>✓</Text>}
    </View>
    <Text style={[styles.reqText, isMet && styles.reqTextActive]}>{label}</Text>
  </View>
);

export default function ResetPassword({navigation}) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checks = useMemo(() => {
    const hasMinLength = newPassword.length >= 8;
    const hasNumber = /\d/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    return {hasMinLength, hasNumber, hasSpecial};
  }, [newPassword]);

  const strengthScore = useMemo(() => {
    return [checks.hasMinLength, checks.hasNumber, checks.hasSpecial].filter(Boolean)
      .length;
  }, [checks]);

  const strengthLabel = useMemo(() => {
    if (strengthScore <= 1) return 'Weak';
    if (strengthScore === 2) return 'Medium';
    return 'Strong';
  }, [strengthScore]);

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please complete all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (!checks.hasMinLength || !checks.hasNumber || !checks.hasSpecial) {
      Alert.alert('Weak Password', 'Please meet all password requirements.');
      return;
    }

    try {
      setIsSubmitting(true);
      await updatePasswordForCurrentUser({newPassword});

      Alert.alert('Success', 'Your password has been reset.', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
    } catch (error) {
      Alert.alert(
        'Reset Failed',
        error?.message ??
          'Could not update password. Verify your recovery code first and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrap}>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>ACCOUNT SECURITY</Text>
        </View>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Choose a strong and secure password for your account.</Text>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>New Password</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === 'new' && styles.inputWrapperFocused,
            ]}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              onFocus={() => setFocusedField('new')}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Text style={styles.passwordToggleText}>
                {showNewPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.fieldLabel, {marginTop: 18}]}>Confirm New Password</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === 'confirm' && styles.inputWrapperFocused,
            ]}>
            <TextInput
              style={styles.input}
              placeholder="Re-enter new password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedField('confirm')}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text style={styles.passwordToggleText}>
                {showConfirmPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.strengthRow}>
            <Text style={styles.strengthLabel}>Password Strength</Text>
            <Text
              style={[
                styles.strengthValue,
                strengthScore === 3 && styles.strengthStrong,
              ]}>
              {strengthLabel}
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(strengthScore / 3) * 100}%`,
                  backgroundColor: strengthScore === 3 ? colors.success : '#EAB308',
                },
              ]}
            />
          </View>

          <View style={styles.requirementsContainer}>
            <Text style={styles.reqHeader}>PASSWORD REQUIREMENTS</Text>
            <RequirementRow label="At least 8 characters" isMet={checks.hasMinLength} />
            <RequirementRow label="Contains a number" isMet={checks.hasNumber} />
            <RequirementRow label="Contains a special character" isMet={checks.hasSpecial} />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleUpdatePassword}
            disabled={isSubmitting}>
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  contentWrap: {paddingHorizontal: 20, paddingTop: 22, paddingBottom: 20},
  backArrow: {alignSelf: 'flex-start', marginBottom: 14},
  backText: {fontSize: 16, fontWeight: '700', color: colors.accent},
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 10,
  },
  badgeText: {color: '#92400E', fontSize: 11, fontWeight: '800', letterSpacing: 0.8},
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {fontSize: 15, color: colors.muted, marginBottom: 18, lineHeight: 21},
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
    elevation: 4,
  },
  fieldLabel: {fontWeight: '700', color: colors.text, marginBottom: 8, fontSize: 13},
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
  },
  inputWrapperFocused: {
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
  },
  input: {flex: 1, color: colors.text, fontSize: 15},
  passwordToggleText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 10,
  },
  strengthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  strengthLabel: {color: '#334155', fontSize: 12, fontWeight: '700'},
  strengthValue: {color: '#92400E', fontSize: 12, fontWeight: '800'},
  strengthStrong: {color: colors.success},
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  requirementsContainer: {marginTop: 6},
  reqHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 14,
  },
  reqRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {backgroundColor: '#DCFCE7', borderColor: '#22C55E'},
  checkMark: {color: '#22C55E', fontSize: 12, fontWeight: 'bold'},
  reqText: {color: '#64748B', fontSize: 14},
  reqTextActive: {color: '#0F172A', fontWeight: '600'},
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 18,
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {color: '#FFFFFF', textAlign: 'center', fontWeight: '800', fontSize: 16},
});

