import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { UserStats } from '../../services/progressService';
import { UIStrings, UILanguage } from '../../i18n/translations';

interface DayStreakModalProps {
  visible: boolean;
  onClose: () => void;
  stats: UserStats;
  t: UIStrings;
  lang: UILanguage;
}

interface CalendarDay {
  dayNum: number;
  dateStr: string;
  isToday: boolean;
  isDone: boolean;
}

export const DayStreakModal: React.FC<DayStreakModalProps> = ({
  visible,
  onClose,
  stats,
  t,
  lang,
}) => {
  const [selectedMonthOffset, setSelectedMonthOffset] = useState(0);

  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() + selectedMonthOffset, 1);
  const currentYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth();

  const monthNames = {
    guc: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    es: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
  };

  const dayHeaders = {
    guc: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    es: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  };

  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isPracticedToday = Boolean(stats.activeDates?.includes(todayString));

  // Generate perfect 7-column rows for the monthly calendar
  const getCalendarWeeks = (): (CalendarDay | null)[][] => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    // Sunday = 0, Monday = 1 ... Saturday = 6
    // Shift so Monday = 0, Sunday = 6
    const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7;

    const weeks: (CalendarDay | null)[][] = [];
    let currentWeek: (CalendarDay | null)[] = [];

    // Empty offset days before month starts
    for (let i = 0; i < startDayOffset; i++) {
      currentWeek.push(null);
    }

    // Days of the month
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const isDayToday = dateStr === todayString;
      const isDone = Boolean(stats.activeDates?.includes(dateStr));

      currentWeek.push({
        dayNum,
        dateStr,
        isToday: isDayToday,
        isDone,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Pad last week to complete 7 items
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const calendarWeeks = getCalendarWeeks();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header Bar */}
          <View style={styles.sheetHeader}>
            <View style={{ width: 32 }} />
            <Text style={styles.sheetTitle}>Day Streak · Calendario</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIconBtn}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {/* Fire Hero Banner */}
            <View style={styles.heroBanner}>
              <View style={styles.flameCircle}>
                <Text style={{ fontSize: 44 }}>🔥</Text>
              </View>
              <Text style={styles.streakBigNumber}>{stats.streak}</Text>
              <Text style={styles.streakBigLabel}>
                {lang === 'guc'
                  ? `${stats.streak} Ka'i Ekirajawaa`
                  : lang === 'en'
                  ? `${stats.streak} Day Study Streak`
                  : `Días de Racha Activa`}
              </Text>
              <Text style={styles.streakSubDesc}>
                {isPracticedToday
                  ? (lang === 'guc'
                      ? '¡Kettaasü pütuma maa\'ulu! Racha protegida para hoy.'
                      : '¡Ya cumpliste tu meta de hoy! Tu racha está protegida.')
                  : (lang === 'guc'
                      ? 'Ekirajaa wanee lección maa\'ulu süpüla nnojolüin motüin.'
                      : '¡Completa al menos una lección hoy para no perder tu racha!')}
              </Text>
            </View>

            {/* Monthly Calendar View */}
            <View style={styles.cardBox}>
              {/* Month Selector Bar */}
              <View style={styles.monthSelectorBar}>
                <TouchableOpacity
                  onPress={() => setSelectedMonthOffset((prev) => prev - 1)}
                  style={styles.monthNavBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.monthNavText}>◀</Text>
                </TouchableOpacity>

                <Text style={styles.monthTitleText}>
                  {monthNames[lang][currentMonth]} {currentYear}
                </Text>

                <TouchableOpacity
                  onPress={() => setSelectedMonthOffset((prev) => Math.min(0, prev + 1))}
                  style={[styles.monthNavBtn, selectedMonthOffset >= 0 && { opacity: 0.25 }]}
                  disabled={selectedMonthOffset >= 0}
                  activeOpacity={0.7}
                >
                  <Text style={styles.monthNavText}>▶</Text>
                </TouchableOpacity>
              </View>

              {/* Day Headers (L M M J V S D) */}
              <View style={styles.calendarHeaderRow}>
                {(dayHeaders[lang] || dayHeaders.es).map((header, i) => (
                  <View key={i} style={styles.calendarHeaderCellWrap}>
                    <Text style={styles.calendarHeaderCell}>
                      {header}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Days Grid - Row by Row of 7 columns */}
              <View style={styles.calendarWeeksContainer}>
                {calendarWeeks.map((week, weekIdx) => (
                  <View key={`week-${weekIdx}`} style={styles.calendarWeekRow}>
                    {week.map((day, dayIdx) => (
                      <View key={`day-${dayIdx}`} style={styles.calendarDayCellWrap}>
                        {day ? (
                          <View
                            style={[
                              styles.dayBubble,
                              day.isDone && styles.dayBubbleDone,
                              day.isToday && !day.isDone && styles.dayBubbleToday,
                            ]}
                          >
                            {day.isDone ? (
                              <Text style={{ fontSize: 13 }}>🔥</Text>
                            ) : (
                              <Text
                                style={[
                                  styles.dayNumberText,
                                  day.isToday && styles.dayNumberTextToday,
                                ]}
                              >
                                {day.dayNum}
                              </Text>
                            )}
                          </View>
                        ) : (
                          <View style={styles.dayBubbleEmpty} />
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>

            {/* Constancy & Cultural Wisdom */}
            <View style={styles.wisdomCard}>
              <Text style={styles.wisdomTitle}>🌿 Waneepia Tü Akua'ipaka (Constancia Wayuu)</Text>
              <Text style={styles.wisdomDesc}>
                En la cosmovisión Wayuu, el conocimiento se teje día a día como una *Susu*. Un poco de estudio diario preserva el pensamiento ancestral y expande tus horizontes.
              </Text>
            </View>
          </ScrollView>

          {/* Footer Close Button */}
          <View style={styles.sheetFooter}>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text style={styles.doneBtnText}>{t.closeBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FAFAF8',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
    minHeight: '75%',
    maxWidth: 580,
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  heroBanner: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#E11D48',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  flameCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakBigNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#E11D48',
  },
  streakBigLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  streakSubDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 280,
  },
  cardBox: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  monthSelectorBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthNavText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: 'bold',
  },
  monthTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  calendarHeaderCellWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarHeaderCell: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
  },
  calendarHeaderCellSunday: {
    color: '#E11D48',
  },
  calendarWeeksContainer: {
    gap: 8,
  },
  calendarWeekRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarDayCellWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
  },
  dayBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dayBubbleEmpty: {
    width: 34,
    height: 34,
  },
  dayBubbleDone: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FDA4AF',
  },
  dayBubbleToday: {
    borderWidth: 2,
    borderColor: '#E11D48',
    backgroundColor: '#FFF',
  },
  dayNumberText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '700',
  },
  dayNumberTextSunday: {
    color: '#E11D48',
  },
  dayNumberTextToday: {
    color: '#E11D48',
    fontWeight: '900',
  },
  wisdomCard: {
    backgroundColor: '#FEF9C3',
    padding: 16,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#CA8A04',
  },
  wisdomTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#854D0E',
  },
  wisdomDesc: {
    fontSize: 12,
    color: '#713F12',
    marginTop: 4,
    lineHeight: 17,
  },
  sheetFooter: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  doneBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
