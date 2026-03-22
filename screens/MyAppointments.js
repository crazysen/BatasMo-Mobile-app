import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getMyAppointments} from '../services/appointmentService';

function resolveScheduleValue(item) {
  return (
    item?.scheduled_at ||
    item?.preferred_date ||
    item?.updated_at ||
    item?.created_at ||
    null
  );
}

function formatDateTime(isoDateTime) {
  if (!isoDateTime) {
    return {date: 'No schedule', time: '--:--'};
  }

  const rawValue = String(isoDateTime).trim();
  const normalizedValue = rawValue
    .replace(' ', 'T')
    .replace(/\+00$/, 'Z');

  let value = new Date(normalizedValue);
  if (Number.isNaN(value.getTime())) {
    const localMatch = rawValue.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::\d{2})?/);
    if (localMatch) {
      value = new Date(`${localMatch[1]}T${localMatch[2]}:00`);
    }
  }

  if (Number.isNaN(value.getTime())) {
    return {date: 'No schedule', time: '--:--'};
  }

  return {
    date: value.toLocaleDateString(),
    time: value.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
  };
}

export default function MyAppointments({navigation}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const records = await getMyAppointments();
      setAppointments(Array.isArray(records) ? records : []);
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Failed to load appointments.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.canGoBack() ? navigation.goBack() : null;
      return;
    }
    navigation.navigate('HomepageClient');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.screenTitle}>My Appointments</Text>
        <Text style={styles.screenSubtitle}>Manage and track all your appointments</Text>

        {loading ? (
          <View style={styles.emptyCard}>
            <ActivityIndicator color="#0F172A" />
            <Text style={styles.emptyText}>Loading appointments...</Text>
          </View>
        ) : appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No appointments yet</Text>
            <Text style={styles.emptyText}>Your bookings will appear here once submitted.</Text>
          </View>
        ) : (
          appointments.map(item => {
            const status = (item.status ?? 'PENDING').toUpperCase();
            const {date, time} = formatDateTime(resolveScheduleValue(item));
            const canChat =
              status === 'CONFIRMED' ||
              status === 'COMPLETED' ||
              status === 'RESCHEDULED';
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.lawyerName}>{item.attorney_name ?? 'Attorney not assigned'}</Text>
                    <Text style={styles.specialty}>{item.title ?? 'Consultation'}</Text>
                  </View>
                  <View style={styles.badgeRow}>
                    <View style={styles.badgeDark}>
                      <Text style={styles.badgeDarkText}>{status}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.detailText}>📅 {date}</Text>
                <Text style={styles.detailText}>🕒 {time}</Text>
                <Text style={styles.detailText}>📝 {item.notes || 'No additional notes'}</Text>

                {canChat ? (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() =>
                      navigation.navigate('EnterConsultationChat', {
                        chatId: item.id,
                        chatName: item.attorney_name ?? 'Attorney',
                        initials: (item.attorney_name ?? 'Attorney')
                          .split(' ')
                          .map(part => part[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase(),
                      })
                    }>
                    <Text style={styles.primaryButtonText}>Message Attorney</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.pendingState}>
                    <Text style={styles.pendingStateText}>
                      {status === 'CANCELLED'
                        ? 'Appointment cancelled'
                        : 'Awaiting attorney approval'}
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  content: {padding: 20, paddingBottom: 32},
  backButton: {alignSelf: 'flex-start', marginBottom: 10},
  backText: {color: '#EAB308', fontWeight: '700', fontSize: 16},
  screenTitle: {fontSize: 28, fontWeight: 'bold', color: '#0F172A'},
  screenSubtitle: {color: '#64748B', marginBottom: 16},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10},
  lawyerName: {fontSize: 18, fontWeight: '700', color: '#0F172A'},
  specialty: {fontSize: 13, color: '#64748B'},
  badgeRow: {flexDirection: 'row'},
  badgeDark: {backgroundColor: '#1E293B', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 6},
  badgeDarkText: {color: '#FFFFFF', fontSize: 10, fontWeight: '700'},
  detailText: {color: '#475569', marginBottom: 4},
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {color: '#FFFFFF', fontWeight: '700'},
  pendingState: {
    marginTop: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pendingStateText: {color: '#92400E', fontWeight: '700'},
  emptyCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 6},
  emptyText: {fontSize: 13, color: '#64748B', textAlign: 'center'},
});
