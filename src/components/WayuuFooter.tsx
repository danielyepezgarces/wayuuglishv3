import React, { useState, useEffect } from 'react';
import { User, LanguagePair } from '../types';
import { authService } from '../services/authService';
import { storage } from '../services/storageService';
import { sounds } from '../services/soundEffects';

interface WayuuFooterProps {
  user: User;
  isAuthenticated?: boolean;
  isGuest?: boolean;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenProfile: () => void;
  onOpenJoinModal: () => void;
  onSelectTrack: (track: LanguagePair) => void;
}

export const WayuuFooter: React.FC<WayuuFooterProps> = ({
  user,
  isAuthenticated,
  isGuest = false,
  onOpenAuth,
  onOpenProfile,
  onOpenJoinModal,
  onSelectTrack
}) => {
  const [isAuth, setIsAuth] = useState(isAuthenticated ?? authService.isAuthenticated());
  const [firebaseUser, setFirebaseUser] = useState(authService.getFirebaseUser());
  const [soundEnabled, setSoundEnabled] = useState(sounds.isSoundEnabled());

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setIsAuth(isAuthenticated);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const unsubAuth = authService.subscribe((fbUser) => {
      setIsAuth(!!fbUser);
      setFirebaseUser(fbUser);
    });
    return unsubAuth;
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    sounds.setSoundEnabled(next);
    setSoundEnabled(next);
  };

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-slate-600">
      {/* Decorative Wayuu Kanasü Geometric Ribbon */}
      <div className="w-full h-2.5 bg-gradient-to-r from-rose-600 via-amber-500 to-teal-600 relative overflow-hidden flex">
        <div className="w-full h-full opacity-35 bg-[repeating-linear-gradient(45deg,#000,#000_6px,transparent_6px,transparent_12px)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-slate-100">
          {/* Col 1: Identity & Cultural Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                <i className="fa-solid fa-feather text-amber-300"></i>
              </div>
              <span className="font-display font-black text-lg text-slate-900 tracking-tight">
                Wayuu<span className="text-rose-600">glish</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Plataforma pedagógica trilingüe orientada a la revitalización y enseñanza del
              Wayuunaiki, Español e Inglés en las comunidades de La Guajira, Colombia y Venezuela.
            </p>

            <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 font-semibold border border-rose-100">
                <i className="fa-solid fa-school text-rose-600 text-[10px]"></i>
                <span>Enfoque SEIP Indígena</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-100">
                <i className="fa-solid fa-signal text-emerald-600 text-[10px]"></i>
                <span>Offline-First PWA</span>
              </span>
            </div>
          </div>

          {/* Col 2: Language Tracks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-language text-rose-600"></i>
              <span>Rutas Lingüísticas</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTrack('wayuu-en')}
                  className={`w-full text-left p-2 rounded-lg transition flex items-center justify-between ${
                    user.currentTrack === 'wayuu-en'
                      ? 'bg-rose-50 font-bold text-rose-700'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-book-open text-slate-400 text-[11px]"></i>
                    <span>Wayuunaiki a Inglés</span>
                  </span>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTrack('es-en')}
                  className={`w-full text-left p-2 rounded-lg transition flex items-center justify-between ${
                    user.currentTrack === 'es-en'
                      ? 'bg-rose-50 font-bold text-rose-700'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-globe text-slate-400 text-[11px]"></i>
                    <span>Español a Inglés</span>
                  </span>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTrack('en-wayuu')}
                  className={`w-full text-left p-2 rounded-lg transition flex items-center justify-between ${
                    user.currentTrack === 'en-wayuu'
                      ? 'bg-rose-50 font-bold text-rose-700'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-compass text-slate-400 text-[11px]"></i>
                    <span>English to Wayuunaiki</span>
                  </span>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTrack('wayuu-es')}
                  className={`w-full text-left p-2 rounded-lg transition flex items-center justify-between ${
                    user.currentTrack === 'wayuu-es'
                      ? 'bg-rose-50 font-bold text-rose-700'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-shapes text-slate-400 text-[11px]"></i>
                    <span>Wayuunaiki a Español</span>
                  </span>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contextual Study Tools (User) vs Educational Resources (Guest/Visitor) */}
          <div className="space-y-3">
            {isAuth ? (
              /* Authenticated User: Study tools */
              <>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-chalkboard-user text-rose-600"></i>
                  <span>Herramientas de Estudio</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button
                      onClick={onOpenJoinModal}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded-lg text-slate-600 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <i className="fa-solid fa-qrcode text-slate-400 text-[11px]"></i>
                        <span>Código de Aula Escolar</span>
                      </span>
                      <span className="text-[10px] bg-slate-100 font-mono text-slate-600 px-1.5 py-0.5 rounded">
                        {user.classroomCode || 'Unirse'}
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={onOpenProfile}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded-lg text-slate-600 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <i className="fa-solid fa-bullseye text-slate-400 text-[11px]"></i>
                        <span>Meta Diaria y Rachas</span>
                      </span>
                      <span className="text-[10px] text-rose-600 font-bold">
                        {user.streak} {user.streak === 1 ? 'día' : 'días'}
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={onOpenProfile}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded-lg text-slate-600 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <i className="fa-solid fa-user-astronaut text-slate-400 text-[11px]"></i>
                        <span>Personalizar Cardenal</span>
                      </span>
                      <i className="fa-solid fa-wand-magic-sparkles text-[10px] text-amber-500"></i>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleToggleSound}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded-lg text-slate-600 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'} text-slate-400 text-[11px]`}></i>
                        <span>Efectos de Audio Pedagógico</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {soundEnabled ? 'Activo' : 'Silenciado'}
                      </span>
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              /* Guest / Visitor: Educational & Pedagogical Resources */
              <>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-shapes text-rose-600"></i>
                  <span>Metodología & Cultura</span>
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <i className="fa-solid fa-book-bookmark text-rose-600 text-[10px]"></i>
                      <span>Modelo SEIP Bilingüe</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Sistema Educativo Indígena Propio para aulas rurales.
                    </div>
                  </li>
                  <li className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <i className="fa-solid fa-gem text-amber-600 text-[10px]"></i>
                      <span>Arte y Simbología Kanasü</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Patrones geométricos y relatos de la cultura Wayuu.
                    </div>
                  </li>
                  <li className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <i className="fa-solid fa-headphones text-teal-600 text-[10px]"></i>
                      <span>Audio y Fonética Nativa</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Guías de pronunciación por hablantes originarios.
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={handleToggleSound}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded-lg text-slate-600 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'} text-slate-400 text-[11px]`}></i>
                        <span>Efectos de Audio</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {soundEnabled ? 'Activo' : 'Silenciado'}
                      </span>
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>

          {/* Col 4: Contextual Account & Community Area */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-circle-user text-rose-600"></i>
              <span>{isAuth ? 'Mi Cuenta' : isGuest ? 'Modo Invitado' : 'Comienza a Aprender'}</span>
            </h4>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              {isAuth && firebaseUser ? (
                /* Authenticated User Card */
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {(firebaseUser.displayName || user.name || 'E').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {firebaseUser.displayName || user.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate font-mono">
                        {firebaseUser.email || user.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={onOpenProfile}
                      className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition text-center shadow-2xs"
                    >
                      Ver Perfil
                    </button>
                    <button
                      onClick={async () => {
                        await authService.logOut();
                      }}
                      className="py-1.5 px-3 text-rose-600 hover:bg-rose-50 border border-rose-200 bg-white font-bold text-xs rounded-xl transition flex items-center justify-center"
                      title="Cerrar sesión"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                  </div>

                  <div className="text-[10px] text-emerald-700 flex items-center gap-1 pt-1">
                    <i className="fa-solid fa-shield-check text-[10px]"></i>
                    <span>Progreso sincronizado de forma segura</span>
                  </div>
                </div>
              ) : isGuest ? (
                /* Guest Student Card */
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                    <i className="fa-solid fa-clock-rotate-left text-amber-600 text-xs"></i>
                    <span>Sesión Temporal de Prueba</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Estás explorando lecciones como invitado. Crea tu cuenta gratuita para guardar tus puntos y competir en tu aula.
                  </p>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-cloud-arrow-up text-amber-300 text-xs"></i>
                    <span>Guardar Progreso</span>
                  </button>
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition text-center"
                  >
                    Ya tengo cuenta (Ingresar)
                  </button>
                </div>
              ) : (
                /* Public Visitor Card */
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Crea tu cuenta gratuita para aprender a tu ritmo, desbloquear vocabulario y practicar sin conexión.
                  </p>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-feather text-amber-300 text-xs"></i>
                    <span>Registrarse Gratis</span>
                  </button>
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition text-center"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
              <i className="fa-solid fa-graduation-cap text-rose-500"></i>
              <span>Acceso libre para docentes y estudiantes</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Institutional, Legal & Cultural Preservation */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-slate-500">
            <i className="fa-solid fa-location-dot text-rose-600 text-xs"></i>
            <span>La Guajira · Colombia</span>
            <span className="text-slate-300">·</span>
            <span>Educación Bilingüe Intercultural</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://es.wikipedia.org/wiki/Idioma_wayuu"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-700 transition flex items-center gap-1 text-xs"
              title="Información lingüística del Wayuunaiki"
            >
              <i className="fa-solid fa-book text-slate-400"></i>
              <span>Lengua Wayuu</span>
            </a>
            <a
              href="https://www.mineducacion.gov.co"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-700 transition flex items-center gap-1 text-xs"
              title="Ministerio de Educación Nacional"
            >
              <i className="fa-solid fa-landmark text-slate-400"></i>
              <span>Mineducación</span>
            </a>
          </div>

          <div className="text-xs text-slate-400">
            © 2026 Wayuuglish. Preservación lingüística y tecnología educativa.
          </div>
        </div>
      </div>
    </footer>
  );
};
