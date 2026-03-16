import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useUserProfile} from '../context/UserProfileContext';
import {signInWithEmail} from '../services/authService';

const colors = {
  navy: '#0F1E36',
  blueGray: '#64748B',
  lightGray: '#F1F5F9',
  border: '#E2E8F0',
  gold: '#EAB308',
  white: '#FFFFFF',
  bg: '#F8FAFC',
  text: '#0F172A',
};

export default function Login({navigation}) {
  const {updateProfile} = useUserProfile();
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email) return Alert.alert('Error', 'Email is required');
    if (!email.includes('@') || !email.includes('.')) {
      return Alert.alert('Error', 'Enter valid email');
    }
    if (!password) return Alert.alert('Error', 'Password is required');

    try {
      setIsSubmitting(true);

      const data = await signInWithEmail({
        email: email.trim(),
        password,
      });

      const user = data?.user;
      const roleFromMetadata = user?.user_metadata?.role;
      const fullNameFromMetadata = user?.user_metadata?.full_name;
      const normalizedRole =
        roleFromMetadata === 'Attorney' || roleFromMetadata === 'Client'
          ? roleFromMetadata
          : isClient
            ? 'Client'
            : 'Attorney';

      updateProfile({
        email: user?.email ?? email.trim(),
        name: fullNameFromMetadata ?? 'BatasMo User',
        role: normalizedRole,
      });

      if (normalizedRole === 'Client') {
        navigation.navigate('HomepageClient');
      } else {
        navigation.navigate('AttyLandingPage');
      }
    } catch (error) {
      const message = error?.message ?? 'Unable to sign in.';
      const normalized = message.toLowerCase();

      if (normalized.includes('email not confirmed')) {
        Alert.alert(
          'Email Not Verified',
          'Please verify your account using the code sent to your email.',
        );
        navigation.navigate('VerifyAccount', {
          email: email.trim(),
          role: isClient ? 'Client' : 'Attorney',
        });
        return;
      }

      Alert.alert('Login Failed', error?.message ?? 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>BATASMO SECURE PORTAL</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Access your secure legal portal.</Text>
        </View>

        <View style={styles.formContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleOption, isClient && styles.activeToggle]}
              onPress={() => setIsClient(true)}>
              <Text style={[styles.toggleText, isClient && styles.activeText]}>
                CLIENT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleOption, !isClient && styles.activeToggle]}
              onPress={() => setIsClient(false)}>
              <Text style={[styles.toggleText, !isClient && styles.activeText]}>
                ATTORNEY
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Email Address</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === 'email' && styles.inputContainerFocused,
            ]}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              style={styles.input}
              placeholder="name@domain.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <Text style={styles.label}>Secure Password</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === 'password' && styles.inputContainerFocused,
            ]}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.passwordToggleText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('VerifyIdentity', {email: email.trim()})
              }>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}>
            <Text style={styles.loginButtonText}>
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.signUpText}>
            Don't have an account?{' '}
            <Text
              style={styles.signUpLink}
              onPress={() => navigation.navigate('CreateProfile')}>
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  heroSection: {
    marginBottom: 18,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  heroBadgeText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 12},
    elevation: 5,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 18,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.blueGray,
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightGray,
    borderRadius: 14,
    marginBottom: 24,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleText: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.blueGray,
    letterSpacing: 0.6,
  },
  activeToggle: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  activeText: {
    color: colors.navy,
  },
  label: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.text,
    marginBottom: 8,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  inputContainerFocused: {
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  passwordToggleText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 2,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  rememberMeText: {
    fontSize: 13,
    color: colors.blueGray,
    fontWeight: '600',
  },
  forgotPasswordText: {
    fontSize: 13,
    color: colors.gold,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: colors.navy,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.navy,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.6,
  },
  signUpText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.blueGray,
    marginBottom: 2,
  },
  signUpLink: {
    color: colors.gold,
    fontWeight: '800',
  },
});
