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
import {getMyAppointments, updateAppointmentStatus} from '../services/appointmentService';

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

export default function AttyConsultationRequest({navigation}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await getMyAppointments();
      setAppointments(Array.isArray(rows) ? rows : []);
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Failed to load consultation requests.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const pendingRows = useMemo(
    () => appointments.filter(item => (item.status ?? '').toLowerCase() === 'pending'),
    [appointments],
  );
  const confirmedRows = useMemo(
    () => appointments.filter(item => (item.status ?? '').toLowerCase() === 'confirmed'),
    [appointments],
  );

  const displayedRows = tab === 'pending' ? pendingRows : confirmedRows;

  const handleUpdate = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      await loadAppointments();
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Unable to update request.');
    }
  };

  const renderRow = ({item}) => {
    const status = (item.status ?? 'pending').toUpperCase();
    const {date, time} = formatDateTime(resolveScheduleValue(item));

    return (
      <View style={styles.card}>
        <View style={styles.rowTop}>
          <View>
            <Text style={styles.clientName}>{item.client_name ?? 'Client'}</Text>
            <Text style={styles.caseTitle}>{item.title ?? 'Consultation'}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <Text style={styles.metaText}>📅 {date}</Text>
        <Text style={styles.metaText}>🕒 {time}</Text>
        <Text style={styles.metaText}>📝 {item.notes || 'No details provided'}</Text>

          <TouchableOpacity
            style={styles.chatButton}
            onPress={() =>
              navigation.navigate('AttyConsultationMessage', {
                chatId: item.id,
                clientName: item.client_name ?? 'Client',
                clientInitials: (item.client_name ?? 'Client')
                  .split(' ')
                  .filter(Boolean)
                  .map(part => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase(),
              })
            }>
            <Text style={styles.chatButtonText}>Open Chat</Text>
          </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Consultation Requests</Text>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'pending' && styles.activeTab]}
          onPress={() => setTab('pending')}>
          <Text style={[styles.tabText, tab === 'pending' && styles.activeTabText]}>
            Pending ({pendingRows.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'confirmed' && styles.activeTab]}
          onPress={() => setTab('confirmed')}>
          <Text style={[styles.tabText, tab === 'confirmed' && styles.activeTabText]}>
            Approved ({confirmedRows.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator color="#0F172A" />
          <Text style={styles.emptyText}>Loading requests...</Text>
        </View>
      ) : displayedRows.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {tab === 'pending' ? 'No pending consultation requests.' : 'No approved consultations yet.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayedRows}
          keyExtractor={item => item.id}
          renderItem={renderRow}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 14,
  },
  backText: {fontSize: 30, color: '#111827', marginRight: 8},
  title: {fontSize: 24, fontWeight: '800', color: '#111827'},
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 8,
  },
  tab: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  activeTab: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  tabText: {fontSize: 13, color: '#334155', fontWeight: '600'},
  activeTabText: {color: '#FFFFFF'},
  listContent: {paddingHorizontal: 16, paddingBottom: 24},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  rowTop: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8},
  clientName: {fontSize: 16, fontWeight: '700', color: '#0F172A'},
  caseTitle: {fontSize: 13, color: '#64748B'},
  statusBadge: {
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {fontSize: 10, fontWeight: '700', color: '#1E293B'},
  metaText: {fontSize: 13, color: '#475569', marginBottom: 4},
  actionRow: {flexDirection: 'row', marginTop: 10, gap: 8},
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rejectButton: {backgroundColor: '#FEE2E2'},
  approveButton: {backgroundColor: '#DCFCE7'},
  rejectText: {color: '#B91C1C', fontWeight: '700'},
  approveText: {color: '#166534', fontWeight: '700'},
  chatButton: {
    marginTop: 10,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  chatButtonText: {color: '#FFFFFF', fontWeight: '700'},
  chatButtonSecondary: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  chatButtonSecondaryText: {color: '#0F172A', fontWeight: '700'},
  emptyState: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  emptyText: {marginTop: 8, color: '#64748B'},
});
