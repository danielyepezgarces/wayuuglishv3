import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Course } from '../../types';
import { UILanguage, UIStrings, translations } from '../../i18n/translations';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  currentLang: UILanguage;
  onSelectLang: (lang: UILanguage) => void;
  currentCourseId: string;
  onSelectCourse: (courseId: string) => void;
  courses: Course[];
  t: UIStrings;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  currentLang,
  onSelectLang,
  currentCourseId,
  onSelectCourse,
  courses,
  t,
}) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'all'>('recommended');

  const langOptions: { code: UILanguage; name: string; flag: string }[] = [
    { code: 'guc', name: 'Wayuunaiki', flag: '🌵' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  // Smart filtering based on active interface language
  const getRecommendedCourses = (): Course[] => {
    if (currentLang === 'en') {
      return courses.filter(
        (c) => c.pair === 'en-wayuu' || c.pair === 'wayuu-en' || c.pair === 'es-en'
      );
    }
    if (currentLang === 'es') {
      return courses.filter(
        (c) => c.pair === 'es-en' || c.pair === 'wayuu-es' || c.pair === 'wayuu-en'
      );
    }
    // 'guc'
    return courses.filter(
      (c) => c.pair === 'wayuu-en' || c.pair === 'wayuu-es'
    );
  };

  const recommendedCourses = getRecommendedCourses();
  const displayCourses = activeTab === 'recommended' ? recommendedCourses : courses;

  const getPairBadge = (pair: string) => {
    switch (pair) {
      case 'wayuu-en':
        return { from: 'WAY', to: 'EN', fromIcon: '🌵', toIcon: '🇺🇸' };
      case 'wayuu-es':
        return { from: 'WAY', to: 'ES', fromIcon: '🌵', toIcon: '🇪🇸' };
      case 'es-en':
        return { from: 'ES', to: 'EN', fromIcon: '🇪🇸', toIcon: '🇺🇸' };
      case 'en-wayuu':
        return { from: 'EN', to: 'WAY', fromIcon: '🇺🇸', toIcon: '🌵' };
      default:
        return { from: 'LANG', to: 'LANG', fromIcon: '🌐', toIcon: '🌐' };
    }
  };

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
            <Text style={styles.sheetTitle}>⚙️ {t.settingsTitle}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIconBtn}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {/* Section 1: Interface Language Selector */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t.interfaceLangTitle}</Text>
              <Text style={styles.sectionSubtitle}>
                Elige el idioma en el que deseas ver botones, instrucciones y textos de la aplicación.
              </Text>

              <View style={styles.langGrid}>
                {langOptions.map((opt) => {
                  const isSelected = currentLang === opt.code;
                  return (
                    <TouchableOpacity
                      key={opt.code}
                      style={[
                        styles.langPill,
                        isSelected && styles.langPillActive,
                      ]}
                      onPress={() => onSelectLang(opt.code)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.langPillFlag}>{opt.flag}</Text>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.langPillName,
                            isSelected && styles.langPillNameActive,
                          ]}
                        >
                          {opt.name}
                        </Text>
                        <Text style={styles.langPillCode}>{opt.code.toUpperCase()}</Text>
                      </View>
                      {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 2: Course / Learning Track Catalog */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>{t.courseTracksTitle}</Text>
                  <Text style={styles.sectionSubtitle}>
                    Selecciona el curso bilingüe que deseas estudiar en la ruta de lecciones.
                  </Text>
                </View>
              </View>

              {/* Sub-tabs: Recommended vs All */}
              <View style={styles.tabSwitcher}>
                <TouchableOpacity
                  style={[
                    styles.tabSwitchBtn,
                    activeTab === 'recommended' && styles.tabSwitchBtnActive,
                  ]}
                  onPress={() => setActiveTab('recommended')}
                >
                  <Text
                    style={[
                      styles.tabSwitchText,
                      activeTab === 'recommended' && styles.tabSwitchTextActive,
                    ]}
                  >
                    ⭐ {t.recommendedCourses}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabSwitchBtn,
                    activeTab === 'all' && styles.tabSwitchBtnActive,
                  ]}
                  onPress={() => setActiveTab('all')}
                >
                  <Text
                    style={[
                      styles.tabSwitchText,
                      activeTab === 'all' && styles.tabSwitchTextActive,
                    ]}
                  >
                    🌐 {t.allCourses} ({courses.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Course Cards List */}
              <View style={styles.coursesList}>
                {displayCourses.map((courseItem) => {
                  const isCurrent = currentCourseId === courseItem.id;
                  const badge = getPairBadge(courseItem.pair);

                  return (
                    <TouchableOpacity
                      key={courseItem.id}
                      style={[
                        styles.courseCard,
                        isCurrent && styles.courseCardActive,
                      ]}
                      onPress={() => {
                        onSelectCourse(courseItem.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.courseTopRow}>
                        <View style={styles.pairBadge}>
                          <Text style={{ fontSize: 13 }}>{badge.fromIcon}</Text>
                          <Text style={styles.pairCode}>{badge.from}</Text>
                          <Text style={styles.pairArrow}>→</Text>
                          <Text style={{ fontSize: 13 }}>{badge.toIcon}</Text>
                          <Text style={styles.pairCode}>{badge.to}</Text>
                        </View>

                        {isCurrent && (
                          <View style={styles.activeTrackPill}>
                            <Text style={styles.activeTrackText}>{t.activeCourseBadge}</Text>
                          </View>
                        )}
                      </View>

                      <Text style={[styles.courseTitle, isCurrent && styles.courseTitleActive]}>
                        {courseItem.title}
                      </Text>

                      <Text style={styles.courseMeta}>
                        {courseItem.modules.length} Módulos · {courseItem.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lecciones
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer Done Button */}
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
    maxHeight: '92%',
    minHeight: '80%',
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
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  langGrid: {
    marginTop: 14,
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  langPillActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#E11D48',
  },
  langPillFlag: {
    fontSize: 22,
  },
  langPillName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  langPillNameActive: {
    color: '#E11D48',
    fontWeight: '800',
  },
  langPillCode: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E11D48',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 3,
    marginTop: 14,
    marginBottom: 12,
  },
  tabSwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabSwitchBtnActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tabSwitchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabSwitchTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  coursesList: {
    gap: 10,
  },
  courseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  courseCardActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#E11D48',
  },
  courseTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pairBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  pairCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  pairArrow: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  activeTrackPill: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeTrackText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  courseTitleActive: {
    color: '#E11D48',
  },
  courseMeta: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
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
