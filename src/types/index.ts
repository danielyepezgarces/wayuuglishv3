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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  classroomCode?: string;
  currentTrack: LanguagePair;
  streak: number;
  lastActiveDate: string;
  hearts: number;
  maxHearts: number;
  xp: number;
  gems: number;
  completedLessons: string[];
  joinedAt: string;
}

export interface SyncMutation {
  id: string;
  type: 'lesson_complete' | 'streak_update' | 'join_classroom' | 'course_update' | 'classroom_create';
  payload: Record<string, unknown>;
  timestamp: number;
  synced: boolean;
}
