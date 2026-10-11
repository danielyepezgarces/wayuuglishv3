export type UILanguage = 'guc' | 'es' | 'en';

export interface UIStrings {
  languageName: string;
  flag: string;
  ancestralPath: string;
  offlineDesc: string;
  modulesTitle: string;
  level: string;
  exerciseOf: (current: number, total: number) => string;
  culturalWisdom: string;
  correctFeedback: string;
  wrongFeedback: string;
  continueBtn: string;
  completedTitle: string;
  completedMsg: (xp: number, title: string) => string;
  selectLanguage: string;
  streakLabel: string;
  heartsLabel: string;
  xpLabel: string;
  closeBtn: string;
  // Modals
  heartsModalTitle: string;
  heartsModalDesc: string;
  refillBtn: string;
  noHeartsTitle: string;
  noHeartsDesc: string;
  streakModalTitle: string;
  streakModalDesc: (streak: number) => string;
  xpModalTitle: string;
  xpModalDesc: (xp: number) => string;
  completedLessonBadge: string;
  comingSoonTitle: string;
  comingSoonDesc: string;
  settingsTitle: string;
  interfaceLangTitle: string;
  courseTracksTitle: string;
  recommendedCourses: string;
  allCourses: string;
  activeCourseBadge: string;
}

export const translations: Record<UILanguage, UIStrings> = {
  guc: {
    languageName: 'Wayuunaiki',
    flag: '🌵',
    ancestralPath: 'Wopü Wayuu',
    offlineDesc: 'Ekirajawaa Alijuniki sümaa Wayuunaiki nojoishi choujain internet.',
    modulesTitle: 'Tukua Ekirajia',
    level: 'A\'YATAWAA',
    exerciseOf: (current, total) => `Ateekia ${current} sünainje ${total}`,
    culturalWisdom: 'Atüjaa Wayuu:',
    correctFeedback: '¡Anas ma\'in! ✨',
    wrongFeedback: '¡Eeshi süpüla painjüin! 💪',
    continueBtn: 'Wapüna',
    completedTitle: '¡Kettaasü pia! 🎉',
    completedMsg: (xp, title) => `Kasa anas: +${xp} XP sünainje ${title}`,
    selectLanguage: 'Aaneekaa Anüiki',
    streakLabel: 'Ka\'i',
    heartsLabel: 'Kataa o\'u',
    xpLabel: 'XP',
    closeBtn: 'Ashawatüshii',
    heartsModalTitle: 'Pükataa o\'u',
    heartsModalDesc: 'Tü kataaka o\'u shia süpüla ekirajawaa. Eeshi süpüla peyetüin süpüshua\'a maa\'ulu yaa.',
    refillBtn: 'Ayeteraa süpüshua\'a (5/5)',
    noHeartsTitle: '¡Nojoishi kataa o\'u!',
    noHeartsDesc: 'Ayeteraa pükataa o\'u süpüla puwanoojüin sünain ekirajia.',
    streakModalTitle: 'Püka\'i Ekirajawaa',
    streakModalDesc: (streak) => `${streak} ka\'i pi\'yataain sünain ekirajawaa. ¡Paashaje\'era waneepia!`,
    xpModalTitle: 'Püpüshuaya XP',
    xpModalDesc: (xp) => `Kettaasü pütuma ${xp} XP. ¡Anas ma'in pükua'ipa!`,
    completedLessonBadge: 'Kettaasü ✓',
    comingSoonTitle: 'Mapeena eweeta müshii jekeerü',
    comingSoonDesc: '¡Kettaasü pütuma tü ekirajia eekat! Mapeena eweeta müshii jekeerü pütchikalüirua süpüla puwanoojüin sünain alijuniki.',
    settingsTitle: 'Akua\'ipa (Ajustes)',
    interfaceLangTitle: 'Anüiki süpüla la pantalla',
    courseTracksTitle: 'Wopü eekat süpüla ekirajawaa',
    recommendedCourses: 'Ekirajia anasü pümüin',
    allCourses: 'Süpüshua\'a ekirajia',
    activeCourseBadge: 'A\'yataasü ✓',
  },
  es: {
    languageName: 'Español',
    flag: '🇪🇸',
    ancestralPath: 'Inmersión Bilingüe · Intercultural',
    offlineDesc: 'Domina el inglés conectando con las raíces ancestrales del Wayuunaiki. Metodología interactiva diseñada para aprender 100% sin conexión.',
    modulesTitle: 'Módulos y Lecciones',
    level: 'NIVEL',
    exerciseOf: (current, total) => `Ejercicio ${current} de ${total}`,
    culturalWisdom: 'Sabiduría Wayuu:',
    correctFeedback: '¡Excelente trabajo! ✨',
    wrongFeedback: '¡Casi! Sigue intentando 💪',
    continueBtn: 'Continuar',
    completedTitle: '¡Lección Completada! 🎉',
    completedMsg: (xp, title) => `Has ganado +${xp} XP por completar ${title}`,
    selectLanguage: 'Seleccionar Idioma',
    streakLabel: 'Racha',
    heartsLabel: 'Vidas',
    xpLabel: 'XP',
    closeBtn: 'Cerrar',
    heartsModalTitle: 'Tus Vidas de Aprendizaje',
    heartsModalDesc: 'Las vidas te permiten equivocarte en las lecciones interactivas. Se regenera 1 cada 30 min o puedes recargarlas ahora.',
    refillBtn: 'Recargar todas las vidas (5/5)',
    noHeartsTitle: '¡Te has quedado sin vidas!',
    noHeartsDesc: 'Necesitas al menos 1 vida para continuar aprendiendo.',
    streakModalTitle: 'Tu Racha Diaria',
    streakModalDesc: (streak) => `¡Llevas ${streak} día(s) consecutivos practicando! Completa una lección cada día para no perder tu racha.`,
    xpModalTitle: 'Tus Puntos de Experiencia (XP)',
    xpModalDesc: (xp) => `Has acumulado ${xp} XP en total. Ganas XP con cada respuesta correcta y lección completada.`,
    completedLessonBadge: 'Completada ✓',
    comingSoonTitle: 'Próximamente más lecciones',
    comingSoonDesc: '¡Has completado las lecciones actuales! Nuevos módulos interactivos, vocabulario conversacional y desafíos prácticos están en camino.',
    settingsTitle: 'Ajustes de la Plataforma',
    interfaceLangTitle: 'Idioma de la Interfaz',
    courseTracksTitle: 'Rutas de Aprendizaje (Cursos)',
    recommendedCourses: 'Cursos recomendados para ti',
    allCourses: 'Todos los cursos disponibles',
    activeCourseBadge: 'Ruta activa ✓',
  },
  en: {
    languageName: 'English',
    flag: '🇺🇸',
    ancestralPath: 'Bilingual Immersion · Intercultural',
    offlineDesc: 'Master English while exploring the ancestral roots of Wayuunaiki. Interactive methodology designed to learn 100% offline.',
    modulesTitle: 'Modules & Lessons',
    level: 'LEVEL',
    exerciseOf: (current, total) => `Exercise ${current} of ${total}`,
    culturalWisdom: 'Wayuu Wisdom:',
    correctFeedback: 'Great job! ✨',
    wrongFeedback: 'Almost there! Keep trying 💪',
    continueBtn: 'Continue',
    completedTitle: 'Lesson Completed! 🎉',
    completedMsg: (xp, title) => `You earned +${xp} XP for completing ${title}`,
    selectLanguage: 'Select Language',
    streakLabel: 'Streak',
    heartsLabel: 'Hearts',
    xpLabel: 'XP',
    closeBtn: 'Close',
    heartsModalTitle: 'Your Learning Hearts',
    heartsModalDesc: 'Hearts let you make mistakes in interactive exercises. 1 heart regenerates every 30 mins or you can refill right now.',
    refillBtn: 'Refill all hearts (5/5)',
    noHeartsTitle: 'Out of Hearts!',
    noHeartsDesc: 'You need at least 1 heart to practice interactive lessons.',
    streakModalTitle: 'Your Daily Streak',
    streakModalDesc: (streak) => `You have a ${streak} day(s) active streak! Practice at least one lesson each day to keep it alive.`,
    xpModalTitle: 'Experience Points (XP)',
    xpModalDesc: (xp) => `You have collected ${xp} XP so far. Keep practicing to earn more points!`,
    completedLessonBadge: 'Completed ✓',
    comingSoonTitle: 'More lessons coming soon',
    comingSoonDesc: 'You have finished all current lessons! Exciting new interactive modules, conversational vocabulary, and practical challenges are on the way.',
    settingsTitle: 'Platform Settings',
    interfaceLangTitle: 'Interface Language',
    courseTracksTitle: 'Learning Tracks (Courses)',
    recommendedCourses: 'Recommended courses for you',
    allCourses: 'All available courses',
    activeCourseBadge: 'Active track ✓',
  },
};
