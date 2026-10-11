import { User } from '../types';
import { sounds } from './soundEffects';

const NOTIF_STORAGE_KEY = 'wayuuglish_push_notifications_enabled_v1';
const REMINDER_TIME_KEY = 'wayuuglish_push_reminder_time_v1';
const LAST_NOTIF_DATE_KEY = 'wayuuglish_last_notif_date_v1';

class NotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private isInitialized = false;
  private checkIntervalId: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initServiceWorker();
      this.startBackgroundWatcher();
    }
  }

  // Register Service Worker for offline handling and Push API
  public async initServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      this.swRegistration = reg;
      this.isInitialized = true;
      return reg;
    } catch {
      // In restricted environments or if SW cannot be registered
      return null;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public isEnabledByUser(): boolean {
    if (!this.isSupported()) return false;
    const pref = localStorage.getItem(NOTIF_STORAGE_KEY);
    return Notification.permission === 'granted' && pref === 'true';
  }

  public getReminderTime(): string {
    return localStorage.getItem(REMINDER_TIME_KEY) || '19:00'; // Default 7:00 PM
  }

  public setReminderTime(time: string, user?: User): void {
    localStorage.setItem(REMINDER_TIME_KEY, time);
    if (user && this.isEnabledByUser()) {
      this.scheduleNextReminder(user);
    }
  }

  // Request browser permission and configure push notification settings
  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        localStorage.setItem(NOTIF_STORAGE_KEY, 'true');
        sounds.playCorrect();

        // Also attempt PushManager subscription if available
        if (this.swRegistration && 'pushManager' in this.swRegistration) {
          try {
            await this.swRegistration.pushManager.getSubscription();
          } catch {
            // Push manager not bound to external server, local SW handles it
          }
        }
        return true;
      } else {
        localStorage.setItem(NOTIF_STORAGE_KEY, 'false');
        return false;
      }
    } catch {
      return false;
    }
  }

  public setEnabled(enabled: boolean, user?: User): void {
    localStorage.setItem(NOTIF_STORAGE_KEY, enabled ? 'true' : 'false');
    if (enabled && user) {
      this.scheduleNextReminder(user);
    }
  }

  // Send immediate notification via ServiceWorker or window.Notification
  public async sendNotification(title: string, options: NotificationOptions = {}): Promise<boolean> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    const defaultOptions: any = {
      icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="48" fill="%23E11D48"/%3E%3Cpolygon points="50,15 62,35 38,35" fill="%23BE123C"/%3E%3Ccircle cx="50" cy="55" r="30" fill="%23EF4444"/%3E%3Cpolygon points="65,55 90,60 65,68" fill="%23F59E0B"/%3E%3C/svg%3E',
      badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="48" fill="%23E11D48"/%3E%3C/svg%3E',
      vibrate: [200, 100, 200],
      tag: 'wayuuglish-streak-alert',
      renotify: true,
      ...options
    };

    // 1. Try via active Service Worker registration (works offline & in background)
    if (this.swRegistration && 'showNotification' in this.swRegistration) {
      try {
        await this.swRegistration.showNotification(title, defaultOptions);
        return true;
      } catch {
        // Fallback to in-page Notification
      }
    }

    // 2. Direct Window Notification fallback
    try {
      new Notification(title, defaultOptions);
      return true;
    } catch {
      return false;
    }
  }

  // Schedule background reminder via ServiceWorker message or timer
  public scheduleNextReminder(user: User): void {
    if (!this.isEnabledByUser()) return;

    const reminderTime = this.getReminderTime();
    const [targetHour, targetMinute] = reminderTime.split(':').map(Number);

    const now = new Date();
    const target = new Date();
    target.setHours(targetHour, targetMinute, 0, 0);

    // If target has passed today, schedule for tomorrow
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    const delayMs = target.getTime() - now.getTime();

    // Notify service worker so it can schedule a background alarm
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_STREAK_REMINDER',
        delayMs: Math.min(delayMs, 2147483647), // Safe 32-bit int
        streak: user.streak,
        title: `¡Tu racha de ${user.streak} días está en juego! 🔥`,
        body: `Recuerda practicar hoy tus módulos en Wayuuglish para alcanzar tu meta diaria.`
      });
    }
  }

  // Periodic watcher while app or tab is active in foreground/background
  private startBackgroundWatcher(): void {
    if (typeof window === 'undefined') return;

    // Check every 15 minutes
    this.checkIntervalId = window.setInterval(() => {
      this.checkAndTriggerDailyReminder();
    }, 15 * 60 * 1000);
  }

  public checkAndTriggerDailyReminder(): void {
    if (!this.isEnabledByUser()) return;

    const userRaw = localStorage.getItem('wayuuglish_user_v1');
    if (!userRaw) return;

    try {
      const user: User = JSON.parse(userRaw);
      const todayStr = new Date().toISOString().split('T')[0];
      const lastNotifDate = localStorage.getItem(LAST_NOTIF_DATE_KEY);

      // Only notify once per calendar day
      if (lastNotifDate === todayStr) return;

      const reminderTime = this.getReminderTime();
      const [hour, minute] = reminderTime.split(':').map(Number);
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const targetMinutes = hour * 60 + minute;

      // If we are at or past reminder time and goal is not met
      const targetXp = user.dailyGoalXp || 30;
      const earnedXp = user.xpEarnedToday ?? (user.lastActiveDate === todayStr ? 15 : 0);

      if (currentMinutes >= targetMinutes && earnedXp < targetXp) {
        localStorage.setItem(LAST_NOTIF_DATE_KEY, todayStr);
        this.sendStreakReminder(user);
      }
    } catch {
      // Ignore JSON error
    }
  }

  // Send contextual streak & daily goal reminder
  public async sendStreakReminder(user: User): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    const targetXp = user.dailyGoalXp || 30;
    const earnedXp = user.xpEarnedToday ?? (user.lastActiveDate === today ? 15 : 0);
    const isGoalReached = earnedXp >= targetXp;

    if (!isGoalReached) {
      const remainingXp = Math.max(0, targetXp - earnedXp);
      return this.sendNotification(`¡Tu racha de ${user.streak} días está en juego! 🔥`, {
        body: `Te faltan ${remainingXp} XP para cumplir tu meta diaria de hoy en Wayuuglish. ¡Waraush te acompaña!`,
        data: { url: '/' }
      });
    } else {
      return this.sendNotification(`¡Meta de hoy cumplida! 🎉`, {
        body: `Llevas ${user.streak} días consecutivos de racha. ¡Gran disciplina en Wayuunaiki e Inglés!`,
        data: { url: '/' }
      });
    }
  }

  // Trigger test notification
  public async sendTestNotification(streak: number = 5): Promise<boolean> {
    sounds.playPop();
    return this.sendNotification(`Wayuuglish: ¡Alerta de Racha! 🔥`, {
      body: `¡Hola! Waraush te recuerda que tu racha de ${streak} días está activa. Mantén encendido tu aprendizaje.`,
      data: { url: '/' }
    });
  }
}

export const notifications = new NotificationService();
