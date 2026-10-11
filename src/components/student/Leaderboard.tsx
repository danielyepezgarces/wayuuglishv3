import React, { useState } from 'react';
import { User } from '../../types';
import { storage, StudentRecord } from '../../services/storageService';
import { sounds } from '../../services/soundEffects';
import { MascotWaraush } from '../MascotWaraush';
import { CardinalAvatarRenderer } from '../avatar/CardinalAvatarRenderer';
import {
  Trophy,
  Flame,
  Zap,
  Users,
  Medal,
  Crown,
  ChevronRight,
  Sparkles,
  ArrowUp,
  Award,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface LeaderboardProps {
  user: User;
  onOpenJoinModal: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ user, onOpenJoinModal }) => {
  const [sortBy, setSortBy] = useState<'xp' | 'streak'>('xp');
  const [cheeredStudentId, setCheeredStudentId] = useState<string | null>(null);

  const classrooms = storage.getClassrooms();
  const currentClassroom = classrooms.find(
    (c) => c.code.toUpperCase() === (user.classroomCode || '').toUpperCase()
  );

  // Get classmates from the user's classroom (or all students if not yet enrolled)
  const roster: StudentRecord[] = storage.getStudentsRoster(user.classroomCode);

  // Ensure current user is in the roster with their live stats
  const activeUserRecord: StudentRecord = {
    id: user.id,
    name: user.name,
    email: user.email,
    classroomCode: user.classroomCode || 'LIBRE',
    avatar: user.avatar,
    streak: user.streak,
    xp: user.xp,
    completedLessonsCount: user.completedLessons.length,
    lastActive: 'En este momento',
    synced: storage.getOnlineStatus()
  };

  const hasActiveUser = roster.some((s) => s.id === user.id);
  const fullList = hasActiveUser
    ? roster.map((s) => (s.id === user.id ? activeUserRecord : s))
    : [activeUserRecord, ...roster];

  // Sort by chosen metric
  const sortedList = [...fullList].sort((a, b) => {
    if (sortBy === 'xp') {
      return b.xp - a.xp;
    }
    return b.streak - a.streak;
  });

  // Find user's position
  const myRank = sortedList.findIndex((s) => s.id === user.id) + 1;
  const top1 = sortedList[0];
  const top2 = sortedList[1];
  const top3 = sortedList[2];

  const handleCheer = (studentId: string) => {
    sounds.playPop();
    setCheeredStudentId(studentId);
    setTimeout(() => setCheeredStudentId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Top Banner: Classroom Context & Mascot */}
      <div className="relative mb-8 p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 text-white shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-200" />
              <span>
                {currentClassroom ? currentClassroom.name : 'Clasificación General'}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-2">
              Tabla de Clasificación del Aula
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Compite amistosamente con tus compañeros de clase. Cada lección completada suma puntos de experiencia y protege tu racha.
            </p>

            {currentClassroom ? (
              <div className="mt-3.5 flex flex-wrap items-center gap-3 text-xs text-white/80">
                <span>
                  Código del aula: <strong className="font-mono bg-white/20 px-2 py-0.5 rounded text-white">{currentClassroom.code}</strong>
                </span>
                <span>·</span>
                <span>Docente: <strong>{currentClassroom.teacherName}</strong></span>
              </div>
            ) : (
              <button
                onClick={onOpenJoinModal}
                className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-50 transition shadow-xs"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Unirse al aula de tu profesor</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="shrink-0">
            <MascotWaraush
              mood="happy"
              size="md"
              message={`¡Tu posición actual es el #${myRank}!`}
            />
          </div>
        </div>
      </div>

      {/* Control Strip: Sort By Tabs + User Position Quick Stat */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => {
              sounds.playPop();
              setSortBy('xp');
            }}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              sortBy === 'xp'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
            <span>Puntos de Experiencia (XP)</span>
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setSortBy('streak');
            }}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              sortBy === 'streak'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Días de Racha</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
          <span>
            Tu posición: <strong className="text-rose-600 font-mono font-bold text-sm">#{myRank}</strong> de {sortedList.length} compañeros
          </span>
          {myRank > 1 && sortedList[myRank - 2] && (
            <span className="text-[11px] text-slate-400 hidden md:inline">
              (A solo{' '}
              {sortBy === 'xp'
                ? `${sortedList[myRank - 2].xp - activeUserRecord.xp} XP de #${myRank - 1}`
                : `${sortedList[myRank - 2].streak - activeUserRecord.streak} días de #${myRank - 1}`}
              )
            </span>
          )}
        </div>
      </div>

      {/* --- PODIUM TOP 3 VISUALIZATION --- */}
      {sortedList.length >= 3 && (
        <div className="mb-10 grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-lg mx-auto pt-6">
          {/* #2 Silver (Left) */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <CardinalAvatarRenderer
                avatar={top2.avatar}
                fallbackSeed={{ id: top2.id, name: top2.name }}
                size="lg"
                className="shadow-xs"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-xs">
                2°
              </div>
            </div>
            <div className="text-xs font-bold text-slate-800 text-center line-clamp-1 w-full mt-1">
              {top2.name}
            </div>
            <div className="text-[11px] font-mono font-bold text-sky-600 mt-0.5 flex items-center justify-center gap-1">
              <span>{sortBy === 'xp' ? `${top2.xp} XP` : `${top2.streak} días`}</span>
              {sortBy === 'streak' && <i className="fa-solid fa-fire text-amber-500 text-[10px]"></i>}
            </div>
            <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl mt-3 flex items-center justify-center font-display font-black text-slate-400 text-2xl">
              2
            </div>
          </div>

          {/* #1 Gold (Center, elevated) */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <Crown className="w-6 h-6 text-amber-500 fill-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
              <CardinalAvatarRenderer
                avatar={top1.avatar}
                fallbackSeed={{ id: top1.id, name: top1.name }}
                size="xl"
                className="shadow-md ring-2 ring-amber-300"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                1°
              </div>
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 text-center line-clamp-1 w-full mt-1">
              {top1.name}
            </div>
            <div className="text-xs font-mono font-bold text-amber-600 mt-0.5 flex items-center justify-center gap-1">
              <span>{sortBy === 'xp' ? `${top1.xp} XP` : `${top1.streak} días`}</span>
              {sortBy === 'streak' && <i className="fa-solid fa-fire text-amber-500 text-[11px]"></i>}
            </div>
            <div className="w-full h-28 sm:h-32 bg-gradient-to-t from-amber-300 to-amber-200 rounded-t-2xl mt-3 flex items-center justify-center font-display font-black text-amber-700 text-3xl shadow-sm">
              1
            </div>
          </div>

          {/* #3 Bronze (Right) */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <CardinalAvatarRenderer
                avatar={top3.avatar}
                fallbackSeed={{ id: top3.id, name: top3.name }}
                size="lg"
                className="shadow-xs"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-xs">
                3°
              </div>
            </div>
            <div className="text-xs font-bold text-slate-800 text-center line-clamp-1 w-full mt-1">
              {top3.name}
            </div>
            <div className="text-[11px] font-mono font-bold text-sky-600 mt-0.5 flex items-center justify-center gap-1">
              <span>{sortBy === 'xp' ? `${top3.xp} XP` : `${top3.streak} días`}</span>
              {sortBy === 'streak' && <i className="fa-solid fa-fire text-amber-500 text-[10px]"></i>}
            </div>
            <div className="w-full h-16 sm:h-20 bg-gradient-to-t from-amber-100 to-amber-50 rounded-t-2xl mt-3 flex items-center justify-center font-display font-black text-amber-600 text-2xl">
              3
            </div>
          </div>
        </div>
      )}

      {/* --- COMPLETE LEADERBOARD LIST --- */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="w-8 text-center">Pos.</span>
            <span>Compañero de Clase</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-10">
            <span className="hidden sm:inline">Racha</span>
            <span>Puntaje Total</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedList.map((st, index) => {
            const isMe = st.id === user.id;
            const rank = index + 1;

            return (
              <div
                key={st.id}
                className={`p-4 flex items-center justify-between transition-colors ${
                  isMe
                    ? 'bg-rose-50/80 hover:bg-rose-100/60 font-semibold'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Left: Rank + Avatar + Name */}
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Rank Badge */}
                  <div className="w-8 text-center font-mono font-black text-sm">
                    {rank === 1 ? (
                      <i className="fa-solid fa-medal text-amber-500 text-base" title="1er Lugar"></i>
                    ) : rank === 2 ? (
                      <i className="fa-solid fa-medal text-slate-400 text-base" title="2do Lugar"></i>
                    ) : rank === 3 ? (
                      <i className="fa-solid fa-medal text-amber-700 text-base" title="3er Lugar"></i>
                    ) : (
                      <span className="text-slate-400">{rank}</span>
                    )}
                  </div>

                  {/* Cardinal Avatar with Wayuu Textiles */}
                  <CardinalAvatarRenderer
                    avatar={st.avatar}
                    fallbackSeed={{ id: st.id, name: st.name }}
                    size="md"
                  />

                  {/* Name + Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {st.name}
                      </span>
                      {isMe && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                          Tú
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{st.completedLessonsCount} lecciones</span>
                      <span>·</span>
                      <span>{st.lastActive}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Streak & XP */}
                <div className="flex items-center gap-4 sm:gap-8">
                  {/* Streak */}
                  <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
                    <span className="font-mono tabular-nums">{st.streak}</span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">días</span>
                  </div>

                  {/* XP */}
                  <div className="w-20 text-right">
                    <div className="font-mono font-extrabold text-sm text-sky-600 tabular-nums">
                      {st.xp} XP
                    </div>
                  </div>

                  {/* High Five cheer button */}
                  {!isMe && (
                    <button
                      onClick={() => handleCheer(st.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 transition"
                      title="Enviar felicitación a tu compañero"
                    >
                      {cheeredStudentId === st.id ? (
                        <i className="fa-solid fa-hands-clapping text-amber-500 text-sm"></i>
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
