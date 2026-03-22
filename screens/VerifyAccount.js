import React, {useRef, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {resendSignUpOtp, verifySignUpOtp} from '../services/authService';

const navy = '#0F1E36';
const blueGray = '#7B8BA3';
const lightGray = '#F3F4F6';
const orange = '#EAB308';

export default function VerifyAccount({navigation, route}) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const inputRefs = useRef([]);
  const codeLength = 6;
  const email = route?.params?.email || 'your email';
  const role = route?.params?.role || 'Client';

  const handleCodeChange = (value, index) => {
    const digit = value.replace(/[^0-9]/g, '');
    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = code.join('');

    if (token.length !== codeLength) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code.');
      return;
    }

    try {
      setIsVerifying(true);
      await verifySignUpOtp({
        email,
        token,
      });

      navigation.navigate('HomepageClient');
    } catch (error) {
      Alert.alert('Verification Failed', error?.message ?? 'Invalid or expired code.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await resendSignUpOtp({email});
      Alert.alert('Code Sent', 'A new verification code has been sent.');
    } catch (error) {
      Alert.alert('Resend Failed', error?.message ?? 'Could not resend code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Verify Your Account</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to <Text style={styles.emailText}>{email}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {Array.from({length: codeLength}).map((_, index) => (
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
              autoFocus={index === 0}
              selectTextOnFocus
            />
          ))}
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={isResending}>
            <Text style={styles.resendLink}>
              {isResending ? 'Resending...' : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={isVerifying}>
          <Text style={styles.verifyButtonText}>
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    marginBottom: 12,
  },
  backButtonText: {
    color: orange,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
    elevation: 3,
  },
  title: {
    fontSize: 29,
    fontWeight: '700',
    color: navy,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: blueGray,
    lineHeight: 22,
    marginBottom: 26,
  },
  emailText: {
    color: navy,
    fontWeight: '700',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 46,
    height: 60,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: navy,
    backgroundColor: lightGray,
  },
  otpInputFocused: {
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resendText: {
    color: blueGray,
    fontSize: 14,
  },
  resendLink: {
    color: orange,
    fontSize: 14,
    fontWeight: '700',
  },
  verifyButton: {
    backgroundColor: navy,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
