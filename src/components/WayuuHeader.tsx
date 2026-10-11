import React, { useState, useEffect } from 'react';
import { User, LanguagePair } from '../types';
import { storage } from '../services/storageService';
import { sounds } from '../services/soundEffects';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { StreakTracker } from './StreakTracker';
import { StudentAvatar } from './avatar/StudentAvatar';
import {
  Flame,
  Heart,
  Zap,
  GraduationCap,
  Volume2,
  VolumeX,
  Users,
  ChevronDown,
  Sparkles,
  User as UserIcon,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { authService } from '../services/authService';

interface WayuuHeaderProps {
  user: User;
  isAuthenticated?: boolean;
  isGuest?: boolean;
  onOpenJoinModal: () => void;
  onOpenProfileModal?: () => void;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onLogoClick?: () => void;
}

const LANGUAGE_TRACKS: {
  id: LanguagePair;
  label: string;
  srcCode: string;
  tgtCode: string;
  srcIcon: string;
  tgtIcon: string;
  desc: string;
}[] = [
  { id: 'wayuu-en', label: 'Wayuunaiki → English', srcCode: 'WAY', tgtCode: 'EN', srcIcon: 'fa-feather', tgtIcon: 'fa-earth-americas', desc: 'Para hablantes Wayuu que aprenden inglés' },
  { id: 'es-en', label: 'Español → English', srcCode: 'ES', tgtCode: 'EN', srcIcon: 'fa-font', tgtIcon: 'fa-earth-americas', desc: 'Curso bilingüe de inglés general' },
  { id: 'en-wayuu', label: 'English → Wayuunaiki', srcCode: 'EN', tgtCode: 'WAY', srcIcon: 'fa-earth-americas', tgtIcon: 'fa-feather', desc: 'Aprende lengua Wayuu desde el inglés' },
  { id: 'wayuu-es', label: 'Wayuunaiki → Español', srcCode: 'WAY', tgtCode: 'ES', srcIcon: 'fa-feather', tgtIcon: 'fa-font', desc: 'Fortalecimiento de español desde Wayuunaiki' },
];

export const WayuuHeader: React.FC<WayuuHeaderProps> = ({
  user,
  isAuthenticated,
  isGuest = false,
  onOpenJoinModal,
  onOpenProfileModal,
  onOpenAuthModal,
  onLogoClick
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.isSoundEnabled());
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  const [isAuth, setIsAuth] = useState(isAuthenticated ?? authService.isAuthenticated());

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setIsAuth(isAuthenticated);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const unsub = authService.subscribe((fbUser) => {
      setIsAuth(!!fbUser);
    });
    return unsub;
  }, []);

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
            <button
              onClick={onLogoClick}
              className="flex items-center gap-2 hover:opacity-90 transition text-left cursor-pointer"
              title="Wayuuglish Inicio"
            >
              {/* Cardinal Crest Icon */}
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center shadow-xs text-white font-black text-sm">
                W
              </div>
              <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight hidden sm:inline">
                Wayuu<span className="text-rose-600">glish</span>
              </span>
            </button>


          </div>

          {/* Zone 2: Contextual Center Area */}
          {isAuth ? (
            /* Authenticated User Stats: Real Streak, Hearts, XP, Classroom */
            <div className="flex items-center gap-2.5 sm:gap-5">
              <StreakTracker
                user={user}
                onOpenProfileSettings={onOpenProfileModal}
              />

              <button
                onClick={() => setShowHeartsModal(true)}
                title="Vidas disponibles"
                className="flex items-center gap-1.5 text-rose-600 font-bold text-sm hover:opacity-85 transition select-none"
              >
                <Heart className="w-5 h-5 fill-rose-500 text-rose-600" />
                <span className="font-mono tabular-nums">{user.hearts}/{user.maxHearts}</span>
              </button>

              <div
                title="Puntos de experiencia acumulados"
                className="flex items-center gap-1.5 text-sky-600 font-bold text-sm select-none"
              >
                <Zap className="w-5 h-5 fill-sky-500 text-sky-600" />
                <span className="font-mono tabular-nums">{user.xp}</span>
                <span className="text-xs text-sky-700 font-normal hidden lg:inline">XP</span>
              </div>

              {user.role === 'student' && user.classroomCode && (
                <button
                  onClick={onOpenJoinModal}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Aula: <strong>{user.classroomCode}</strong></span>
                </button>
              )}
            </div>
          ) : isGuest ? (
            /* Guest Student Stats: Vidas, XP de prueba, badge de invitado */
            <div className="flex items-center gap-2.5 sm:gap-4">
              <button
                onClick={() => setShowHeartsModal(true)}
                title="Vidas en modo invitado"
                className="flex items-center gap-1.5 text-rose-600 font-bold text-sm hover:opacity-85 transition select-none"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-rose-500 text-rose-600" />
                <span className="font-mono tabular-nums text-xs sm:text-sm">{user.hearts}/{user.maxHearts}</span>
              </button>

              <div
                title="Puntos de la sesión de prueba"
                className="flex items-center gap-1.5 text-sky-600 font-bold text-xs sm:text-sm select-none"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-sky-500 text-sky-600" />
                <span className="font-mono tabular-nums">{user.xp}</span>
                <span className="text-xs text-sky-700 font-normal hidden sm:inline">XP</span>
              </div>

              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg">
                <i className="fa-solid fa-user-clock text-amber-600 text-xs"></i>
                <span>Modo Invitado</span>
              </span>
            </div>
          ) : (
            /* Unauthenticated Visitor (Landing Page) Center Message */
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                <i className="fa-solid fa-feather text-rose-600"></i>
                <span>Revitalización Lingüística del Wayuunaiki e Inglés</span>
              </span>
            </div>
          )}

          {/* Zone 3: Actions & Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Audio Toggle (Always available) */}
            <button
              onClick={handleToggleSound}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title={soundEnabled ? 'Silenciar efectos' : 'Activar efectos'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {isAuth ? (
              /* Authenticated User Actions */
              <>
                <StudentAvatar
                  user={user}
                  onOpenProfile={onOpenProfileModal}
                />

                {onOpenProfileModal && (
                  <button
                    onClick={onOpenProfileModal}
                    title="Mi Perfil"
                    className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition"
                  >
                    <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {(user.name || 'E').charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline max-w-[85px] truncate">{user.name.split(' ')[0]}</span>
                  </button>
                )}

                {/* Role Switcher (Estudiante / Docente) */}
                <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    onClick={() => handleRoleToggle('student')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      user.role === 'student'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Estudiante
                  </button>
                  <button
                    onClick={() => handleRoleToggle('teacher')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                      user.role === 'teacher'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Docente</span>
                  </button>
                </div>
              </>
            ) : isGuest ? (
              /* Guest Student Actions: Save Progress or Login */
              <div className="flex items-center gap-2">
                <PWAInstallPrompt />

                {onOpenAuthModal && (
                  <>
                    <button
                      onClick={() => onOpenAuthModal('login')}
                      className="hidden sm:inline-flex px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                    >
                      Ingresar
                    </button>
                    <button
                      onClick={() => onOpenAuthModal('register')}
                      className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition"
                      title="Crea una cuenta para guardar tu progreso"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Guardar Progreso</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* Public / Unauthenticated Visitor Actions */
              <div className="flex items-center gap-2">
                <PWAInstallPrompt />

                {onOpenAuthModal && (
                  <>
                    <button
                      onClick={() => onOpenAuthModal('login')}
                      className="px-3 sm:px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition border border-slate-200 shadow-2xs"
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => onOpenAuthModal('register')}
                      className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Registrarse Gratis</span>
                    </button>
                  </>
                )}
              </div>
            )}
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
              Las vidas te permiten equivocarte y seguir aprendiendo en las lecciones interactivas.
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
