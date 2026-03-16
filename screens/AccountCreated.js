import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const navy = '#0F1E36';
const blueGray = '#7B8BA3';

export default function AccountCreated({navigation, route}) {
  const role = route?.params?.role || 'Client';
  const isAttorney = role === 'Attorney';

  const goToHomepage = () => {
    navigation.reset({
      index: 0,
      routes: [{name: isAttorney ? 'AttyLandingPage' : 'HomepageClient'}],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.content}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>

        <Text style={styles.title}>Account Created</Text>
        <Text style={styles.subtitle}>
          Your account is ready. You can now continue to your dashboard.
        </Text>

        <TouchableOpacity style={styles.button} onPress={goToHomepage}>
          <Text style={styles.buttonText}>Continue to Dashboard</Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
    elevation: 3,
  },
  content: {
    alignItems: 'center',
  },
  successCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successIcon: {
    color: '#16A34A',
    fontSize: 56,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    color: navy,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: blueGray,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    backgroundColor: navy,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
