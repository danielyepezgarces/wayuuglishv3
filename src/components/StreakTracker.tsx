import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../services/storageService';
import { sounds } from '../services/soundEffects';
import { notifications } from '../services/notificationService';
import {
  Flame,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Calendar,
  X,
  Target,
  AlertTriangle,
  Bell,
  BellRing,
  BellOff
} from 'lucide-react';

interface StreakTrackerProps {
  user: User;
  className?: string;
  onOpenProfileSettings?: () => void;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({
  user,
  className = '',
  onOpenProfileSettings
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(notifications.isEnabledByUser());
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    setPushEnabled(notifications.isEnabledByUser());
  }, [isOpen]);

  const todayStr = new Date().toISOString().split('T')[0];
  const targetXp = user.dailyGoalXp || 30;
  const currentTier = user.dailyGoalTier || 'regular';
  const earnedXpToday = user.xpEarnedToday ?? (user.lastActiveDate === todayStr ? 15 : 0);
  const isGoalReached = earnedXpToday >= targetXp;

  const handleToggle = () => {
    sounds.playPop();
    setIsOpen(!isOpen);
  };

  const handleSetTier = (tier: import('../types').DailyGoalIntensity) => {
    sounds.playPop();
    storage.setDailyGoalTier(tier);
  };

  const handleTogglePush = async () => {
    sounds.playPop();
    if (!pushEnabled) {
      const granted = await notifications.requestPermission();
      setPushEnabled(granted);
      if (granted) {
        notifications.scheduleNextReminder(user);
        notifications.sendStreakReminder(user);
      }
    } else {
      if (onOpenProfileSettings) {
        setIsOpen(false);
        onOpenProfileSettings();
      }
    }
  };

  const handleQuickTest = async () => {
    setTestSent(true);
    await notifications.sendTestNotification(user.streak);
    setTimeout(() => setTestSent(false), 3000);
  };

  // Generate current week days (Monday to Sunday)
  const getWeekDays = () => {
    const curr = new Date();
    // Monday is 1, Sunday is 0
    const dayOfWeek = curr.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(curr);
    monday.setDate(curr.getDate() - distanceToMonday);

    const days = [];
    const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const completedSet = new Set(user.completedDates || [todayStr]);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const isToday = iso === todayStr;
      const isPast = d < curr && !isToday;
      const isDone = completedSet.has(iso) || (isToday && isGoalReached);

      days.push({
        label: labels[i],
        dateStr: iso,
        isToday,
        isPast,
        isDone
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className={`relative ${className}`}>
      {/* --- HEADER STREAK TRIGGER BUTTON --- */}
      <button
        onClick={handleToggle}
        title={`${user.streak} días consecutivos. Haz clic para ver tu meta diaria.`}
        className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-200 select-none ${
          isGoalReached
            ? 'bg-amber-50 hover:bg-amber-100/80 border-amber-200/80 text-amber-700 shadow-xs'
            : 'bg-rose-50/70 hover:bg-rose-100/70 border-rose-200 text-rose-700 animate-pulse'
        }`}
      >
        <div className="relative">
          <Flame
            className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              isGoalReached
                ? 'fill-amber-500 text-amber-600'
                : 'fill-rose-500 text-rose-600'
            }`}
          />
          {/* Notification dot if daily goal is not reached yet */}
          {!isGoalReached && (
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-600 rounded-full border-2 border-white"
              title="Meta de hoy pendiente"
            />
          )}
        </div>

        <span className="font-mono font-extrabold text-sm tabular-nums">
          {user.streak}
        </span>
        <span className="text-xs font-semibold hidden lg:inline">
          {user.streak === 1 ? 'día' : 'días'}
        </span>

        {/* Quick Goal Status Pill */}
        <span
          className={`hidden sm:inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
            isGoalReached
              ? 'bg-amber-100 text-amber-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          {isGoalReached ? '✓ Meta' : '¡Hoy!'}
        </span>
      </button>

      {/* --- DAILY GOAL NOTIFICATION & STREAK MODAL / DROPDOWN --- */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-[340px] max-w-[90vw] bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 z-50 animate-fade-in">
            {/* Header: Title and Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm text-slate-900 leading-tight">
                    Racha de {user.streak} {user.streak === 1 ? 'Día' : 'Días'}
                  </h3>
                  <div className="text-[11px] text-slate-400">Progreso y constancia diaria</div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Daily Goal Notification Card */}
            <div
              className={`p-4 rounded-2xl mb-4 border transition-colors ${
                isGoalReached
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/90 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {isGoalReached ? (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 animate-spin" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wide">
                      {isGoalReached ? '¡Meta Diaria Alcanzada!' : 'Meta Diaria Pendiente'}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-amber-950">
                      {earnedXpToday}/{targetXp} XP
                    </span>
                  </div>

                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {isGoalReached
                      ? `¡Has alcanzado tu objetivo de ${targetXp} XP hoy! Tu racha de ${user.streak} días está protegida.`
                      : `Gana ${Math.max(0, targetXp - earnedXpToday)} XP más hoy para cumplir tu meta de ${targetXp} XP y proteger tu racha.`}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2.5 h-2 bg-white/70 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isGoalReached ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-rose-500'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((earnedXpToday / targetXp) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Calendar Strip */}
            <div className="mb-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Esta semana</span>
                <span className="text-slate-500 font-medium">Lunes - Domingo</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {weekDays.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center"
                    title={`${d.dateStr}: ${d.isDone ? 'Lección completada' : 'Sin completar'}`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 mb-1">
                      {d.label}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        d.isDone
                          ? 'bg-amber-500 text-white shadow-xs'
                          : d.isToday
                          ? 'border-2 border-dashed border-rose-500 text-rose-600 bg-rose-50/50'
                          : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      {d.isDone ? (
                        <Flame className="w-4 h-4 fill-white text-white" />
                      ) : d.isToday ? (
                        <span>●</span>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser Push Notification Streak Reminder Guard */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 mb-3 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    pushEnabled
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Avisos Push (Racha)</span>
                    {pushEnabled ? (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                        Activo
                      </span>
                    ) : (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {pushEnabled
                      ? `Alerta programada (${notifications.getReminderTime()})`
                      : 'Recuerda practicar antes de las 12 AM'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {pushEnabled ? (
                  <button
                    onClick={handleQuickTest}
                    title="Probar notificación ahora"
                    className="text-[11px] font-bold px-2 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition shadow-xs"
                  >
                    {testSent ? '✓ Probado' : 'Probar'}
                  </button>
                ) : (
                  <button
                    onClick={handleTogglePush}
                    className="text-[11px] font-bold px-2.5 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shadow-xs"
                  >
                    Activar
                  </button>
                )}
              </div>
            </div>

            {/* Cultural Motivational Tip */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 mb-4 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-[11px] text-slate-600 leading-snug">
                <strong className="text-slate-800">Consejo de Waraush:</strong> En Wayuu decimos <em>"Katsin ma'i pia"</em> (¡Eres fuerte!). Estudiar 5-15 minutos al día preserva las lenguas.
              </div>
            </div>

            {/* Adjust Daily Goal Preferences (Casual, Regular, Serious, Insane) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-rose-600" />
                  <span>Meta diaria (Nivel de intensidad):</span>
                </span>
                {onOpenProfileSettings && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenProfileSettings();
                    }}
                    className="text-[10px] text-rose-600 hover:underline font-bold"
                  >
                    Ver en Perfil
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-center">
                {[
                  { tier: 'casual', label: 'Casual', xp: '15 XP' },
                  { tier: 'regular', label: 'Regular', xp: '30 XP' },
                  { tier: 'serious', label: 'Serious', xp: '45 XP' },
                  { tier: 'insane', label: 'Insane', xp: '60 XP' }
                ].map((item) => (
                  <button
                    key={item.tier}
                    onClick={() => handleSetTier(item.tier as any)}
                    className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition flex items-center justify-between ${
                      currentTier === item.tier
                        ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">{item.xp}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
