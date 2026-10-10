import React, { useState, useEffect } from 'react';
import { User, LanguagePair } from '../types';
import { storage } from '../services/storageService';
import { sounds } from '../services/soundEffects';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import {
  Flame,
  Heart,
  Zap,
  Globe,
  GraduationCap,
  Volume2,
  VolumeX,
  Users,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface WayuuHeaderProps {
  user: User;
  onOpenJoinModal: () => void;
}

const LANGUAGE_TRACKS: { id: LanguagePair; label: string; flags: string; desc: string }[] = [
  { id: 'wayuu-en', label: 'Wayuunaiki → English', flags: '🌵 ➔ 🇬🇧', desc: 'Para hablantes Wayuu que aprenden inglés' },
  { id: 'es-en', label: 'Español → English', flags: '🇨🇴 ➔ 🇬🇧', desc: 'Curso bilingüe de inglés general' },
  { id: 'en-wayuu', label: 'English → Wayuunaiki', flags: '🇬🇧 ➔ 🌵', desc: 'Learn indigenous Wayuu language from English' },
  { id: 'wayuu-es', label: 'Wayuunaiki → Español', flags: '🌵 ➔ 🇨🇴', desc: 'Fortalecimiento de español desde Wayuunaiki' },
];

export const WayuuHeader: React.FC<WayuuHeaderProps> = ({ user, onOpenJoinModal }) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.isSoundEnabled());
  const [showHeartsModal, setShowHeartsModal] = useState(false);

  const currentTrackInfo = LANGUAGE_TRACKS.find((t) => t.id === user.currentTrack) || LANGUAGE_TRACKS[0];

  const handleToggleSound = () => {
    const next = !soundEnabled;
    sounds.setSoundEnabled(next);
    setSoundEnabled(next);
  };

  const handleRoleToggle = (targetRole: 'student' | 'teacher') => {
    storage.switchRole(targetRole);
  };

  const handleTrackSelect = (track: LanguagePair) => {
    storage.switchTrack(track);
    setLangDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand & Language selector */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              {/* Mini Cardinal Crest Icon */}
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center shadow-xs text-white font-black text-sm">
                W
              </div>
              <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight hidden sm:inline">
                Wayuu<span className="text-rose-600">glish</span>
              </span>
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition"
              >
                <span>{currentTrackInfo.flags}</span>
                <span className="hidden md:inline">{currentTrackInfo.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Rutas Lingüísticas Disponibles
                    </div>
                    {LANGUAGE_TRACKS.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => handleTrackSelect(track.id)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2.5 hover:bg-slate-50 transition ${
                          user.currentTrack === track.id ? 'bg-rose-50 text-rose-900 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <span className="text-sm mt-0.5">{track.flags}</span>
                        <div>
                          <div className="font-medium">{track.label}</div>
                          <div className="text-[11px] text-slate-400 leading-tight">{track.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Zone 2: Gamification Stats (Streak, Hearts, XP) */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Streak */}
            <div
              title={`${user.streak} días consecutivos aprendiendo`}
              className="flex items-center gap-1.5 text-amber-600 font-bold text-sm select-none"
            >
              <Flame className="w-5 h-5 fill-amber-500 text-amber-600 animate-pulse" />
              <span className="font-mono tabular-nums">{user.streak}</span>
              <span className="text-xs text-amber-700 font-normal hidden lg:inline">días</span>
            </div>

            {/* Hearts (Vidas) */}
            <button
              onClick={() => setShowHeartsModal(true)}
              title="Vidas disponibles"
              className="flex items-center gap-1.5 text-rose-600 font-bold text-sm hover:opacity-85 transition select-none"
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-600" />
              <span className="font-mono tabular-nums">{user.hearts}/{user.maxHearts}</span>
            </button>

            {/* XP Points */}
            <div
              title="Puntos de experiencia acumulados"
              className="flex items-center gap-1.5 text-sky-600 font-bold text-sm select-none"
            >
              <Zap className="w-5 h-5 fill-sky-500 text-sky-600" />
              <span className="font-mono tabular-nums">{user.xp}</span>
              <span className="text-xs text-sky-700 font-normal hidden lg:inline">XP</span>
            </div>

            {/* Classroom Code Badge */}
            {user.role === 'student' && (
              <button
                onClick={onOpenJoinModal}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Aula: <strong>{user.classroomCode || 'Unirse'}</strong></span>
              </button>
            )}
          </div>

          {/* Zone 3: Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title={soundEnabled ? 'Silenciar efectos' : 'Activar efectos'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* PWA Install */}
            <PWAInstallPrompt />

            {/* Role Switcher Pill */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => handleRoleToggle('student')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  user.role === 'student'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Estudiante
              </button>
              <button
                onClick={() => handleRoleToggle('teacher')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                  user.role === 'teacher'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Docente</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Refill Hearts Modal */}
      {showHeartsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-slate-200 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
              <Heart className="w-10 h-10 fill-rose-500" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
              {user.hearts === user.maxHearts ? '¡Tus vidas están llenas!' : 'Recargar Vidas'}
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Las vidas te permiten equivocarte y seguir aprendiendo en las lecciones.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  storage.refillHearts();
                  setShowHeartsModal(false);
                }}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
              >
                Rellenar vidas al máximo (5/5)
              </button>
              <button
                onClick={() => setShowHeartsModal(false)}
                className="w-full py-2 px-4 text-slate-500 hover:text-slate-700 text-xs font-medium rounded-xl transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
