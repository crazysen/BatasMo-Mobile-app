import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  formatAppointmentNotesForDisplay,
  getMyAppointments,
} from '../services/appointmentService';
import {REFERENCE_THEME as T} from '../constants/referenceTheme';
import {ClientScreenShell, ClientFadeIn} from '../components/ClientScreenShell';
import ClientChevronBack from '../components/ClientChevronBack';

function resolveScheduleValue(item) {
  return (
    item?.scheduled_at ||
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
  const hasTimezoneInfo = /([zZ]|[+-]\d{2}:?\d{2})$/.test(rawValue);

  let value;
  if (hasTimezoneInfo) {
    const normalizedValue = rawValue
      .replace(' ', 'T')
      .replace(/\+00$/, 'Z');
    value = new Date(normalizedValue);
  } else {
    const localMatch = rawValue.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
    if (localMatch) {
      value = new Date(
        Number(localMatch[1]),
        Number(localMatch[2]) - 1,
        Number(localMatch[3]),
        Number(localMatch[4]),
        Number(localMatch[5])
      );
    } else {
      value = new Date(rawValue);
    }
  }

  if (!value || Number.isNaN(value.getTime())) {
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

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments]),
  );

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('HomepageClient');
  };

  return (
    <ClientScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <ClientFadeIn>
        <ClientChevronBack style={styles.backHit} onPress={handleBack} />

        <Text style={styles.screenTitle}>My Appointments</Text>
        <Text style={styles.screenSubtitle}>Manage and track all your appointments</Text>
        </ClientFadeIn>

        {loading ? (
          <View style={styles.emptyCard}>
            <ActivityIndicator color={T.gold[1]} />
            <Text style={styles.emptyText}>Loading appointments...</Text>
          </View>
        ) : appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No appointments yet</Text>
            <Text style={styles.emptyText}>Your bookings will appear here once submitted.</Text>
          </View>
        ) : (
          appointments.map((item, index) => {
            const status = (item.status ?? 'PENDING').toUpperCase();
            const {date, time} = formatDateTime(resolveScheduleValue(item));
            const canChat =
              status === 'CONFIRMED' ||
              status === 'COMPLETED' ||
              status === 'RESCHEDULED';
            return (
              <ClientFadeIn key={item.id} delay={60 + index * 55}>
              <View style={styles.card}>
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
                <Text style={styles.detailText}>
                  📝{' '}
                  {formatAppointmentNotesForDisplay(item.notes) || 'No additional notes'}
                </Text>

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
              </ClientFadeIn>
            );
          })
        )}
      </ScrollView>
    </ClientScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {padding: 20, paddingBottom: 32},
  backHit: {alignSelf: 'flex-start', marginBottom: 10},
  screenTitle: {fontSize: 28, fontWeight: 'bold', color: T.text},
  screenSubtitle: {color: T.textSoft, marginBottom: 16},
  card: {
    backgroundColor: 'rgba(18, 26, 36, 0.85)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
  },
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10},
  lawyerName: {fontSize: 18, fontWeight: '700', color: T.text},
  specialty: {fontSize: 13, color: T.textSoft},
  badgeRow: {flexDirection: 'row'},
  badgeDark: {
    backgroundColor: 'rgba(244, 215, 139, 0.18)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.25)',
  },
  badgeDarkText: {color: T.gold[0], fontSize: 10, fontWeight: '700'},
  detailText: {color: T.textMuted, marginBottom: 4},
  primaryButton: {
    marginTop: 12,
    backgroundColor: T.gold[1],
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {color: T.base, fontWeight: '700'},
  pendingState: {
    marginTop: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)',
  },
  pendingStateText: {color: T.gold[0], fontWeight: '700'},
  emptyCard: {
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
    borderRadius: 20,
    backgroundColor: 'rgba(18, 26, 36, 0.62)',
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {fontSize: 16, fontWeight: '700', color: T.text, marginBottom: 6},
  emptyText: {fontSize: 13, color: T.textSoft, textAlign: 'center'},
});
