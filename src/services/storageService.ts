import { Course, Classroom, User, SyncMutation, LanguagePair } from '../types';
import { initialCourses } from '../data/initialCourses';

const STORAGE_KEYS = {
  USER: 'wayuuglish_user_v1',
  COURSES: 'wayuuglish_courses_v1',
  CLASSROOMS: 'wayuuglish_classrooms_v1',
  SYNC_QUEUE: 'wayuuglish_sync_queue_v1',
  LAST_SYNC: 'wayuuglish_last_sync_v1',
  ALL_STUDENTS: 'wayuuglish_students_registry_v1'
};

const DEFAULT_STUDENT: User = {
  id: 'stu-101',
  name: 'Katia Uriana',
  email: 'katia.uriana@estudiante.edu',
  role: 'student',
  classroomCode: 'WAYUU-2026',
  currentTrack: 'wayuu-en',
  streak: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  hearts: 5,
  maxHearts: 5,
  xp: 140,
  gems: 45,
  completedLessons: ['les-we-1-1'],
  joinedAt: '2026-03-01'
};

const DEFAULT_TEACHER: User = {
  id: 'teach-201',
  name: 'Profe Rosa Epieyuu',
  email: 'rosa.epieyuu@wayuuglish.edu',
  role: 'teacher',
  classroomCode: 'WAYUU-2026',
  currentTrack: 'wayuu-en',
  streak: 14,
  lastActiveDate: new Date().toISOString().split('T')[0],
  hearts: 5,
  maxHearts: 5,
  xp: 450,
  gems: 180,
  completedLessons: ['les-we-1-1', 'les-we-1-2'],
  joinedAt: '2026-01-15'
};

const DEFAULT_CLASSROOMS: Classroom[] = [
  {
    id: 'class-1',
    code: 'WAYUU-2026',
    name: 'I.E. Indígena Rural No. 2 - Grado 6°A',
    courseId: 'course-wayuu-en',
    teacherId: 'teach-201',
    teacherName: 'Profe Rosa Epieyuu',
    coTeachers: [
      { name: 'Profe David Ipuana', email: 'profe.david@wayuuglish.edu' }
    ],
    studentIds: ['stu-101', 'stu-102', 'stu-103', 'stu-104'],
    createdAt: '2026-02-10'
  },
  {
    id: 'class-2',
    code: 'GUAJIRA-789',
    name: 'Semillero Bilingüe Wayuu - Uribia',
    courseId: 'course-es-en',
    teacherId: 'teach-201',
    teacherName: 'Profe Rosa Epieyuu',
    coTeachers: [],
    studentIds: ['stu-105', 'stu-106'],
    createdAt: '2026-02-28'
  }
];

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  classroomCode: string;
  streak: number;
  xp: number;
  completedLessonsCount: number;
  lastActive: string;
  synced: boolean;
}

const INITIAL_STUDENTS_ROSTER: StudentRecord[] = [
  {
    id: 'stu-101',
    name: 'Katia Uriana',
    email: 'katia.uriana@estudiante.edu',
    classroomCode: 'WAYUU-2026',
    streak: 5,
    xp: 140,
    completedLessonsCount: 1,
    lastActive: 'Hoy, hace 15 min',
    synced: true
  },
  {
    id: 'stu-102',
    name: 'Jhoan Pushaina',
    email: 'jhoan.pushaina@estudiante.edu',
    classroomCode: 'WAYUU-2026',
    streak: 8,
    xp: 260,
    completedLessonsCount: 2,
    lastActive: 'Hoy, hace 1 hora',
    synced: true
  },
  {
    id: 'stu-103',
    name: 'Saray Epinayu',
    email: 'saray.epinayu@estudiante.edu',
    classroomCode: 'WAYUU-2026',
    streak: 3,
    xp: 95,
    completedLessonsCount: 1,
    lastActive: 'Ayer',
    synced: true
  },
  {
    id: 'stu-104',
    name: 'Maikol Barros',
    email: 'maikol.b@estudiante.edu',
    classroomCode: 'WAYUU-2026',
    streak: 0,
    xp: 40,
    completedLessonsCount: 0,
    lastActive: 'Hace 3 días',
    synced: false
  },
  {
    id: 'stu-105',
    name: 'Dalia Jusayu',
    email: 'dalia.jusayu@estudiante.edu',
    classroomCode: 'GUAJIRA-789',
    streak: 11,
    xp: 380,
    completedLessonsCount: 3,
    lastActive: 'Hoy, hace 3 horas',
    synced: true
  }
];

class StorageService {
  private listeners: Set<() => void> = new Set();
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.triggerSync();
        this.notify();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notify();
      });
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // --- USER METHODS ---
  public getUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      this.setUser(DEFAULT_STUDENT);
      return DEFAULT_STUDENT;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_STUDENT;
    }
  }

  public setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    // Keep students roster in sync if current user is student
    if (user.role === 'student') {
      this.updateStudentRecord(user);
    }
    this.notify();
  }

  public switchRole(targetRole: 'student' | 'teacher'): User {
    const current = this.getUser();
    if (current.role === targetRole) return current;

    if (targetRole === 'teacher') {
      // Save student copy or switch to default teacher
      const updated: User = {
        ...DEFAULT_TEACHER,
        currentTrack: current.currentTrack
      };
      this.setUser(updated);
      return updated;
    } else {
      const updated: User = {
        ...DEFAULT_STUDENT,
        currentTrack: current.currentTrack
      };
      this.setUser(updated);
      return updated;
    }
  }

  public switchTrack(track: LanguagePair): void {
    const user = this.getUser();
    user.currentTrack = track;
    this.setUser(user);
  }

  // --- COURSES ---
  public getCourses(): Course[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(initialCourses));
      return initialCourses;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialCourses;
    }
  }

  public getCourseByPair(pair: LanguagePair): Course | undefined {
    const list = this.getCourses();
    return list.find((c) => c.pair === pair);
  }

  public saveCourse(course: Course): void {
    const list = this.getCourses();
    const idx = list.findIndex((c) => c.id === course.id);
    if (idx >= 0) {
      list[idx] = course;
    } else {
      list.push(course);
    }
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(list));
    this.enqueueMutation('course_update', { courseId: course.id, title: course.title });
    this.notify();
  }

  // --- CLASSROOMS ---
  public getClassrooms(): Classroom[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASSROOMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(DEFAULT_CLASSROOMS));
      return DEFAULT_CLASSROOMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_CLASSROOMS;
    }
  }

  public createClassroom(name: string, courseId: string, teacher: User): Classroom {
    const classrooms = this.getClassrooms();
    const cleanPrefix = name.slice(0, 5).toUpperCase().replace(/[^A-Z]/g, 'WAYUU');
    const randomNum = Math.floor(100 + Math.random() * 900);
    const code = `${cleanPrefix || 'AULA'}-${randomNum}`;

    const newClass: Classroom = {
      id: `class-${Date.now()}`,
      code,
      name,
      courseId,
      teacherId: teacher.id,
      teacherName: teacher.name,
      coTeachers: [],
      studentIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    classrooms.push(newClass);
    localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(classrooms));
    this.enqueueMutation('classroom_create', { classroomId: newClass.id, code: newClass.code });
    this.notify();
    return newClass;
  }

  public addCoTeacher(classroomId: string, email: string, name: string): boolean {
    const classrooms = this.getClassrooms();
    const found = classrooms.find((c) => c.id === classroomId);
    if (!found) return false;

    if (!found.coTeachers.some((ct) => ct.email === email)) {
      found.coTeachers.push({ email, name });
      localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(classrooms));

      // Also add collaborator to the corresponding course
      const courses = this.getCourses();
      const course = courses.find((c) => c.id === found.courseId);
      if (course) {
        if (!course.collaborators) course.collaborators = [];
        if (!course.collaborators.includes(email)) {
          course.collaborators.push(email);
          this.saveCourse(course);
        }
      }

      this.notify();
      return true;
    }
    return false;
  }

  public joinClassroomByCode(code: string): { success: boolean; message: string; classroom?: Classroom } {
    const classrooms = this.getClassrooms();
    const normalized = code.trim().toUpperCase();
    const found = classrooms.find((c) => c.code.toUpperCase() === normalized);

    if (!found) {
      return { success: false, message: 'Código de aula no encontrado. Verifica con tu docente.' };
    }

    const user = this.getUser();
    user.classroomCode = found.code;
    this.setUser(user);

    if (!found.studentIds.includes(user.id)) {
      found.studentIds.push(user.id);
      localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(classrooms));
    }

    this.enqueueMutation('join_classroom', { classroomId: found.id, studentId: user.id, code: found.code });
    return { success: true, message: `¡Te has unido exitosamente a "${found.name}"!`, classroom: found };
  }

  // --- STUDENT ROSTER TRACKING ---
  public getStudentsRoster(classroomCode?: string): StudentRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ALL_STUDENTS);
    let roster: StudentRecord[] = INITIAL_STUDENTS_ROSTER;
    if (raw) {
      try {
        roster = JSON.parse(raw);
      } catch {
        roster = INITIAL_STUDENTS_ROSTER;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.ALL_STUDENTS, JSON.stringify(INITIAL_STUDENTS_ROSTER));
    }

    if (classroomCode) {
      return roster.filter((s) => s.classroomCode.toUpperCase() === classroomCode.toUpperCase());
    }
    return roster;
  }

  private updateStudentRecord(user: User): void {
    const roster = this.getStudentsRoster();
    const idx = roster.findIndex((s) => s.id === user.id);
    const updatedRecord: StudentRecord = {
      id: user.id,
      name: user.name,
      email: user.email,
      classroomCode: user.classroomCode || 'LIBRE',
      streak: user.streak,
      xp: user.xp,
      completedLessonsCount: user.completedLessons.length,
      lastActive: 'En este momento',
      synced: this.isOnline
    };

    if (idx >= 0) {
      roster[idx] = updatedRecord;
    } else {
      roster.unshift(updatedRecord);
    }
    localStorage.setItem(STORAGE_KEYS.ALL_STUDENTS, JSON.stringify(roster));
  }

  // --- LESSON PROGRESS & STREAKS ---
  public completeLesson(lessonId: string, xpReward: number): { xpGained: number; newStreak: number; newTotalXp: number } {
    const user = this.getUser();
    if (!user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId);
    }

    user.xp += xpReward;
    user.gems += 5;

    // Streak logic: check if last active was yesterday or earlier today
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== today) {
      user.streak += 1;
      user.lastActiveDate = today;
    }

    this.setUser(user);
    this.enqueueMutation('lesson_complete', {
      lessonId,
      xpReward,
      userId: user.id,
      streak: user.streak
    });

    return {
      xpGained: xpReward,
      newStreak: user.streak,
      newTotalXp: user.xp
    };
  }

  public deductHeart(): number {
    const user = this.getUser();
    if (user.hearts > 0) {
      user.hearts -= 1;
      this.setUser(user);
    }
    return user.hearts;
  }

  public refillHearts(): void {
    const user = this.getUser();
    user.hearts = user.maxHearts;
    this.setUser(user);
  }

  // --- OFFLINE SYNC ENGINE ---
  public getSyncQueue(): SyncMutation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private enqueueMutation(type: SyncMutation['type'], payload: Record<string, unknown>): void {
    const queue = this.getSyncQueue();
    const mutation: SyncMutation = {
      id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      payload,
      timestamp: Date.now(),
      synced: false
    };
    queue.push(mutation);
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));

    if (this.isOnline) {
      this.triggerSync();
    }
    this.notify();
  }

  public triggerSync(): Promise<{ syncedCount: number }> {
    return new Promise((resolve) => {
      const queue = this.getSyncQueue();
      if (queue.length === 0) {
        resolve({ syncedCount: 0 });
        return;
      }

      // Simulate network request commit
      setTimeout(() => {
        const count = queue.length;
        localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toLocaleTimeString());

        // Update roster sync badges
        const roster = this.getStudentsRoster();
        const updated = roster.map((s) => ({ ...s, synced: true }));
        localStorage.setItem(STORAGE_KEYS.ALL_STUDENTS, JSON.stringify(updated));

        this.notify();
        resolve({ syncedCount: count });
      }, 700);
    });
  }

  public getLastSyncTime(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || 'Sincronizado recientemente';
  }
}

export const storage = new StorageService();
