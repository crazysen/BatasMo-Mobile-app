import React, {useState, useRef} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  startPasswordRecovery,
  verifyRecoveryOtp,
} from '../services/authService';

const colors = {
  bg: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  muted: '#64748B',
  primary: '#0F172A',
  accent: '#EAB308',
};

export default function VerifyIdentity({navigation, route}) {
  const [email, setEmail] = useState(route?.params?.email ?? '');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [hasRequestedCode, setHasRequestedCode] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  const isValidEmail = value => value.includes('@') && value.includes('.');

  const requestRecoveryCode = async () => {
    if (!email) {
      Alert.alert('Missing Email', 'Please enter your email first.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      setIsSending(true);
      await startPasswordRecovery({email: email.trim()});
      setCode(['', '', '', '', '', '']);
      setHasRequestedCode(true);
      Alert.alert(
        'Code Sent',
        'If your account exists, we sent a 6-digit recovery code to your email.',
      );
    } catch (error) {
      Alert.alert('Send Failed', error?.message ?? 'Could not send recovery code.');
    } finally {
      setIsSending(false);
    }
  };

  const focusFirstEmptyInput = () => {
    const firstEmptyIndex = code.findIndex(char => !char);
    const targetIndex = firstEmptyIndex === -1 ? 5 : firstEmptyIndex;
    inputRefs.current[targetIndex]?.focus();
  };

  const handleCodeChange = (value, index) => {
    const digits = value.replace(/[^0-9]/g, '');

    // Allow pasting the full code into any box.
    if (digits.length > 1) {
      const next = [...code];
      for (let i = index; i < 6; i += 1) {
        next[i] = digits[i - index] || '';
      }
      setCode(next);

      const nextFocusIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextFocusIndex]?.focus();
      return;
    }

    const next = [...code];
    next[index] = digits;
    setCode(next);

    if (digits && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace - go to previous input if current is empty
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!email || !isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (code.join('').length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the full 6-digit code.');
      return;
    }

    try {
      setIsVerifying(true);
      await verifyRecoveryOtp({
        email: email.trim(),
        token: code.join(''),
      });

      // Use stack reset so recovery flow cannot be overridden by any prior route state.
      navigation.reset({
        index: 0,
        routes: [{name: 'ResetPassword', params: {email: email.trim()}}],
      });
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        error?.message ?? 'Invalid or expired recovery code.',
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrap}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>SECURE VERIFICATION</Text>
        </View>

        <Text style={styles.title}>Verify Identity</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your email. After verification, you will go to Reset Password.
        </Text>

        <View style={styles.card}>
          {!hasRequestedCode && (
            <>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.emailInput}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="name@domain.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={value => {
                  setEmail(value);
                  if (hasRequestedCode) {
                    setHasRequestedCode(false);
                    setCode(['', '', '', '', '', '']);
                  }
                }}
              />

              <TouchableOpacity
                style={[styles.sendButton, isSending && styles.buttonDisabled]}
                onPress={requestRecoveryCode}
                disabled={isSending}>
                <Text style={styles.sendButtonText}>
                  {isSending ? 'Sending...' : 'Send 6-Digit Code'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {hasRequestedCode && (
            <>
              <Text style={styles.codeSentText}>Code sent to {email.trim()}.</Text>
              <Text style={styles.label}>SECURE CODE</Text>

              <TouchableOpacity
                style={styles.otpTouchZone}
                activeOpacity={1}
                onPress={focusFirstEmptyInput}>
                <View style={styles.otpRow}>
                  {[0, 1, 2, 3, 4, 5].map(index => (
                    <TextInput
                      key={index}
                      ref={ref => (inputRefs.current[index] = ref)}
                      style={[
                        styles.otpInput,
                        focusedIndex === index && styles.otpInputFocused,
                      ]}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={code[index]}
                      onChangeText={value => handleCodeChange(value, index)}
                      onKeyPress={e => handleKeyPress(e, index)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                      autoComplete="one-time-code"
                      textContentType="oneTimeCode"
                      selectTextOnFocus
                    />
                  ))}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendContainer}
                onPress={requestRecoveryCode}
                disabled={isSending}>
                <Text style={styles.resendText}>
                  Didn't receive the code?{' '}
                  <Text style={styles.resendLink}>
                    {isSending ? 'Sending...' : 'Resend Code'}
                  </Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, isVerifying && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={isVerifying}>
                <Text style={styles.buttonText}>
                  {isVerifying ? 'Verifying...' : 'Verify & Proceed'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  contentWrap: {paddingHorizontal: 20, paddingTop: 22},
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 4,
  },
  backButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
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
  badgeText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 21,
    marginBottom: 20,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
    elevation: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  codeSentText: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 12,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpTouchZone: {
    width: '100%',
  },
  otpInput: {
    width: 46,
    height: 60,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    backgroundColor: '#FFFFFF',
  },
  otpInputFocused: {
    borderColor: '#94A3B8',
    backgroundColor: '#F8FAFC',
  },
  emailInput: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 18,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  resendContainer: {
    marginTop: 18,
    marginBottom: 18,
    alignItems: 'center',
  },
  resendText: {color: colors.muted, fontSize: 13},
  resendLink: {color: '#D97706', fontWeight: '700'},
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.4,
  },
});

