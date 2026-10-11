import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@wayuuglish_user_stats';
const MAX_HEARTS = 5;
const HEART_REGEN_MINUTES = 30;

export interface UserStats {
  xp: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  activeDates: string[]; // YYYY-MM-DD history
  completedLessons: string[];
  heartsLastUpdatedAt: number; // timestamp
  currentCourseId: string;
  interfaceLanguage: 'guc' | 'es' | 'en';
}

const DEFAULT_STATS: UserStats = {
  xp: 0,
  hearts: 5,
  maxHearts: MAX_HEARTS,
  streak: 0,
  lastActiveDate: null,
  activeDates: [],
  completedLessons: [],
  heartsLastUpdatedAt: Date.now(),
  currentCourseId: 'course-wayuu-en',
  interfaceLanguage: 'guc',
};

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

class ProgressService {
  private stats: UserStats = { ...DEFAULT_STATS };
  private listeners: Array<(stats: UserStats) => void> = [];

  constructor() {
    this.loadStats();
  }

  public subscribe(fn: (stats: UserStats) => void): () => void {
    this.listeners.push(fn);
    fn(this.stats);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn({ ...this.stats }));
    this.saveStats();
  }

  public async loadStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as UserStats;
        this.stats = {
          ...DEFAULT_STATS,
          ...parsed,
          maxHearts: MAX_HEARTS,
        };
        this.checkHeartsRegen();
      } else {
        this.stats = { ...DEFAULT_STATS };
      }
    } catch {
      this.stats = { ...DEFAULT_STATS };
    }
    this.notify();
    return this.stats;
  }

  private async saveStats() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.stats));
    } catch (e) {
      console.warn('Error saving stats to AsyncStorage:', e);
    }
  }

  public getStats(): UserStats {
    return { ...this.stats };
  }

  public checkHeartsRegen() {
    if (this.stats.hearts >= MAX_HEARTS) {
      this.stats.heartsLastUpdatedAt = Date.now();
      return;
    }

    const elapsedMs = Date.now() - (this.stats.heartsLastUpdatedAt || Date.now());
    const regenMs = HEART_REGEN_MINUTES * 60 * 1000;
    const heartsToRegen = Math.floor(elapsedMs / regenMs);

    if (heartsToRegen > 0) {
      this.stats.hearts = Math.min(MAX_HEARTS, this.stats.hearts + heartsToRegen);
      this.stats.heartsLastUpdatedAt = Date.now() - (elapsedMs % regenMs);
      this.notify();
    }
  }

  public addXp(amount: number) {
    this.stats.xp = Math.max(0, this.stats.xp + amount);
    this.notify();
  }

  public deductHeart(): boolean {
    if (this.stats.hearts <= 0) {
      return false;
    }
    if (this.stats.hearts === MAX_HEARTS) {
      this.stats.heartsLastUpdatedAt = Date.now();
    }
    this.stats.hearts = Math.max(0, this.stats.hearts - 1);
    this.notify();
    return true;
  }

  public refillHearts() {
    this.stats.hearts = MAX_HEARTS;
    this.stats.heartsLastUpdatedAt = Date.now();
    this.notify();
  }

  public setCourseId(courseId: string) {
    this.stats.currentCourseId = courseId;
    this.notify();
  }

  public setInterfaceLanguage(lang: 'guc' | 'es' | 'en') {
    this.stats.interfaceLanguage = lang;
    this.notify();
  }

  public recordCompletedLesson(lessonId: string, xpReward: number): {
    streakIncreased: boolean;
    currentStreak: number;
    newXp: number;
  } {
    // 1. Add XP
    this.stats.xp += xpReward;

    // 2. Mark lesson as completed
    if (!this.stats.completedLessons.includes(lessonId)) {
      this.stats.completedLessons = [...this.stats.completedLessons, lessonId];
    }

    // 3. Record active date
    const today = getTodayString();
    if (!this.stats.activeDates) {
      this.stats.activeDates = [];
    }
    if (!this.stats.activeDates.includes(today)) {
      this.stats.activeDates = [...this.stats.activeDates, today];
    }

    // 4. Streak calculation
    const yesterday = getYesterdayString();
    let streakIncreased = false;

    if (!this.stats.lastActiveDate) {
      this.stats.streak = 1;
      this.stats.lastActiveDate = today;
      streakIncreased = true;
    } else if (this.stats.lastActiveDate === today) {
      // Already completed a lesson today, streak maintained
      streakIncreased = false;
    } else if (this.stats.lastActiveDate === yesterday) {
      // Perfect consecutive day!
      this.stats.streak += 1;
      this.stats.lastActiveDate = today;
      streakIncreased = true;
    } else {
      // Missed one or more days, restart streak at 1
      this.stats.streak = 1;
      this.stats.lastActiveDate = today;
      streakIncreased = true;
    }

    this.notify();

    return {
      streakIncreased,
      currentStreak: this.stats.streak,
      newXp: this.stats.xp,
    };
  }
}

export const progressService = new ProgressService();
