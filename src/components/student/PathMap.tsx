import React, { useState, useEffect } from 'react';
import { Course, Lesson, User, Module } from '../../types';
import { MascotWaraush } from '../MascotWaraush';
import { sounds } from '../../services/soundEffects';
import { notifications } from '../../services/notificationService';
import {
  Check,
  Star,
  Lock,
  Play,
  BookOpen,
  Award,
  Sparkles,
  ChevronRight,
  Flame,
  Info,
  BellRing,
  X
} from 'lucide-react';

import { WeeklyActivity } from './WeeklyActivity';

interface PathMapProps {
  course: Course;
  user: User;
  onStartLesson: (lesson: Lesson, moduleTitle: string) => void;
  onOpenJoinModal: () => void;
  onOpenProfileModal?: () => void;
}

export const PathMap: React.FC<PathMapProps> = ({
  course,
  user,
  onStartLesson,
  onOpenJoinModal,
  onOpenProfileModal
}) => {
  const [selectedLesson, setSelectedLesson] = useState<{ lesson: Lesson; module: Module } | null>(null);
  const [pushEnabled, setPushEnabled] = useState(notifications.isEnabledByUser());
  const [showPushBanner, setShowPushBanner] = useState(!notifications.isEnabledByUser());

  useEffect(() => {
    setPushEnabled(notifications.isEnabledByUser());
  }, []);

  // Determine which lessons are completed, active, and locked
  const isLessonCompleted = (lessonId: string) => user.completedLessons.includes(lessonId);

  // Find the first uncompleted lesson as the "current active" one
  let foundActive = false;

  const handleNodeClick = (lesson: Lesson, module: Module, isUnlocked: boolean) => {
    sounds.playPop();
    if (!isUnlocked) return;
    setSelectedLesson({ lesson, module });
  };

  const handleEnablePushFromBanner = async () => {
    sounds.playPop();
    const granted = await notifications.requestPermission();
    if (granted) {
      setPushEnabled(true);
      setShowPushBanner(false);
      notifications.scheduleNextReminder(user);
      notifications.sendStreakReminder(user);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner: Cultural & Learning Track Overview */}
      <div className="relative mb-8 p-6 rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white shadow-lg overflow-hidden">
        {/* Subtle decorative geometric overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-3">
              <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold bg-white/25 px-2 py-0.5 rounded-md">
                <i className="fa-solid fa-earth-americas text-amber-200 text-[10px]"></i>
                <span>{course.sourceLang}</span>
                <i className="fa-solid fa-arrow-right text-[8px] text-white/80"></i>
                <span>{course.targetLang}</span>
              </span>
              <span>· {course.title}</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-2">
              Aprende con Waraush en La Guajira
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Lecciones interactivas 100% offline-first. Tu progreso se guardará automáticamente en tu dispositivo y se sincronizará con tu docente.
            </p>

            {user.classroomCode ? (
              <div className="mt-3 text-xs text-white/80">
                Inscrito en aula: <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">{user.classroomCode}</span>
              </div>
            ) : (
              <button
                onClick={onOpenJoinModal}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-50 transition shadow-xs"
              >
                <span>¿Tienes código de tu profesor? Ingrésalo aquí</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="shrink-0">
            <MascotWaraush
              mood="happy"
              size="md"
              message="¡Anas ka'i! Listo para aprender?"
            />
          </div>
        </div>
      </div>

      {/* Push Notification Streak Reminder banner if not enabled yet */}
      {!pushEnabled && showPushBanner && (
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 text-amber-600 animate-bounce" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <span>¿Quieres que Waraush proteja tu racha de {user.streak} días?</span>
                <Flame className="w-4 h-4 fill-amber-500 text-amber-600 inline" />
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Activa avisos Push del navegador para recibir recordatorios diarios antes de que termine el día, incluso offline o con la app cerrada.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowPushBanner(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold rounded-xl"
            >
              Ahora no
            </button>
            <button
              onClick={handleEnablePushFromBanner}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Activar Avisos
            </button>
          </div>
        </div>
      )}

      {/* 7-Day Weekly Activity Visualizer (Recharts BarChart) */}
      <div className="mb-10 animate-fade-in">
        <WeeklyActivity
          user={user}
          onOpenGoalSettings={onOpenProfileModal}
        />
      </div>

      {/* Modules and Lesson Path */}
      <div className="space-y-12">
        {course.modules.map((module, modIdx) => (
          <div key={module.id} className="relative">
            {/* Unit Milestone Header */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                  {modIdx + 1}
                </div>
                <div>
                  <div className="text-xs text-amber-600 font-bold uppercase tracking-wider">
                    Unidad {modIdx + 1}
                  </div>
                  <h2 className="font-display font-bold text-base text-slate-900">
                    {module.title}
                  </h2>
                  <p className="text-xs text-slate-500 line-clamp-1">{module.description}</p>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-medium shrink-0 hidden sm:block">
                {module.lessons.length} {module.lessons.length === 1 ? 'lección' : 'lecciones'}
              </div>
            </div>

            {/* Vertical Path of Lesson Nodes */}
            <div className="relative flex flex-col items-center py-4">
              {module.lessons.map((lesson, lsnIdx) => {
                const completed = isLessonCompleted(lesson.id);
                let isCurrent = false;

                if (!completed && !foundActive) {
                  isCurrent = true;
                  foundActive = true;
                }

                const isUnlocked = completed || isCurrent;

                // Subtle wavy displacement pattern (Duolingo snake curve)
                const offsetPattern = [0, 42, 65, 30, -30, -65, -42];
                const horizontalOffset = offsetPattern[(modIdx * 3 + lsnIdx) % offsetPattern.length];

                return (
                  <div
                    key={lesson.id}
                    className="relative my-4 flex flex-col items-center"
                    style={{ transform: `translateX(${horizontalOffset}px)` }}
                  >
                    {/* Node Trigger Button */}
                    <button
                      onClick={() => handleNodeClick(lesson, module, isUnlocked)}
                      disabled={!isUnlocked}
                      className={`relative w-18 h-18 rounded-full flex items-center justify-center transition-all select-none ${
                        completed
                          ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 btn-tactile shadow-amber-600/30 ring-4 ring-amber-100'
                          : isCurrent
                          ? 'bg-rose-600 hover:bg-rose-500 text-white btn-tactile shadow-rose-700/30 ring-8 ring-rose-100 animate-pulse'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed border-b-4 border-slate-300'
                      }`}
                    >
                      {completed ? (
                        <Check className="w-8 h-8 stroke-[3]" />
                      ) : isCurrent ? (
                        <Play className="w-8 h-8 fill-current ml-1" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}

                      {/* Crown/Star Badge for completion */}
                      {completed && (
                        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white text-[10px] shadow-xs">
                          ★
                        </span>
                      )}
                    </button>

                    {/* Lesson Label */}
                    <div className="mt-2 text-center max-w-[120px]">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1 block">
                        {lesson.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        +{lesson.xpReward} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Details Dialog / Popover before starting */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              {selectedLesson.module.title}
            </span>
            <h3 className="font-display font-extrabold text-xl text-slate-900 mt-1 mb-2">
              {selectedLesson.lesson.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Aprende vocabulario clave con audio nativo y ejercicios interactivos.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl mb-6 text-xs text-slate-600 flex justify-around">
              <div>
                <span className="block font-bold text-slate-900 text-sm">{selectedLesson.lesson.exercises.length}</span>
                <span className="text-[10px] text-slate-400">Ejercicios</span>
              </div>
              <div className="border-r border-slate-200" />
              <div>
                <span className="block font-bold text-amber-600 text-sm">+{selectedLesson.lesson.xpReward} XP</span>
                <span className="text-[10px] text-slate-400">Recompensa</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const s = selectedLesson;
                  setSelectedLesson(null);
                  onStartLesson(s.lesson, s.module.title);
                }}
                className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl btn-tactile shadow-xs transition"
              >
                Comenzar Lección
              </button>
              <button
                onClick={() => setSelectedLesson(null)}
                className="w-full py-2.5 px-4 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-xl transition"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
