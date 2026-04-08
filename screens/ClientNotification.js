import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  formatScheduledAtDisplay,
  getLatestRescheduleReason,
  getMyAppointments,
} from '../services/appointmentService';
import {getNotarialRequests} from '../services/notarialService';
import {supabase} from '../services/supabaseClient';

function getRelativeTime(value) {
  const now = Date.now();
  const parsed = String(value || '').trim().replace(' ', 'T').replace(/\+00$/, 'Z');
  const target = new Date(parsed).getTime();
  if (Number.isNaN(target)) {
    return 'JUST NOW';
  }

  const diffMins = Math.max(1, Math.floor((now - target) / 60000));
  if (diffMins < 60) {
    return `${diffMins}M AGO`;
  }
  if (diffMins < 1440) {
    return `${Math.floor(diffMins / 60)}H AGO`;
  }
  return `${Math.floor(diffMins / 1440)}D AGO`;
}

function getSortTimestamp(value) {
  const parsed = String(value || '').trim().replace(' ', 'T').replace(/\+00$/, 'Z');
  const ts = new Date(parsed).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

export default function ClientNotification({navigation}) {
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [appointmentRows, requestRows] = await Promise.all([
        getMyAppointments({force: true}),
        getNotarialRequests(),
      ]);
      setAppointments(Array.isArray(appointmentRows) ? appointmentRows : []);
      setRequests(Array.isArray(requestRows) ? requestRows : []);
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Failed to load notifications.');
      setAppointments([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let cancelled = false;
    let channel = null;

    (async () => {
      const {
        data: {session},
      } = await supabase.auth.getSession();
      if (cancelled || !session?.user?.id) {
        return;
      }
      const userId = session.user.id;
      const ch = supabase
        .channel(`client-appointments-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'appointments',
            filter: `client_id=eq.${userId}`,
          },
          payload => {
            loadData();
            const st = String(payload.new?.status ?? '').toLowerCase();
            if (st === 'rescheduled') {
              const {date, time} = formatScheduledAtDisplay(
                payload.new?.scheduled_at,
              );
              const reason = getLatestRescheduleReason(payload.new?.notes ?? '');
              Alert.alert(
                'Appointment rescheduled',
                reason
                  ? `New time: ${date} at ${time}.\n\nReason: ${reason}`
                  : `New time: ${date} at ${time}.\n\nOpen My Appointments for details.`,
              );
            }
          },
        )
        .subscribe();
      if (cancelled) {
        supabase.removeChannel(ch);
        return;
      }
      channel = ch;
    })();

    return () => {
      cancelled = true;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadData]);

  const notifications = useMemo(() => {
    const appointmentItems = appointments.map(item => {
      const status = (item.status ?? 'pending').toLowerCase();
      const approved = status === 'confirmed';
      const completed = status === 'completed';
      const rescheduled = status === 'rescheduled';
      const eventAt = item.updated_at || item.created_at;

      return {
        id: `appointment-${item.id}`,
        sourceType: 'appointment',
        sourceId: item.id,
        icon: approved ? '📅' : completed ? '✅' : rescheduled ? '🗓️' : '⏳',
        iconBg: approved ? '#FEF3C7' : completed ? '#DCFCE7' : rescheduled ? '#DBEAFE' : '#E2E8F0',
        title: approved
          ? 'Appointment Approved'
          : completed
            ? 'Appointment Completed'
            : rescheduled
              ? 'Appointment Rescheduled'
            : 'Appointment Update',
        time: getRelativeTime(eventAt),
        timestamp: getSortTimestamp(eventAt),
        description: approved
          ? `${item.attorney_name ?? 'Your attorney'} approved your request for ${item.title ?? 'consultation'}.`
          : completed
            ? `${item.title ?? 'Consultation'} has been marked completed.`
            : rescheduled
              ? (() => {
                  const {date, time} = formatScheduledAtDisplay(item.scheduled_at);
                  const reason = getLatestRescheduleReason(item.notes);
                  const line = `${item.title ?? 'Consultation'} is now on ${date} at ${time}.`;
                  return reason ? `${line}\n\nReason: ${reason}` : `${line} Open My Appointments for full notes.`;
                })()
            : `${item.title ?? 'Consultation'} is currently ${status}.`,
        action: approved || rescheduled || completed ? 'OPEN CHAT' : null,
        amount: item.amount,
        chatName: item.attorney_name ?? 'Attorney',
      };
    });

    const notarialItems = requests.map(item => {
      const status = (item.status ?? 'pending').toLowerCase();
      const accepted = status === 'accepted';
      const completed = status === 'completed';
      const eventAt = item.updated_at || item.created_at;

      return {
        id: `notarial-${item.id}`,
        sourceType: 'notarial',
        sourceId: item.id,
        icon: accepted ? '📄' : completed ? '✅' : '⏳',
        iconBg: accepted ? '#DBEAFE' : completed ? '#DCFCE7' : '#E2E8F0',
        title: accepted
          ? 'Notarial Request Paid'
          : completed
            ? 'Notarial Request Completed'
            : 'Notarial Request Pending',
        time: getRelativeTime(eventAt),
        timestamp: getSortTimestamp(eventAt),
        description: accepted
          ? `Your ${item.service_type} payment was successful and is being processed.`
          : completed
            ? `${item.service_type} notarization is completed.`
            : `You have an unpaid ${item.service_type} request.`,
        action: status === 'pending' ? 'PAY NOW' : null,
        amount: 4000,
      };
    });

    return [...appointmentItems, ...notarialItems].sort((a, b) => b.timestamp - a.timestamp);
  }, [appointments, requests]);

  const handleAction = item => {
    if (item.action === 'PAY NOW') {
      navigation.navigate('PaymentMethod', {
        serviceData: {
          type: 'Legal Service',
          amount: item.amount ? `₱${Number(item.amount).toLocaleString()}` : '₱2,500',
        },
        paymentContext: {
          sourceType: item.sourceType,
          sourceId: item.sourceId,
        },
      });
      return;
    }

    if (item.action === 'OPEN CHAT') {
      navigation.navigate('EnterConsultationChat', {
        chatId: item.sourceId,
        chatName: item.chatName || 'Attorney',
        initials: String(item.chatName || 'AT')
          .split(' ')
          .filter(Boolean)
          .map(part => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>Notifications</Text>
        <Text style={styles.subtitle}>Stay updated on your legal proceedings.</Text>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color="#0F172A" />
          <Text style={styles.centerStateText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={styles.centerStateText}>No notifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={[styles.iconContainer, {backgroundColor: item.iconBg}]}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>

                <Text style={styles.descriptionText}>{item.description}</Text>

                {item.action ? (
                  <TouchableOpacity onPress={() => handleAction(item)}>
                    <Text style={styles.actionText}>{item.action} ›</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  backText: {color: '#EAB308', fontSize: 16, fontWeight: '700'},
  headerSection: {paddingHorizontal: 24, paddingTop: 8, paddingBottom: 18},
  mainTitle: {fontSize: 32, fontWeight: '800', color: '#0F172A', marginBottom: 6},
  subtitle: {fontSize: 15, color: '#64748B'},
  listPadding: {paddingHorizontal: 16, paddingBottom: 24},
  centerState: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20},
  centerStateText: {marginTop: 8, color: '#64748B'},
  card: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: 'row',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {fontSize: 22},
  cardContent: {flex: 1},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
  },
  timeText: {fontSize: 11, color: '#94A3B8', fontWeight: '600'},
  descriptionText: {fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 8},
  actionText: {fontSize: 14, fontWeight: '800', color: '#EAB308'},
});
