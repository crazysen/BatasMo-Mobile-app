import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserProfile } from '../context/UserProfileContext';
import { getAvailability, setAvailability } from '../services/appointmentService';

const ChevronLeft = (props) => <MaterialCommunityIcons name="chevron-left" {...props} />;
const ChevronRight = (props) => <MaterialCommunityIcons name="chevron-right" {...props} />;

const ALL_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AvailabilityManager({ navigation }) {
  const { profile } = useUserProfile();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // To show dots under the calendar dates that have slots
  const [globalSlots, setGlobalSlots] = useState(new Set()); 
  // The actual selected slots for the active date
  const [activeSlots, setActiveSlots] = useState([]);

  // Initialize selected date to today
  useEffect(() => {
    const today = new Date();
    const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDateStr(formatted);
  }, []);

  const fetchGlobalSlots = useCallback(async () => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      // Fetches all availability
      const slots = await getAvailability(profile.id);
      const newGlobal = new Set();
      slots.forEach(s => newGlobal.add(`${s.date}|${s.time}`));
      setGlobalSlots(newGlobal);
    } catch (e) {
      Alert.alert('Error', 'Failed to load availability.');
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchGlobalSlots();
  }, [fetchGlobalSlots]);

  // Update `activeSlots` whenever `selectedDateStr` or `globalSlots` changes
  useEffect(() => {
    if (!selectedDateStr) return;
    const dailySlots = [];
    ALL_SLOTS.forEach(time => {
      if (globalSlots.has(`${selectedDateStr}|${time}`)) {
        dailySlots.push(time);
      }
    });
    setActiveSlots(dailySlots);
  }, [selectedDateStr, globalSlots]);

  // Build calendar grid
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const previousMonthDays = new Date(year, month, 0).getDate();
    
    const calendarArray = [];
    
    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarArray.push({
        num: previousMonthDays - i,
        isCurrentMonth: false,
        dateStr: ''
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Check if this date has any slots globally
      let hasSlots = false;
      for (let j = 0; j < ALL_SLOTS.length; j++) {
        if (globalSlots.has(`${dateStr}|${ALL_SLOTS[j]}`)) {
          hasSlots = true;
          break;
        }
      }

      calendarArray.push({
        num: day,
        isCurrentMonth: true,
        dateStr,
        hasSlots
      });
    }
    
    // Next month padding to complete 42 cells (6 rows)
    const totalCells = calendarArray.length;
    const remainingCells = (Math.ceil(totalCells / 7) * 7) - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      calendarArray.push({
        num: i,
        isCurrentMonth: false,
        dateStr: ''
      });
    }
    
    return calendarArray;
  };

  const calendarDays = getCalendarDays();
  const monthLabel = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const toggleSlot = (time) => {
    setActiveSlots(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const handleSave = async () => {
    if (!selectedDateStr) return;
    try {
      setSaving(true);
      await setAvailability(selectedDateStr, activeSlots);
      
      // Update global cache immediately to reflect dots correctly
      setGlobalSlots(prev => {
        const next = new Set(prev);
        // remove old slots for this date
        ALL_SLOTS.forEach(time => {
          next.delete(`${selectedDateStr}|${time}`);
        });
        // add new slots
        activeSlots.forEach(time => {
          next.add(`${selectedDateStr}|${time}`);
        });
        return next;
      });

      Alert.alert('Success', `Saved schedule for ${selectedDateStr}`);
    } catch (e) {
      Alert.alert('Error', `Failed to save: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const changeMonth = (offset) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  // Convert "YYYY-MM-DD" to human readable format
  const getSelectedLabel = () => {
    if (!selectedDateStr) return 'Select a date';
    const [y, m, d] = selectedDateStr.split('-');
    const dt = new Date(Number(y), Number(m)-1, Number(d));
    return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : null} style={styles.backButton}>
          <ChevronLeft color="#334155" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Availability Grid</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Calendar Card */}
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
              <Text key={d} style={styles.dayOfWeekText}>{d[0]}</Text>
            ))}
          </View>

          {loading ? (
             <View style={styles.loaderAreaCalendar}>
                <ActivityIndicator size="small" color="#3B82F6" />
             </View>
          ) : (
            <View style={styles.gridContainer}>
              {calendarDays.map((calDay, index) => {
                const isSelected = calDay.isCurrentMonth && calDay.dateStr === selectedDateStr;
                const isToday = calDay.isCurrentMonth && calDay.dateStr === todayStr;

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (calDay.isCurrentMonth) setSelectedDateStr(calDay.dateStr);
                    }}
                    style={styles.dayCell}
                    disabled={!calDay.isCurrentMonth}
                  >
                    <View style={[
                      styles.dayCircle,
                      isSelected && styles.dayCircleSelected,
                      isToday && !isSelected && styles.dayCircleToday
                    ]}>
                      <Text style={[
                        styles.dayText,
                        !calDay.isCurrentMonth && styles.dayTextDisabled,
                        isSelected && styles.dayTextSelected,
                        isToday && !isSelected && styles.dayTextToday
                      ]}>
                        {calDay.num}
                      </Text>
                    </View>
                    {calDay.hasSlots && (
                      <View style={[styles.dot, isSelected && styles.dotSelected]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Selected Date Card */}
        <View style={styles.slotsCard}>
          <Text style={styles.selectedDateTitle}>{getSelectedLabel()}</Text>
          <Text style={styles.subText}>Select active time slots to open your availability for the whole day.</Text>

          <View style={styles.slotsGrid}>
            {ALL_SLOTS.map((time) => {
              const isActive = activeSlots.includes(time);
              return (
                <TouchableOpacity 
                  key={time} 
                  style={[styles.slotItem, isActive && styles.slotItemActive]}
                  onPress={() => toggleSlot(time)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.slotText, isActive && styles.slotTextActive]}>{time}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving || loading || !selectedDateStr}>
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Day Schedule'}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  
  calendarCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrowButton: { padding: 4 },
  monthText: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  
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
    width: '14.28%', // 100/7
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
  dayCircleSelected: { backgroundColor: '#3B82F6' },
  dayCircleToday: { backgroundColor: '#EFF6FF' },
  
  dayText: { fontSize: 16, fontWeight: '500', color: '#334155' },
  dayTextDisabled: { color: '#CBD5E1' },
  dayTextSelected: { color: '#FFFFFF', fontWeight: 'bold' },
  dayTextToday: { color: '#2563EB', fontWeight: 'bold' },
  
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#3B82F6', marginTop: 4 },
  dotSelected: { backgroundColor: '#FFFFFF', opacity: 0.8 },
  
  loaderAreaCalendar: { height: 250, justifyContent: 'center', alignItems: 'center' },
  
  slotsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  selectedDateTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  subText: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  
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
    paddingVertical: 12, 
    alignItems: 'center', 
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  slotItemActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  slotText: { fontWeight: '600', color: '#64748B', fontSize: 13 },
  slotTextActive: { color: '#FFFFFF' },
  
  saveBtn: { 
    backgroundColor: '#0F172A', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
