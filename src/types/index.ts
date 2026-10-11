export type LanguagePair = 'wayuu-en' | 'es-en' | 'en-wayuu' | 'wayuu-es';

export type UserRole = 'student' | 'teacher';

export type ExerciseType = 'word-bank' | 'match' | 'choice' | 'translate' | 'phonetic';

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  instruction: string;
  options?: string[];
  wordBank?: string[];
  correctSolution: string | string[];
  phoneticGuide?: string;
  audioText?: string;
  audioLang?: string;
  culturalNote?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  exercises: Exercise[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  level: number;
  iconName?: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  pair: LanguagePair;
  title: string;
  sourceLang: string;
  targetLang: string;
  sourceFlag: string;
  targetFlag: string;
  modules: Module[];
  createdBy?: string;
  authorName?: string;
  collaborators?: string[]; // IDs or emails of co-teachers
}

export interface Classroom {
  id: string;
  code: string;
  name: string;
  courseId: string;
  teacherId: string;
  teacherName: string;
  coTeachers: { email: string; name: string }[];
  studentIds: string[];
  createdAt: string;
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  completedLessonIds: string[];
  accuracy: number;
  totalAnswered: number;
  totalCorrect: number;
  lastActive: string;
  synced: boolean;
}

export type DailyGoalIntensity = 'casual' | 'regular' | 'serious' | 'insane';

export type KanasuPattern =
  | 'kanasu-molokonoutaya'
  | 'kanasu-pasuatalooshi'
  | 'kanasu-pulikeruya'
  | 'kanasu-triangles'
  | 'stripes'
  | 'plain';

export type CardinalAccessory =
  | 'mochila'
  | 'sombrero-wayuu'
  | 'tumuma-necklace'
  | 'feather-crest'
  | 'none';

export type CardinalExpression = 'cheerful' | 'focused' | 'proud' | 'curious';

export interface CardinalAvatarConfig {
  id: string;
  name: string;
  description?: string;
  bodyColor: string;
  crestColor: string;
  beakColor: string;
  chestPattern: KanasuPattern;
  patternColorPrimary: string;
  patternColorSecondary: string;
  accessory: CardinalAccessory;
  eyeExpression: CardinalExpression;
  borderPalette: string;
  isCustomGenerated?: boolean;
  customDataUrl?: string;
  seed?: string;
}

export interface DailyActivityRecord {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Lun 5", "Mar 6"
  dayName: string; // "Lunes", "Martes", etc.
  lessonsCompleted: number;
  xpEarned: number;
  dailyGoalXp: number;
  goalReached: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: CardinalAvatarConfig | string;
  classroomCode?: string;
  currentTrack: LanguagePair;
  streak: number;
  lastActiveDate: string;
  dailyGoal: number;
  dailyGoalTier: DailyGoalIntensity;
  dailyGoalXp: number;
  xpEarnedToday: number;
  lessonsCompletedToday: number;
  completedDates?: string[];
  weeklyHistory?: DailyActivityRecord[];
  hearts: number;
  maxHearts: number;
  xp: number;
  gems: number;
  completedLessons: string[];
  joinedAt: string;
  isAnonymous?: boolean;
}

export interface SyncMutation {
  id: string;
  type: 'lesson_complete' | 'streak_update' | 'join_classroom' | 'course_update' | 'classroom_create';
  payload: Record<string, unknown>;
  timestamp: number;
  synced: boolean;
}
