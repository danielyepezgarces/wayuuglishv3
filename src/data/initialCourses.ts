import { Course } from '../types';

export const initialCourses: Course[] = [
  // 1. Wayuunaiki -> Inglés
  {
    id: 'course-wayuu-en',
    pair: 'wayuu-en',
    title: 'Wayuunaiki → English',
    sourceLang: 'Wayuunaiki',
    targetLang: 'English',
    sourceFlag: 'WAY',
    targetFlag: 'EN',
    authorName: 'Profe Rosa Epieyuu & Profe David Ipuana',
    collaborators: ['profe.rosa@wayuuglish.edu', 'profe.david@wayuuglish.edu'],
    modules: [
      {
        id: 'mod-we-1',
        title: 'Saludos y Cortesía (Greetings)',
        description: 'Aprende a saludar y presentarte en inglés desde el Wayuunaiki.',
        level: 1,
        iconName: 'hand',
        lessons: [
          {
            id: 'les-we-1-1',
            title: 'Jamaya pia: Hello & Welcome',
            description: 'Palabras básicas de encuentro',
            xpReward: 15,
            exercises: [
              {
                id: 'ex-we-1-1-1',
                type: 'choice',
                prompt: '¿Cómo se dice "Jamaya pia" en inglés?',
                instruction: 'Selecciona la traducción correcta',
                options: ['Hello, how are you?', 'Goodbye', 'Good night', 'Thank you'],
                correctSolution: 'Hello, how are you?',
                phoneticGuide: 'Jah-MAH-yah PEE-ah / Heh-LOH, how are you?',
                audioText: 'Hello, how are you?',
                audioLang: 'en',
                culturalNote: '"Jamaya pia" es el saludo tradicional de respeto y afecto en la cultura Wayuu.'
              },
              {
                id: 'ex-we-1-1-2',
                type: 'word-bank',
                prompt: 'Traduce al inglés: "Taya wayuu"',
                instruction: 'Ordena las palabras para formar la frase en inglés',
                wordBank: ['I', 'am', 'a', 'person', 'water', 'sun', 'hello'],
                correctSolution: 'I am a person',
                phoneticGuide: 'Tah-YAH wah-YOO',
                culturalNote: '"Wayuu" significa persona o gente del desierto.'
              },
              {
                id: 'ex-we-1-1-3',
                type: 'match',
                prompt: 'Une cada término en Wayuunaiki con su significado en inglés',
                instruction: 'Toca las parejas correspondientes',
                options: [
                  'Anas:Good',
                  'Jamaya:Hello',
                  'Anashii:Thank you',
                  'Katsin:Strong'
                ],
                correctSolution: 'Anas:Good,Jamaya:Hello,Anashii:Thank you,Katsin:Strong'
              },
              {
                id: 'ex-we-1-1-4',
                type: 'phonetic',
                prompt: 'Practica la pronunciación de: "Thank you"',
                instruction: 'Escucha atentamente la pronunciación y el desglose fonético',
                phoneticGuide: 'Wayuunaiki: Anashii | English: /θæŋk juː/ (Zenk-iu)',
                audioText: 'Thank you very much',
                audioLang: 'en',
                options: ['Thank you', 'See you soon', 'Welcome'],
                correctSolution: 'Thank you',
                culturalNote: 'En Wayuunaiki, "Anashii" o "Anasü ma\'i" expresa gratitud profunda y bienestar.'
              }
            ]
          },
          {
            id: 'les-we-1-2',
            title: 'Elementos Sagrados: Ka\'i & Wüin',
            description: 'El Sol, el Agua y la Tierra en inglés',
            xpReward: 20,
            exercises: [
              {
                id: 'ex-we-1-2-1',
                type: 'choice',
                prompt: '¿Qué significa "Wüin" en inglés?',
                instruction: 'El elemento más preciado de Wounmaincat (nuestra tierra)',
                options: ['Water', 'Sun', 'Wind', 'Sand'],
                correctSolution: 'Water',
                phoneticGuide: 'WÜ-in -> WAH-ter',
                audioText: 'Water',
                audioLang: 'en',
                culturalNote: 'Wüin (el agua) es vida y supervivencia sagrada en La Guajira.'
              },
              {
                id: 'ex-we-1-2-2',
                type: 'word-bank',
                prompt: 'Traduce: "The sun is warm" (Ka\'ikat kashuulenshi)',
                instruction: 'Ordena las palabras en inglés',
                wordBank: ['The', 'sun', 'is', 'warm', 'cold', 'night', 'moon'],
                correctSolution: 'The sun is warm',
                phoneticGuide: 'Ka\'i = Sun',
                audioText: 'The sun is warm',
                audioLang: 'en'
              },
              {
                id: 'ex-we-1-2-3',
                type: 'match',
                prompt: 'Relaciona la naturaleza Guajira con inglés',
                instruction: 'Une las parejas correctas',
                options: [
                  'Ka\'i:Sun',
                  'Kashí:Moon',
                  'Wüin:Water',
                  'Jasay:Sand'
                ],
                correctSolution: 'Ka\'i:Sun,Kashí:Moon,Wüin:Water,Jasay:Sand'
              }
            ]
          }
        ]
      },
      {
        id: 'mod-we-2',
        title: 'Cultura, Tejido y Familia (Weaving & Kinship)',
        description: 'Términos de la mochila Wayuu y los clanes en inglés.',
        level: 2,
        iconName: 'sparkles',
        lessons: [
          {
            id: 'les-we-2-1',
            title: 'Susu: The Sacred Mochila Bag',
            description: 'El arte del tejido tradicional',
            xpReward: 20,
            exercises: [
              {
                id: 'ex-we-2-1-1',
                type: 'choice',
                prompt: '¿Cómo explicarías "Susu" a un visitante angloparlante?',
                instruction: 'Selecciona la mejor descripción en inglés',
                options: ['Woven handbag', 'Desert hat', 'Clay pot', 'Leather sandal'],
                correctSolution: 'Woven handbag',
                culturalNote: 'La Susu es la mochila tradicional tejida con técnicas ancestrales transmitidas por Wale\'kerü (la araña tejedora).'
              },
              {
                id: 'ex-we-2-1-2',
                type: 'word-bank',
                prompt: 'Traduce al inglés: "My mother weaves"',
                instruction: 'Ordena las palabras en inglés',
                wordBank: ['My', 'mother', 'weaves', 'father', 'sings', 'reads'],
                correctSolution: 'My mother weaves',
                phoneticGuide: 'Tei ainjüsü susu / My mother weaves'
              }
            ]
          }
        ]
      }
    ]
  },

  // 2. Español -> Inglés
  {
    id: 'course-es-en',
    pair: 'es-en',
    title: 'Español → English',
    sourceLang: 'Español',
    targetLang: 'English',
    sourceFlag: 'ES',
    targetFlag: 'EN',
    authorName: 'Profe Carlos Redondo & Lic. Mariángel Pushaina',
    collaborators: ['carlos.redondo@wayuuglish.edu'],
    modules: [
      {
        id: 'mod-ee-1',
        title: 'Fundamentos del Idioma (Basics)',
        description: 'Construye tus primeras oraciones y diálogos en inglés.',
        level: 1,
        iconName: 'book',
        lessons: [
          {
            id: 'les-ee-1-1',
            title: 'Presentaciones y Saludos',
            description: 'Aprende a decir tu nombre y saludar formal e informalmente.',
            xpReward: 15,
            exercises: [
              {
                id: 'ex-ee-1-1-1',
                type: 'choice',
                prompt: '¿Cuál es la traducción de: "Mucho gusto en conocerte"?',
                instruction: 'Selecciona la opción correcta en inglés',
                options: ['Nice to meet you', 'See you later', 'Good evening', 'How old are you?'],
                correctSolution: 'Nice to meet you',
                phoneticGuide: '/naɪs tuː miːt juː/',
                audioText: 'Nice to meet you',
                audioLang: 'en'
              },
              {
                id: 'ex-ee-1-1-2',
                type: 'word-bank',
                prompt: 'Traduce: "Yo estudio en la escuela"',
                instruction: 'Organiza las palabras en inglés',
                wordBank: ['I', 'study', 'at', 'the', 'school', 'play', 'teacher'],
                correctSolution: 'I study at the school',
                audioText: 'I study at the school',
                audioLang: 'en'
              },
              {
                id: 'ex-ee-1-1-3',
                type: 'match',
                prompt: 'Une cada saludo con su significado',
                instruction: 'Toca las fichas para emparejar',
                options: [
                  'Good morning:Buenos días',
                  'Good afternoon:Buenas tardes',
                  'Good night:Buenas noches',
                  'See you tomorrow:Hasta mañana'
                ],
                correctSolution: 'Good morning:Buenos días,Good afternoon:Buenas tardes,Good night:Buenas noches,See you tomorrow:Hasta mañana'
              }
            ]
          },
          {
            id: 'les-ee-1-2',
            title: 'La Escuela y el Aprendizaje',
            description: 'Útiles, maestros y el salón de clases',
            xpReward: 20,
            exercises: [
              {
                id: 'ex-ee-1-2-1',
                type: 'choice',
                prompt: '¿Cómo se dice "Cuaderno" en inglés?',
                instruction: 'Selecciona la palabra correcta',
                options: ['Notebook', 'Pencil', 'Blackboard', 'Backpack'],
                correctSolution: 'Notebook',
                phoneticGuide: '/ˈnoʊtbʊk/',
                audioText: 'Notebook',
                audioLang: 'en'
              },
              {
                id: 'ex-ee-1-2-2',
                type: 'word-bank',
                prompt: 'Traduce: "The teacher speaks English"',
                instruction: 'Ordena la frase en español',
                wordBank: ['El', 'profesor', 'habla', 'inglés', 'escribe', 'la', 'libro'],
                correctSolution: 'El profesor habla inglés'
              }
            ]
          }
        ]
      }
    ]
  },

  // 3. English -> Wayuunaiki
  {
    id: 'course-en-wayuu',
    pair: 'en-wayuu',
    title: 'English → Wayuunaiki',
    sourceLang: 'English',
    targetLang: 'Wayuunaiki',
    sourceFlag: 'EN',
    targetFlag: 'WAY',
    authorName: 'Profe David Ipuana',
    collaborators: ['profe.david@wayuuglish.edu'],
    modules: [
      {
        id: 'mod-ew-1',
        title: 'Discover Wayuunaiki (Wounmain)',
        description: 'Learn foundational indigenous expressions and nature terms.',
        level: 1,
        iconName: 'compass',
        lessons: [
          {
            id: 'les-ew-1-1',
            title: 'First Words & Greetings',
            description: 'Pronunciation and meaning of basic Wayuu phrases',
            xpReward: 15,
            exercises: [
              {
                id: 'ex-ew-1-1-1',
                type: 'choice',
                prompt: 'How do you say "Hello" or "How are you" in Wayuunaiki?',
                instruction: 'Select the traditional greeting',
                options: ['Jamaya pia', 'Anashii', 'Katsin', 'Tei'],
                correctSolution: 'Jamaya pia',
                phoneticGuide: 'Jah-MAH-yah PEE-ah',
                audioText: 'Jamaya pia',
                audioLang: 'wayuu',
                culturalNote: 'In Wayuu culture, asking how someone is doing connects your spirits.'
              },
              {
                id: 'ex-ew-1-1-2',
                type: 'word-bank',
                prompt: 'Translate into Wayuunaiki: "Good day"',
                instruction: 'Tap the tiles in correct order',
                wordBank: ['Anas', 'ka\'i', 'wüin', 'kashí', 'pia'],
                correctSolution: 'Anas ka\'i',
                phoneticGuide: 'Ah-NAHS KAH-ee'
              },
              {
                id: 'ex-ew-1-1-3',
                type: 'match',
                prompt: 'Match English words with their Wayuunaiki equivalents',
                instruction: 'Pair the tiles',
                options: [
                  'Water:Wüin',
                  'Sun:Ka\'i',
                  'Moon:Kashí',
                  'Earth:Mma'
                ],
                correctSolution: 'Water:Wüin,Sun:Ka\'i,Moon:Kashí,Earth:Mma'
              }
            ]
          }
        ]
      }
    ]
  },

  // 4. Wayuunaiki -> Español
  {
    id: 'course-wayuu-es',
    pair: 'wayuu-es',
    title: 'Wayuunaiki → Español',
    sourceLang: 'Wayuunaiki',
    targetLang: 'Español',
    sourceFlag: 'WAY',
    targetFlag: 'ES',
    authorName: 'Colectivo Etnoeducativo Wayuu',
    collaborators: ['etno.guajira@wayuuglish.edu', 'profe.rosa@wayuuglish.edu'],
    modules: [
      {
        id: 'mod-wes-1',
        title: 'Puntos de Encuentro e Interculturalidad',
        description: 'Traducción y fortalecimiento del español desde la cosmovisión Wayuu.',
        level: 1,
        iconName: 'heart',
        lessons: [
          {
            id: 'les-wes-1-1',
            title: 'Vida en la Ranchería',
            description: 'Espacios comunitarios, la enramada y la familia',
            xpReward: 15,
            exercises: [
              {
                id: 'ex-wes-1-1-1',
                type: 'choice',
                prompt: '¿Qué es una "Luma" en la ranchería?',
                instruction: 'Selecciona el término en español',
                options: ['Enramada o techado de descanso', 'Pozo de agua profundo', 'Mochila pequeña', 'Horno de leña'],
                correctSolution: 'Enramada o techado de descanso',
                culturalNote: 'La Luma es el centro social de la ranchería, donde se conversa, se teje y se toman decisiones familiares.'
              },
              {
                id: 'ex-wes-1-1-2',
                type: 'word-bank',
                prompt: 'Traduce al español: "Taya wayuu anasü"',
                instruction: 'Ordena las palabras en español',
                wordBank: ['Yo', 'soy', 'una', 'buena', 'persona', 'agua', 'sol'],
                correctSolution: 'Yo soy una buena persona',
                phoneticGuide: 'Tah-yah wah-yoo ah-nah-sü'
              },
              {
                id: 'ex-wes-1-1-3',
                type: 'match',
                prompt: 'Empareja los lazos familiares Wayuu con el español',
                instruction: 'Toca las parejas correspondientes',
                options: [
                  'Tei:Mi madre',
                  'Tashi:Mi padre',
                  'Tachon:Mi hijo/hija',
                  'Apüshii:Familia o clan materno'
                ],
                correctSolution: 'Tei:Mi madre,Tashi:Mi padre,Tachon:Mi hijo/hija,Apüshii:Familia o clan materno'
              }
            ]
          }
        ]
      }
    ]
  }
];
