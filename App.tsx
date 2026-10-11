import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { initialCourses } from './src/data/initialCourses';
import { Lesson, Exercise } from './src/types';
import { translations, UILanguage } from './src/i18n/translations';
import { getLocalizedCourse } from './src/i18n/courseLocalizer';
import { WayuuglishLogo } from './src/components/WayuuglishLogo';
import { progressService, UserStats } from './src/services/progressService';
import { ExerciseRunner } from './src/components/exercise/ExerciseRunner';
import { DayStreakModal } from './src/components/streak/DayStreakModal';
import { SettingsModal } from './src/components/settings/SettingsModal';

export default function App() {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth >= 768;

  const [lang, setLang] = useState<UILanguage>(progressService.getStats().interfaceLanguage || 'guc');
  const [stats, setStats] = useState<UserStats>(progressService.getStats());

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showXpModal, setShowXpModal] = useState(false);

  // Lesson state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const t = translations[lang];
  const activeCourseRaw =
    initialCourses.find((c) => c.id === stats.currentCourseId) || initialCourses[0];
  const course = getLocalizedCourse(activeCourseRaw, lang);

  // Subscribe to reactive user progress
  useEffect(() => {
    const unsubscribe = progressService.subscribe((updatedStats) => {
      setStats(updatedStats);
      if (updatedStats.interfaceLanguage && updatedStats.interfaceLanguage !== lang) {
        setLang(updatedStats.interfaceLanguage);
      }
    });
    return unsubscribe;
  }, [lang]);

  const handleStartLesson = (lesson: Lesson) => {
    if (stats.hearts <= 0) {
      setShowHeartsModal(true);
      return;
    }
    setActiveLesson(lesson);
    setCurrentExerciseIndex(0);
    setFeedback('idle');
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!activeLesson) return;

    if (isCorrect) {
      setFeedback('correct');
      progressService.addXp(10);
    } else {
      setFeedback('wrong');
      const hasRemaining = progressService.deductHeart();
      if (!hasRemaining || stats.hearts <= 1) {
        Alert.alert(t.noHeartsTitle, t.noHeartsDesc, [
          { text: t.refillBtn, onPress: () => progressService.refillHearts() },
          { text: t.closeBtn, onPress: () => setActiveLesson(null) },
        ]);
      }
    }
  };

  const handleNext = () => {
    if (!activeLesson) return;
    if (currentExerciseIndex + 1 < activeLesson.exercises.length) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setFeedback('idle');
    } else {
      const result = progressService.recordCompletedLesson(
        activeLesson.id,
        activeLesson.xpReward
      );

      let msg = t.completedMsg(activeLesson.xpReward, activeLesson.title);
      if (result.streakIncreased) {
        msg += `\n\n🔥 ¡Racha aumentada a ${result.currentStreak} días!`;
      }

      Alert.alert(t.completedTitle, msg, [
        { text: t.continueBtn, onPress: () => setActiveLesson(null) },
      ]);
      setActiveLesson(null);
    }
  };

  // Render Lesson Exercise Runner Screen
  if (activeLesson) {
    const exercise = activeLesson.exercises[currentExerciseIndex] as Exercise;
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.exerciseMainWrapper, isDesktop && styles.desktopExerciseWrapper]}>
          <View style={styles.lessonHeader}>
            <TouchableOpacity onPress={() => setActiveLesson(null)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${((currentExerciseIndex + 1) / activeLesson.exercises.length) * 100}%`,
                  },
                ]}
              />
            </View>
            <TouchableOpacity onPress={() => setShowHeartsModal(true)}>
              <Text style={styles.heartsBadge}>❤️ {stats.hearts}</Text>
            </TouchableOpacity>
          </View>

          <ExerciseRunner
            exercise={exercise}
            t={t}
            feedback={feedback}
            onAnswer={handleAnswer}
          />

          {feedback !== 'idle' && (
            <View
              style={[
                styles.feedbackBar,
                feedback === 'correct' ? styles.feedbackBarCorrect : styles.feedbackBarWrong,
              ]}
            >
              <Text style={styles.feedbackTitle}>
                {feedback === 'correct' ? t.correctFeedback : t.wrongFeedback}
              </Text>
              <TouchableOpacity style={styles.continueBtn} onPress={handleNext}>
                <Text style={styles.continueBtnText}>{t.continueBtn}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Render Main Course Dashboard
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Responsive Header (Desktop Bar or Mobile 2-Row) */}
      <View style={styles.headerContainer}>
        <View style={[styles.headerInner, isDesktop && styles.desktopHeaderInner]}>
          {isDesktop ? (
            /* Desktop Single-Row Header */
            <View style={styles.desktopHeaderRow}>
              <View style={styles.desktopBrandCol}>
                <WayuuglishLogo width={160} height={36} />
                <TouchableOpacity
                  style={styles.courseTagBadge}
                  onPress={() => setShowSettingsModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.courseTagBadgeText}>{course.title}</Text>
                  <Text style={styles.courseTagBadgeArrow}>▾</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.desktopControlsRight}>
                {/* Streak Card */}
                <TouchableOpacity
                  style={styles.desktopStatCard}
                  onPress={() => setShowStreakModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statIcon}>🔥</Text>
                  <Text style={styles.desktopStatValue}>{stats.streak}</Text>
                </TouchableOpacity>

                {/* XP Card */}
                <TouchableOpacity
                  style={styles.desktopStatCard}
                  onPress={() => setShowXpModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statIcon}>⚡</Text>
                  <Text style={styles.desktopStatValue}>{stats.xp}</Text>
                </TouchableOpacity>

                {/* Hearts Card */}
                <TouchableOpacity
                  style={styles.desktopStatCard}
                  onPress={() => setShowHeartsModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statIcon}>❤️</Text>
                  <Text style={styles.desktopStatValue}>{stats.hearts}/{stats.maxHearts}</Text>
                </TouchableOpacity>

                <View style={styles.desktopDivider} />

                {/* Language Selector Button */}
                <TouchableOpacity
                  style={styles.langSelectorBtn}
                  onPress={() => setShowSettingsModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.langSelectorFlag}>{t.flag}</Text>
                  <Text style={styles.langSelectorName}>{t.languageName}</Text>
                  <Text style={styles.langSelectorArrow}>▾</Text>
                </TouchableOpacity>

                {/* Settings Gear Button */}
                <TouchableOpacity
                  style={styles.settingsIconBtn}
                  onPress={() => setShowSettingsModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Mobile 2-Row Header */
            <>
              {/* Row 1: Brand & Language/Settings Picker */}
              <View style={styles.headerTopRow}>
                <View style={styles.brandRow}>
                  <WayuuglishLogo width={140} height={32} />
                </View>

                <View style={styles.headerControlsRight}>
                  {/* Clean Mobile Language Selector Button */}
                  <TouchableOpacity
                    style={styles.langSelectorBtn}
                    onPress={() => setShowSettingsModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.langSelectorFlag}>{t.flag}</Text>
                    <Text style={styles.langSelectorName}>{t.languageName}</Text>
                    <Text style={styles.langSelectorArrow}>▾</Text>
                  </TouchableOpacity>

                  {/* Quick Settings Gear Button */}
                  <TouchableOpacity
                    style={styles.settingsIconBtn}
                    onPress={() => setShowSettingsModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.settingsIcon}>⚙️</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Row 2: Distributed Mobile Stats Bar with Full Functionality */}
              <View style={styles.statsBar}>
                {/* Streak Card */}
                <TouchableOpacity
                  style={styles.statCard}
                  onPress={() => setShowStreakModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statIcon}>🔥</Text>
                  <View>
                    <Text style={styles.statValue}>{stats.streak}</Text>
                    <Text style={styles.statLabel}>{t.streakLabel}</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.statDivider} />

                {/* XP Card */}
                <TouchableOpacity
                  style={styles.statCard}
                  onPress={() => setShowXpModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statIcon}>⚡</Text>
                  <View>
                    <Text style={styles.statValue}>{stats.xp}</Text>
                    <Text style={styles.statLabel}>{t.xpLabel}</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.statDivider} />

                {/* Hearts Card */}
                <TouchableOpacity
                  style={styles.statCard}
                  onPress={() => setShowHeartsModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statIcon}>❤️</Text>
                  <View>
                    <Text style={styles.statValue}>{stats.hearts}/{stats.maxHearts}</Text>
                    <Text style={styles.statLabel}>{t.heartsLabel}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Main Path Map View */}
      <ScrollView contentContainerStyle={[styles.scrollContent, isDesktop && styles.desktopScrollContent]}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>{t.ancestralPath}</Text>
          <Text style={styles.heroTitle}>{course.title}</Text>
          <Text style={styles.heroDesc}>{t.offlineDesc}</Text>
        </View>

        <Text style={styles.sectionHeader}>{t.modulesTitle}</Text>

        {course.modules.map((module) => (
          <View key={module.id} style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleLevel}>{t.level} {module.level}</Text>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDesc}>{module.description}</Text>
            </View>

            <View style={styles.lessonsContainer}>
              {module.lessons.map((lesson, idx) => {
                const isCompleted = stats.completedLessons.includes(lesson.id);
                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[
                      styles.lessonItem,
                      isCompleted && styles.lessonItemCompleted,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleStartLesson(lesson)}
                  >
                    <View
                      style={[
                        styles.lessonIconBadge,
                        isCompleted && styles.lessonIconBadgeCompleted,
                      ]}
                    >
                      <Text style={styles.lessonIconText}>
                        {isCompleted ? '✓' : idx + 1}
                      </Text>
                    </View>
                    <View style={styles.lessonMeta}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.lessonSub}>{lesson.description}</Text>
                    </View>
                    <View
                      style={[
                        styles.xpBadge,
                        isCompleted && styles.xpBadgeCompleted,
                      ]}
                    >
                      <Text
                        style={[
                          styles.xpBadgeText,
                          isCompleted && styles.xpBadgeTextCompleted,
                        ]}
                      >
                        {isCompleted ? t.completedLessonBadge : `+${lesson.xpReward} XP`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Coming Soon Card beneath the last module */}
        <View style={styles.comingSoonCard}>
          <View style={styles.comingSoonBadgeRow}>
            <Text style={{ fontSize: 24 }}>✨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.comingSoonTitle}>{t.comingSoonTitle}</Text>
              <Text style={styles.comingSoonDesc}>{t.comingSoonDesc}</Text>
            </View>
          </View>
          <View style={styles.comingSoonPill}>
            <Text style={styles.comingSoonPillText}>✨ Nuevas unidades en producción</Text>
          </View>
        </View>
      </ScrollView>

      {/* Settings Modal (Interface Language & Course Tracks) */}
      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        currentLang={lang}
        onSelectLang={(newLang) => {
          setLang(newLang);
          progressService.setInterfaceLanguage(newLang);
        }}
        currentCourseId={stats.currentCourseId || initialCourses[0].id}
        onSelectCourse={(courseId) => {
          progressService.setCourseId(courseId);
        }}
        courses={initialCourses}
        t={t}
      />

      {/* Hearts (Vidas) Interactive Modal */}
      <Modal
        visible={showHeartsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHeartsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowHeartsModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalIconCenter}>
              <Text style={{ fontSize: 36 }}>❤️</Text>
            </View>
            <Text style={styles.modalTitle}>{t.heartsModalTitle}</Text>
            <Text style={styles.modalBodyText}>
              {stats.hearts === stats.maxHearts
                ? '¡Tus vidas están al máximo (5/5)!'
                : t.heartsModalDesc}
            </Text>
            <Text style={styles.modalCountHighlight}>
              {stats.hearts} / {stats.maxHearts}
            </Text>
            <TouchableOpacity
              style={styles.actionModalBtn}
              onPress={() => {
                progressService.refillHearts();
                setShowHeartsModal(false);
              }}
            >
              <Text style={styles.actionModalBtnText}>{t.refillBtn}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowHeartsModal(false)}
            >
              <Text style={styles.closeModalBtnText}>{t.closeBtn}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Day Streak Evolution & Calendar Modal */}
      <DayStreakModal
        visible={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        stats={stats}
        t={t}
        lang={lang}
      />

      {/* XP Interactive Modal */}
      <Modal
        visible={showXpModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowXpModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowXpModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalIconCenter}>
              <Text style={{ fontSize: 36 }}>⚡</Text>
            </View>
            <Text style={styles.modalTitle}>{t.xpModalTitle}</Text>
            <Text style={styles.modalBodyText}>
              {t.xpModalDesc(stats.xp)}
            </Text>
            <Text style={styles.modalCountHighlight}>
              {stats.xp} XP
            </Text>
            <TouchableOpacity
              style={styles.actionModalBtn}
              onPress={() => setShowXpModal(false)}
            >
              <Text style={styles.actionModalBtnText}>{t.continueBtn}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerInner: {
    width: '100%',
    gap: 10,
  },
  desktopHeaderInner: {
    maxWidth: 1040,
    alignSelf: 'center',
    gap: 0,
  },
  desktopHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  desktopBrandCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  courseTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  courseTagBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  courseTagBadgeArrow: {
    fontSize: 10,
    color: '#64748B',
  },
  desktopControlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  desktopStatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  desktopStatValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  desktopDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 2,
  },
  desktopScrollContent: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  exerciseMainWrapper: {
    flex: 1,
    width: '100%',
  },
  desktopExerciseWrapper: {
    maxWidth: 680,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerControlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsIconBtn: {
    backgroundColor: '#F8FAFC',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 16,
  },
  langSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  langSelectorFlag: {
    fontSize: 14,
  },
  langSelectorName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  langSelectorArrow: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '900',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  heroTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11D48',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  heroDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  moduleCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  moduleHeader: {
    backgroundColor: '#FFF1F2',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4E6',
  },
  moduleLevel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#BE123C',
    letterSpacing: 0.5,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#881337',
    marginTop: 2,
  },
  moduleDesc: {
    fontSize: 12,
    color: '#9F1239',
    marginTop: 2,
  },
  lessonsContainer: {
    padding: 12,
    gap: 10,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lessonItemCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  lessonIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonIconBadgeCompleted: {
    backgroundColor: '#16A34A',
  },
  lessonIconText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  lessonMeta: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  lessonSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  xpBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpBadgeCompleted: {
    backgroundColor: '#DCFCE7',
  },
  xpBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  xpBadgeTextCompleted: {
    color: '#15803D',
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
  },
  progressBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E11D48',
    borderRadius: 5,
  },
  heartsBadge: {
    fontSize: 14,
    fontWeight: '700',
  },
  exerciseScroll: {
    flex: 1,
  },
  exerciseContent: {
    padding: 20,
    paddingBottom: 40,
  },
  exerciseStep: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  exerciseInstruction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginTop: 4,
  },
  exercisePrompt: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
    lineHeight: 28,
  },
  culturalBox: {
    backgroundColor: '#FEF9C3',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#CA8A04',
    marginTop: 16,
  },
  culturalTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#854D0E',
  },
  culturalText: {
    fontSize: 12,
    color: '#713F12',
    marginTop: 2,
    lineHeight: 16,
  },
  optionsList: {
    marginTop: 24,
    gap: 12,
  },
  optionBtn: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  optionBtnCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
  },
  optionBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  optionTextActive: {
    fontWeight: '800',
  },
  feedbackBar: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedbackBarCorrect: {
    backgroundColor: '#DCFCE7',
  },
  feedbackBarWrong: {
    backgroundColor: '#FEE2E2',
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  continueBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  continueBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 22,
    gap: 12,
    alignItems: 'center',
  },
  modalIconCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalBodyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalCountHighlight: {
    fontSize: 28,
    fontWeight: '900',
    color: '#E11D48',
    marginVertical: 4,
  },
  actionModalBtn: {
    width: '100%',
    backgroundColor: '#E11D48',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  actionModalBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  closeModalBtn: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeModalBtnText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 13,
  },
  langOptionBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  langOptionBtnActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#E11D48',
  },
  langOptionFlag: {
    fontSize: 24,
  },
  langOptionName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  langOptionNameActive: {
    color: '#E11D48',
    fontWeight: '800',
  },
  langOptionCode: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E11D48',
  },
  comingSoonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginTop: 8,
    marginBottom: 20,
    gap: 12,
  },
  comingSoonBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  comingSoonTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  comingSoonDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  comingSoonPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  comingSoonPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
});
