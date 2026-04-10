import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

export default function LandingPage({navigation}) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>⚖️</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>BatasMo</Text>
          <Text style={styles.subtitle}>Your Legal Services, Simplified.</Text>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('CreateProfile')}
          >
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  background: {
    width,
    height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 18, 66, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  logoIcon: {
    fontSize: 40,
    color: '#EAB308',
  },
  title: {
    fontSize: 52,
    fontWeight: '700',
    fontStyle: 'italic',
    color: 'white',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '400',
    letterSpacing: 0.2,
    marginBottom: 48,
  },
  registerButton: {
    width: 280,
    backgroundColor: '#EAB308',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  registerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
  loginButton: {
    width: 280,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.3,
  },
});