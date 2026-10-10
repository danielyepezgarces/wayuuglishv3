import React, { useState } from 'react';
import { Course, Lesson, User, Module } from '../../types';
import { MascotWaraush } from '../MascotWaraush';
import { sounds } from '../../services/soundEffects';
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
  Info
} from 'lucide-react';

interface PathMapProps {
  course: Course;
  user: User;
  onStartLesson: (lesson: Lesson, moduleTitle: string) => void;
  onOpenJoinModal: () => void;
}

export const PathMap: React.FC<PathMapProps> = ({
  course,
  user,
  onStartLesson,
  onOpenJoinModal
}) => {
  const [selectedLesson, setSelectedLesson] = useState<{ lesson: Lesson; module: Module } | null>(null);

  // Determine which lessons are completed, active, and locked
  const isLessonCompleted = (lessonId: string) => user.completedLessons.includes(lessonId);

  // Find the first uncompleted lesson as the "current active" one
  let foundActive = false;

  const handleNodeClick = (lesson: Lesson, module: Module, isUnlocked: boolean) => {
    sounds.playPop();
    if (!isUnlocked) return;
    setSelectedLesson({ lesson, module });
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
              <span>{course.sourceFlag} ➔ {course.targetFlag}</span>
              <span>{course.title}</span>
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

                // If previous lesson was completed or this is the very first lesson of module 1
                const isUnlocked = completed || isCurrent || (modIdx === 0 && lsnIdx === 0);

                // Alternating horizontal offset for natural winding road feel
                const offsets = ['translate-x-0', '-translate-x-12 sm:-translate-x-20', 'translate-x-12 sm:translate-x-20', 'translate-x-0'];
                const offsetClass = offsets[lsnIdx % offsets.length];

                return (
                  <div key={lesson.id} className="relative flex flex-col items-center my-4">
                    {/* Winding road path node */}
                    <div className={`transition-transform duration-200 ${offsetClass}`}>
                      <button
                        onClick={() => handleNodeClick(lesson, module, isUnlocked)}
                        disabled={!isUnlocked}
                        className={`btn-duo relative group w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                          completed
                            ? 'bg-emerald-500 text-white shadow-[0_6px_0_#047857] hover:bg-emerald-400'
                            : isCurrent
                            ? 'bg-rose-500 text-white shadow-[0_6px_0_#BE123C] hover:bg-rose-400 animate-bounce'
                            : isUnlocked
                            ? 'bg-rose-600 text-white shadow-[0_6px_0_#9F1239]'
                            : 'bg-slate-200 text-slate-400 shadow-[0_6px_0_#94A3B8] cursor-not-allowed'
                        }`}
                      >
                        {/* Node icon */}
                        {completed ? (
                          <Check className="w-9 h-9 stroke-[3]" />
                        ) : isCurrent ? (
                          <Play className="w-8 h-8 fill-white ml-1" />
                        ) : isUnlocked ? (
                          <Star className="w-8 h-8 fill-white" />
                        ) : (
                          <Lock className="w-7 h-7" />
                        )}

                        {/* Crown/Star badge on top if completed */}
                        {completed && (
                          <div className="absolute -top-2 -right-1 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-xs border-2 border-white text-amber-900">
                            <Star className="w-3.5 h-3.5 fill-amber-900" />
                          </div>
                        )}

                        {/* XP tag floating on hover */}
                        <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap pointer-events-none z-20">
                          {lesson.title} (+{lesson.xpReward} XP)
                        </div>
                      </button>

                      {/* Lesson title label */}
                      <div className="mt-4 text-center max-w-[140px] mx-auto">
                        <div className="text-xs font-bold text-slate-800 line-clamp-1">
                          {lesson.title}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {completed ? 'Completada' : isUnlocked ? 'Disponible' : 'Bloqueada'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Preview Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>

            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              {selectedLesson.module.title}
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
              {selectedLesson.lesson.title}
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {selectedLesson.lesson.description}
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-6 flex items-center justify-around text-xs">
              <div className="flex items-center gap-1.5 font-bold text-sky-600">
                <Sparkles className="w-4 h-4" />
                <span>+{selectedLesson.lesson.xpReward} XP</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="flex items-center gap-1.5 font-bold text-amber-600">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>Racha activa</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const target = selectedLesson;
                  setSelectedLesson(null);
                  onStartLesson(target.lesson, target.module.title);
                }}
                className="btn-duo w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-2xl shadow-[0_4px_0_#BE123C] transition"
              >
                ¡Empezar Lección!
              </button>
              <button
                onClick={() => setSelectedLesson(null)}
                className="w-full py-2.5 px-4 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-xl transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
