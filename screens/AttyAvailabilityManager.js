import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {
  getAttorneyAvailabilitySlots,
  getAttorneyCompletedConsultationSlotKeys,
  HOURLY_CONSULTATION_SLOT_LABELS,
  setAvailability,
} from '../services/appointmentService';
import {supabase} from '../services/supabaseClient';

const ChevronLeft = props => <MaterialCommunityIcons name="chevron-left" {...props} />;
const ChevronRight = props => <MaterialCommunityIcons name="chevron-right" {...props} />;

const ALL_SLOTS = HOURLY_CONSULTATION_SLOT_LABELS;

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function slotKey(dateStr, time) {
  return `${dateStr}|${time}`;
}

export default function AvailabilityManager({navigation}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /** Unbooked slots (attorney-editable) */
  const [openSlotKeys, setOpenSlotKeys] = useState(new Set());
  /** Client-booked slots (read-only) */
  const [bookedSlotKeys, setBookedSlotKeys] = useState(new Set());
  /** Past completed consultations (read-only label) */
  const [completedSlotKeys, setCompletedSlotKeys] = useState(new Set());

  const [activeSlots, setActiveSlots] = useState([]);

  useEffect(() => {
    const today = new Date();
    const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDateStr(formatted);
  }, []);

  const fetchGlobalSlots = useCallback(async () => {
    const {data: {user}} = await supabase.auth.getUser();
    const attorneyId = user?.id;
    if (!attorneyId) {
      return;
    }
    try {
      setLoading(true);
      const rows = await getAttorneyAvailabilitySlots(attorneyId);
      let completedKeys = [];
      try {
        completedKeys = await getAttorneyCompletedConsultationSlotKeys(attorneyId);
      } catch {
        completedKeys = [];
      }
      const open = new Set();
      const booked = new Set();
      rows.forEach(s => {
        const key = slotKey(s.date, s.time);
        if (s.is_booked) {
          booked.add(key);
        } else {
          open.add(key);
        }
      });
      const completedSet = new Set(completedKeys);
      const bookedUi = new Set([...booked].filter(k => !completedSet.has(k)));
      setOpenSlotKeys(open);
      setBookedSlotKeys(bookedUi);
      setCompletedSlotKeys(completedSet);
    } catch (e) {
      Alert.alert('Error', 'Failed to load availability.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchGlobalSlots();
    }, [fetchGlobalSlots]),
  );

  useEffect(() => {
    if (!selectedDateStr) {
      return;
    }
    const daily = [];
    ALL_SLOTS.forEach(time => {
      if (openSlotKeys.has(slotKey(selectedDateStr, time))) {
        daily.push(time);
      }
    });
    setActiveSlots(daily);
  }, [selectedDateStr, openSlotKeys]);

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const previousMonthDays = new Date(year, month, 0).getDate();

    const calendarArray = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      calendarArray.push({
        num: previousMonthDays - i,
        isCurrentMonth: false,
        dateStr: '',
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      let hasOpen = false;
      let hasBooked = false;
      let hasCompleted = false;
      for (let j = 0; j < ALL_SLOTS.length; j++) {
        const k = slotKey(dateStr, ALL_SLOTS[j]);
        if (openSlotKeys.has(k)) {
          hasOpen = true;
        }
        if (bookedSlotKeys.has(k)) {
          hasBooked = true;
        }
        if (completedSlotKeys.has(k)) {
          hasCompleted = true;
        }
        if (hasOpen && hasBooked && hasCompleted) {
          break;
        }
      }

      calendarArray.push({
        num: day,
        isCurrentMonth: true,
        dateStr,
        hasOpen,
        hasBooked,
        hasCompleted,
      });
    }

    const totalCells = calendarArray.length;
    const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      calendarArray.push({
        num: i,
        isCurrentMonth: false,
        dateStr: '',
      });
    }

    return calendarArray;
  };

  const calendarDays = getCalendarDays();
  const monthLabel = currentMonth.toLocaleString('default', {month: 'long', year: 'numeric'});

  const toggleSlot = time => {
    if (!selectedDateStr) {
      return;
    }
    if (bookedSlotKeys.has(slotKey(selectedDateStr, time))) {
      return;
    }
    setActiveSlots(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time],
    );
  };

  const handleSave = async () => {
    if (!selectedDateStr) {
      return;
    }
    try {
      setSaving(true);
      await setAvailability(selectedDateStr, activeSlots);
      await fetchGlobalSlots();
      Alert.alert('Success', `Saved schedule for ${selectedDateStr}`);
    } catch (e) {
      Alert.alert('Error', `Failed to save: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const changeMonth = offset => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    setSelectedDateStr(prev => {
      if (!prev) {
        return prev;
      }
      const parts = prev.split('-').map(Number);
      if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) {
        return prev;
      }
      const [py, pm, pd] = parts;
      const base = new Date(py, pm - 1 + offset, 1);
      const ny = base.getFullYear();
      const nmonth = base.getMonth();
      const lastDay = new Date(ny, nmonth + 1, 0).getDate();
      const day = Math.min(pd, lastDay);
      return `${ny}-${String(nmonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    });
  };

  const getSelectedLabel = () => {
    if (!selectedDateStr) {
      return 'Select a date';
    }
    const [y, m, d] = selectedDateStr.split('-');
    const dt = new Date(Number(y), Number(m) - 1, Number(d));
    return dt.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
          style={styles.backButton}>
          <ChevronLeft color="#334155" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Availability Grid</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowButton}>
              <ChevronLeft color="#0F172A" size={24} />
            </TouchableOpacity>
            <Text style={styles.monthText}>{monthLabel}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowButton}>
              <ChevronRight color="#0F172A" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.daysOfWeekRow}>
            {DAYS_OF_WEEK.map(d => (
              <Text key={d} style={styles.dayOfWeekText}>
                {d[0]}
              </Text>
            ))}
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotOpen]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotBooked]} />
              <Text style={styles.legendText}>Booked</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotCompleted]} />
              <Text style={styles.legendText}>Completed</Text>
            </View>
          </View>

          {loading ? (
            <View style={styles.loaderAreaCalendar}>
              <ActivityIndicator size="small" color="#0EA5E9" />
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {calendarDays.map((calDay, index) => {
                const isSelected = calDay.isCurrentMonth && calDay.dateStr === selectedDateStr;
                const isToday = calDay.isCurrentMonth && calDay.dateStr === todayStr;
                const showDots =
                  calDay.isCurrentMonth &&
                  (calDay.hasOpen || calDay.hasBooked || calDay.hasCompleted);

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (calDay.isCurrentMonth) {
                        setSelectedDateStr(calDay.dateStr);
                      }
                    }}
                    style={styles.dayCell}
                    disabled={!calDay.isCurrentMonth}>
                    <View
                      style={[
                        styles.dayCircle,
                        isSelected && styles.dayCircleSelected,
                        isToday && !isSelected && styles.dayCircleToday,
                      ]}>
                      <Text
                        style={[
                          styles.dayText,
                          !calDay.isCurrentMonth && styles.dayTextDisabled,
                          isSelected && styles.dayTextSelected,
                          isToday && !isSelected && styles.dayTextToday,
                        ]}>
                        {calDay.num}
                      </Text>
                    </View>
                    {showDots && (
                      <View style={styles.dotsRow}>
                        {calDay.hasOpen ? (
                          <View style={[styles.dot, isSelected && styles.dotSelected]} />
                        ) : null}
                        {calDay.hasBooked ? (
                          <View style={[styles.dotBooked, isSelected && styles.dotBookedSelected]} />
                        ) : null}
                        {calDay.hasCompleted ? (
                          <View style={[styles.dotCompleted, isSelected && styles.dotCompletedSelected]} />
                        ) : null}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.slotsCard}>
          <Text style={styles.selectedDateTitle}>{getSelectedLabel()}</Text>
          <Text style={styles.subText}>
            Select active time slots to open your availability for the whole day. Booked slots cannot be changed here.
          </Text>

          <View style={styles.slotsGrid}>
            {ALL_SLOTS.map(time => {
              const key = selectedDateStr ? slotKey(selectedDateStr, time) : '';
              const isBooked = key && bookedSlotKeys.has(key);
              const isActive = activeSlots.includes(time) && !isBooked;
              const isCompletedOnly =
                key &&
                !isBooked &&
                completedSlotKeys.has(key) &&
                !openSlotKeys.has(key) &&
                !activeSlots.includes(time);

              if (isBooked) {
                return (
                  <View key={time} style={[styles.slotItem, styles.slotItemBooked]}>
                    <Text style={styles.slotTextBooked}>{time}</Text>
                    <Text style={styles.bookedLabel}>Booked</Text>
                  </View>
                );
              }

              if (isCompletedOnly) {
                return (
                  <TouchableOpacity
                    key={time}
                    style={[styles.slotItem, styles.slotItemCompleted]}
                    onPress={() => toggleSlot(time)}
                    activeOpacity={0.7}>
                    <Text style={styles.slotTextCompleted}>{time}</Text>
                    <Text style={styles.completedLabel}>Completed</Text>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={time}
                  style={[styles.slotItem, isActive && styles.slotItemActive]}
                  onPress={() => toggleSlot(time)}
                  activeOpacity={0.7}>
                  <Text style={[styles.slotText, isActive && styles.slotTextActive]}>{time}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={saving || loading || !selectedDateStr}>
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Day Schedule'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backButton: {marginRight: 12},
  headerTitle: {fontSize: 22, fontWeight: '700', color: '#0F172A'},

  calendarCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrowButton: {padding: 4},
  monthText: {fontSize: 18, fontWeight: 'bold', color: '#0F172A'},

  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 4,
  },
  legendItem: {flexDirection: 'row', alignItems: 'center', marginHorizontal: 8},
  legendDot: {width: 6, height: 6, borderRadius: 3, marginRight: 6},
  legendDotOpen: {backgroundColor: '#0EA5E9'},
  legendDotBooked: {backgroundColor: '#EA580C'},
  legendDotCompleted: {backgroundColor: '#7C3AED'},
  legendText: {fontSize: 11, color: '#64748B', fontWeight: '600'},

  daysOfWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayOfWeekText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleSelected: {backgroundColor: '#3B82F6'},
  dayCircleToday: {backgroundColor: '#EFF6FF'},

  dayText: {fontSize: 16, fontWeight: '500', color: '#334155'},
  dayTextDisabled: {color: '#CBD5E1'},
  dayTextSelected: {color: '#FFFFFF', fontWeight: 'bold'},
  dayTextToday: {color: '#2563EB', fontWeight: 'bold'},

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    minHeight: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0EA5E9',
    marginHorizontal: 2,
  },
  dotSelected: {backgroundColor: '#BAE6FD', opacity: 1},
  dotBooked: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#EA580C',
    marginHorizontal: 2,
  },
  dotBookedSelected: {backgroundColor: '#FED7AA', opacity: 1},
  dotCompleted: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#7C3AED',
    marginHorizontal: 2,
  },
  dotCompletedSelected: {backgroundColor: '#DDD6FE', opacity: 1},

  loaderAreaCalendar: {height: 250, justifyContent: 'center', alignItems: 'center'},

  slotsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  selectedDateTitle: {fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 4},
  subText: {fontSize: 13, color: '#64748B', marginBottom: 20},

  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  slotItem: {
    width: '31%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    minHeight: 56,
    justifyContent: 'center',
  },
  slotItemActive: {
    backgroundColor: '#0369A1',
    borderColor: '#0369A1',
  },
  slotItemBooked: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
    opacity: 1,
  },
  slotItemCompleted: {
    backgroundColor: '#F5F3FF',
    borderColor: '#C4B5FD',
  },
  slotText: {fontWeight: '600', color: '#64748B', fontSize: 13},
  slotTextActive: {color: '#FFFFFF'},
  slotTextBooked: {fontWeight: '600', color: '#9A3412', fontSize: 12},
  slotTextCompleted: {fontWeight: '600', color: '#5B21B6', fontSize: 12},
  bookedLabel: {fontSize: 10, color: '#C2410C', fontWeight: '700', marginTop: 2},
  completedLabel: {fontSize: 10, color: '#6D28D9', fontWeight: '700', marginTop: 2},

  saveBtn: {
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {color: '#FFFFFF', fontWeight: '700', fontSize: 16},
});
