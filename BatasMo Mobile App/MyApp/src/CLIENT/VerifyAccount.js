import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Or use your preferred icon library

const VerifyEmailScreen = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const inputRef = useRef(null);
  const CODE_LENGTH = 5;

  // Get email from route params if passed
  const email = route?.params?.email || 'client@email.com';
  const fullName = route?.params?.fullName || 'Client Name';

  // This handles the display for each box
  const renderInputs = () => {
    const inputs = [];
    for (let i = 0; i < CODE_LENGTH; i++) {
      const char = code[i];
      inputs.push(
        <View key={i} style={styles.otpBox}>
          {char ? (
            <Text style={styles.otpText}>{char}</Text>
          ) : (
            <View style={styles.dot} />
          )}
        </View>
      );
    }
    return inputs;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#556270" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Verify Your{"\n"}Email</Text>
        
        <Text style={styles.subtitle}>
          We've sent a 5-digit verification code to <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* OTP Input Container */}
        <TouchableOpacity 
          style={styles.otpContainer} 
          activeOpacity={1} 
          onPress={() => inputRef.current?.focus()}
        >
          {renderInputs()}
        </TouchableOpacity>

        {/* Hidden TextInput to handle logic */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))}
          keyboardType="number-pad"
          style={styles.hiddenInput}
          autoFocus={true}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.verifyButton}
          onPress={() => {
            if (code.length === CODE_LENGTH) {
              // Direct auto-login routing to Homepage, skipping intermediate/login steps
              navigation.navigate('HomepageClient', { fullName });
            }
          }}
        >
          <Text style={styles.verifyButtonText}>Verify & Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 40,
    borderRadius: 40,
    padding: 30,
    flex: 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'serif', // Use a serif font if loaded
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 40,
  },
  emailText: {
    color: '#1E293B',
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpBox: {
    width: 50,
    height: 60,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748B',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 100,
  },
  resendText: {
    color: '#64748B',
    fontSize: 14,
  },
  resendLink: {
    color: '#FACC15',
    fontWeight: '600',
    fontSize: 14,
  },
  verifyButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default VerifyEmailScreen;