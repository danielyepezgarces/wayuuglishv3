import { Course, Module, Lesson, Exercise } from '../types';
import { UILanguage } from './translations';

interface TextOverride {
  title?: string;
  description?: string;
  prompt?: string;
  instruction?: string;
  culturalNote?: string;
}

const WAYUU_OVERRIDES: Record<string, TextOverride> = {
  // Course
  'course-wayuu-en': {
    title: 'Wayuunaiki → Alijuniki (English)',
    description: 'Ekirajawaa alijuniki sünainje pütchi wayuunaiki nojoishi choujain internet.',
  },
  // Modules
  'mod-we-1': {
    title: 'Anaa Akua\'ipa jee Jamaya Pia (Greetings)',
    description: 'Ekirajawaa sünain anaa akua\'ipa jee jamaya pia sünain alijuniki.',
  },
  'mod-we-2': {
    title: 'Akuwa\'ipaa, Ainjia Susu jee Apüshii (Weaving & Kinship)',
    description: 'Pütchikalüirua süpüla susu wayuu jee apüshiikana sünain alijuniki.',
  },
  // Lessons
  'les-we-1-1': {
    title: 'Jamaya pia: Hello & Welcome',
    description: 'Pütchi anasü süpüla antiraa',
  },
  'les-we-1-2': {
    title: 'Kasa Naata: Ka\'i & Wüin',
    description: 'Ka\'ikat, Wüin jee Mma sünain alijuniki',
  },
  'les-we-2-1': {
    title: 'Susu: The Sacred Mochila Bag',
    description: 'Ainjia susu anasü süpüla laülayuu',
  },
  // Exercises
  'ex-we-1-1-1': {
    prompt: '¿Jamüshii sümüin "Jamaya pia" sünain alijuniki?',
    instruction: 'Aaneeka tü pütchi lotusükat',
    culturalNote: 'Tü pütchika "Jamaya pia" shia tü anaaka akua\'ipa laülaayuukalüirua.',
  },
  'ex-we-1-1-2': {
    prompt: 'Alijunirra: "Taya wayuu"',
    instruction: 'Apatülaa pütchikalüirua sünain alijuniki',
    culturalNote: '"Wayuu" shia tü wayuukana eekalü chaa Wounmainpat.',
  },
  'ex-we-1-1-3': {
    prompt: 'Apatülaa pütchi Wayuunaiki sümaa Alijuniki',
    instruction: 'Aaneeka piamaleein tü pütchikalüirua',
  },
  'ex-we-1-1-4': {
    prompt: 'Aashajawaa tü pütchika: "Thank you"',
    instruction: 'Aapajaa anainmüin tü aashajawaaka',
    culturalNote: 'Sünain Wayuunaiki, "Anashii" shia pütchi anasü süpüla talataa.',
  },
  'ex-we-1-2-1': {
    prompt: '¿Kasa sümüin "Wüin" sünain alijuniki?',
    instruction: 'Tü kasa anasükat chaa Wounmainpat',
    culturalNote: 'Wüin shia tü kataakalü o\'u chaa palaairuku.',
  },
  'ex-we-1-2-2': {
    prompt: 'Alijunirra: "Ka\'ikat kashuulenshi" (The sun is warm)',
    instruction: 'Apatülaa pütchikalüirua sünain alijuniki',
  },
  'ex-we-1-2-3': {
    prompt: 'Apatülaa tü kasakalüirua sümaa Alijuniki',
    instruction: 'Aaneeka piamaleein tü pütchikalüirua',
  },
  'ex-we-2-1-1': {
    prompt: '¿Jamüin päkujain "Susu" sümüin alijunakat?',
    instruction: 'Aaneeka tü pütchi lotusükat',
    culturalNote: 'Tü Susuka shia ainjünaka sutuma Wale\'kerü.',
  },
  'ex-we-2-1-2': {
    prompt: 'Alijunirra: "Tei ainjüsü susu" (My mother weaves)',
    instruction: 'Apatülaa pütchikalüirua sünain alijuniki',
  },
};

const ENGLISH_OVERRIDES: Record<string, TextOverride> = {
  'course-wayuu-en': {
    title: 'Wayuunaiki → English',
    description: 'Learn English from Wayuunaiki 100% offline.',
  },
  'mod-we-1': {
    title: 'Greetings & Politeness',
    description: 'Learn how to greet and introduce yourself in English.',
  },
  'mod-we-2': {
    title: 'Culture, Weaving & Clan Kinship',
    description: 'Vocabulary for the Wayuu woven mochila bag and clans in English.',
  },
  'les-we-1-1': {
    title: 'Jamaya pia: Hello & Welcome',
    description: 'Essential greeting expressions',
  },
  'les-we-1-2': {
    title: 'Sacred Elements: Ka\'i & Wüin',
    description: 'The Sun, Water, and Land in English',
  },
  'les-we-2-1': {
    title: 'Susu: The Sacred Mochila Bag',
    description: 'The ancient art of traditional weaving',
  },
  'ex-we-1-1-1': {
    prompt: 'How do you say "Jamaya pia" in English?',
    instruction: 'Select the correct translation',
    culturalNote: '"Jamaya pia" is the traditional greeting of respect and affection in Wayuu culture.',
  },
  'ex-we-1-1-2': {
    prompt: 'Translate to English: "Taya wayuu"',
    instruction: 'Arrange words to build the English sentence',
    culturalNote: '"Wayuu" means person or people of the desert.',
  },
  'ex-we-1-1-3': {
    prompt: 'Match Wayuunaiki terms with English meanings',
    instruction: 'Tap the matching pairs',
  },
  'ex-we-1-1-4': {
    prompt: 'Practice pronouncing: "Thank you"',
    instruction: 'Listen carefully to the pronunciation and phonetic guide',
  },
  'ex-we-1-2-1': {
    prompt: 'What does "Wüin" mean in English?',
    instruction: 'The most sacred element of the Guajira desert',
    culturalNote: 'Wüin (water) represents sacred life and endurance in La Guajira.',
  },
  'ex-we-1-2-2': {
    prompt: 'Translate: "The sun is warm" (Ka\'ikat kashuulenshi)',
    instruction: 'Order the words in English',
  },
  'ex-we-1-2-3': {
    prompt: 'Match nature elements with English',
    instruction: 'Connect the corresponding pairs',
  },
  'ex-we-2-1-1': {
    prompt: 'How would you describe "Susu" to an English speaker?',
    instruction: 'Choose the most accurate description',
    culturalNote: 'The Susu is the sacred handbag woven through techniques taught by Wale\'kerü (the mythological spider).',
  },
  'ex-we-2-1-2': {
    prompt: 'Translate to English: "My mother weaves"',
    instruction: 'Arrange words into the correct order',
  },
};

export function getLocalizedCourse(baseCourse: Course, lang: UILanguage): Course {
  if (lang === 'es') {
    return baseCourse;
  }

  const overrides = lang === 'guc' ? WAYUU_OVERRIDES : ENGLISH_OVERRIDES;

  const courseOverride = overrides[baseCourse.id];
  const localizedTitle = courseOverride?.title || baseCourse.title;

  const localizedModules: Module[] = baseCourse.modules.map((mod) => {
    const modOverride = overrides[mod.id];
    const modTitle = modOverride?.title || mod.title;
    const modDesc = modOverride?.description || mod.description;

    const localizedLessons: Lesson[] = mod.lessons.map((les) => {
      const lesOverride = overrides[les.id];
      const lesTitle = lesOverride?.title || les.title;
      const lesDesc = lesOverride?.description || les.description;

      const localizedExercises: Exercise[] = les.exercises.map((ex) => {
        const exOverride = overrides[ex.id];
        return {
          ...ex,
          prompt: exOverride?.prompt || ex.prompt,
          instruction: exOverride?.instruction || ex.instruction,
          culturalNote: exOverride?.culturalNote || ex.culturalNote,
        };
      });

      return {
        ...les,
        title: lesTitle,
        description: lesDesc,
        exercises: localizedExercises,
      };
    });

    return {
      ...mod,
      title: modTitle,
      description: modDesc,
      lessons: localizedLessons,
    };
  });

  return {
    ...baseCourse,
    title: localizedTitle,
    modules: localizedModules,
  };
}
