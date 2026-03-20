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
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {
  getMyAppointments,
  updateAppointmentStatus,
} from '../services/appointmentService';

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

export default function AttyMyAppointments({navigation}) {
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

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      await loadAppointments();
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Unable to update appointment status.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>My Appointments</Text>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>Manage and track all your legal appointments</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.emptyCard}>
            <ActivityIndicator color="#0F172A" />
            <Text style={styles.emptyText}>Loading appointments...</Text>
          </View>
        ) : appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No appointment requests yet</Text>
            <Text style={styles.emptyText}>Client consultation requests will appear here.</Text>
          </View>
        ) : (
          appointments.map(item => {
            const status = (item.status ?? 'PENDING').toUpperCase();
            const {date, time} = formatDateTime(resolveScheduleValue(item));
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.name}>{item.client_name ?? 'Client'}</Text>
                    <Text style={styles.specialty}>{item.title ?? 'Consultation'}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{status}</Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>📅 {date}</Text>
                  <Text style={styles.metaText}>🕒 {time}</Text>
                </View>

                <Text style={styles.notesText}>📝 {item.notes || 'No notes provided'}</Text>

                {status === 'PENDING' && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleStatusUpdate(item.id, 'CANCELLED')}>
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleStatusUpdate(item.id, 'CONFIRMED')}>
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {status === 'CONFIRMED' && (
                  <View style={styles.confirmedActionRow}>
                    <TouchableOpacity
                      style={[styles.consultBtn, styles.consultBtnHalf]}
                      onPress={() =>
                        navigation.navigate('AttyConsultationMessage', {
                          chatId: item.id,
                          clientName: item.client_name ?? 'Client',
                          clientInitials: (item.client_name ?? 'Client')
                            .split(' ')
                            .map(part => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase(),
                        })
                      }>
                      <Text style={styles.consultBtnText}>Enter Consultation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rescheduleBtn}
                      onPress={() =>
                        navigation.navigate('RescheduleAppointment', {
                          appointment: {
                            id: item.id,
                            name: item.client_name ?? 'Client',
                            date,
                            time,
                          },
                          returnRoute: 'AttyMyAppointments',
                        })
                      }>
                      <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {(status === 'COMPLETED' || status === 'RESCHEDULED') && (
                  <TouchableOpacity
                    style={styles.consultBtn}
                    onPress={() =>
                      navigation.navigate('AttyConsultationMessage', {
                        chatId: item.id,
                        clientName: item.client_name ?? 'Client',
                        clientInitials: (item.client_name ?? 'Client')
                          .split(' ')
                          .map(part => part[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase(),
                      })
                    }>
                    <Text style={styles.consultBtnText}>View Messages</Text>
                  </TouchableOpacity>
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
  container: {flex: 1, backgroundColor: '#F9FAFB'},
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  navTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  subHeader: {paddingHorizontal: 20, marginTop: 8, marginBottom: 20},
  subTitle: {color: '#6B7280', fontSize: 14},
  scrollContent: {paddingHorizontal: 20, paddingBottom: 30},
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {fontSize: 18, fontWeight: 'bold', color: '#1F2937'},
  specialty: {fontSize: 14, color: '#6B7280', marginTop: 2},
  statusBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {color: '#FFF', fontSize: 10, fontWeight: '700'},
  metaRow: {flexDirection: 'row', gap: 18, marginBottom: 10},
  metaText: {color: '#374151', fontSize: 13},
  notesText: {color: '#475569', fontSize: 13},
  actionRow: {flexDirection: 'row', gap: 10, marginTop: 14},
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButton: {backgroundColor: '#FEE2E2'},
  approveButton: {backgroundColor: '#DCFCE7'},
  rejectButtonText: {color: '#B91C1C', fontWeight: '700'},
  approveButtonText: {color: '#166534', fontWeight: '700'},
  consultBtn: {
    marginTop: 14,
    backgroundColor: '#0F172A',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmedActionRow: {flexDirection: 'row', gap: 10, marginTop: 14},
  consultBtnHalf: {flex: 1, marginTop: 0},
  consultBtnText: {color: '#FFF', fontWeight: '700'},
  rescheduleBtn: {
    flex: 1,
    backgroundColor: '#EAB308',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rescheduleBtnText: {color: '#1E293B', fontWeight: '700'},
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
