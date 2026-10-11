import React from 'react';
import { User, Course, LanguagePair } from '../../types';
import { MascotWaraush } from '../MascotWaraush';
import { sounds } from '../../services/soundEffects';

interface LandingPageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onStartAsGuest: () => void;
  courses: Course[];
  currentTrack: LanguagePair;
  onSelectTrack: (track: LanguagePair) => void;
}

const STATS = [
  {
    icon: 'fa-solid fa-wifi',
    highlight: '100% Offline',
    label: 'Aprende en rancherías sin cobertura de internet'
  },
  {
    icon: 'fa-solid fa-graduation-cap',
    highlight: 'Wayuu + Inglés',
    label: 'Pedagogía contextualizada bilingüe e intercultural'
  },
  {
    icon: 'fa-solid fa-cloud-arrow-up',
    highlight: 'Sincronización Total',
    label: 'Tus avances se respaldan al reconectar internet'
  },
  {
    icon: 'fa-solid fa-bell',
    highlight: 'Recordatorios Diarios',
    label: 'Alertas locales para mantener tu hábito de estudio'
  }
];

const FEATURES = [
  {
    title: 'Educación Bilingüe Intercultural',
    desc: 'Metodología pedagógica diseñada con sabedores y docentes de La Guajira, conectando el Wayuunaiki materno con el inglés global sin perder la identidad.',
    badge: 'Currículo Contextualizado',
    icon: 'fa-solid fa-feather-pointed',
    color: 'from-rose-500 to-rose-700'
  },
  {
    title: 'Infraestructura Offline de Resiliencia',
    desc: 'Los ejercicios de audio, bancos de palabras y avance de unidades funcionan íntegramente en la memoria de tu dispositivo mediante Service Workers y LocalStorage.',
    badge: 'Cero Pérdida de Progreso',
    icon: 'fa-solid fa-tower-broadcast',
    color: 'from-amber-500 to-amber-700'
  },
  {
    title: 'Gamificación & Mascota Waraush',
    desc: 'Gana puntos de experiencia (XP), mantén rachas diarias vivas, viste a tu cardenal guajiro y compite amistosamente en la tabla de clasificación del aula.',
    badge: 'Motivación Constante',
    icon: 'fa-solid fa-fire',
    color: 'from-teal-500 to-teal-700'
  },
  {
    title: 'Monitoreo Docente y Aulas en Vivo',
    desc: 'Los profesores pueden registrar sus grados escolares, invitar co-docentes, editar módulos lingüísticos y supervisar el avance de cada estudiante en tiempo real.',
    badge: 'Portal para Profesores',
    icon: 'fa-solid fa-chalkboard-user',
    color: 'from-sky-500 to-sky-700'
  }
];

const TRACK_CARDS: {
  id: LanguagePair;
  name: string;
  sourceLang: string;
  targetLang: string;
  tag: string;
  description: string;
  icon: string;
}[] = [
  {
    id: 'wayuu-en',
    name: 'Wayuunaiki → English',
    sourceLang: 'Wayuunaiki',
    targetLang: 'English',
    tag: 'Ruta Ancestral',
    description: 'Aprende inglés desde tu lengua materna con fonética adaptada a los sonidos del Wayuunaiki.',
    icon: 'fa-solid fa-earth-americas'
  },
  {
    id: 'es-en',
    name: 'Español → English',
    sourceLang: 'Español',
    targetLang: 'English',
    tag: 'Estándar',
    description: 'Aprende inglés conversacional con explicaciones directas y desafíos dinámicos.',
    icon: 'fa-solid fa-language'
  },
  {
    id: 'en-wayuu',
    name: 'English → Wayuunaiki',
    sourceLang: 'English',
    targetLang: 'Wayuunaiki',
    tag: 'Preservación',
    description: 'Para la comunidad internacional y lingüistas que desean aprender la lengua de la gente Wayuu.',
    icon: 'fa-solid fa-feather'
  },
  {
    id: 'wayuu-es',
    name: 'Wayuunaiki → Español',
    sourceLang: 'Wayuunaiki',
    targetLang: 'Español',
    tag: 'Alfabetización',
    description: 'Fortalecimiento de la lectoescritura en español respetando el pensamiento Wayuu.',
    icon: 'fa-solid fa-book-open-reader'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onStartAsGuest,
  currentTrack,
  onSelectTrack
}) => {
  return (
    <div className="bg-[#FAFAF8] text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
        {/* Subtle decorative background patterns reminiscent of Wayuu weaving */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#E11D48_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Mission, Typography & Call to Action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold shadow-2xs">
                <i className="fa-solid fa-shield-halved text-rose-600"></i>
                <span>Plataforma Educativa Bilingüe · La Guajira</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.1]">
                Aprende idiomas con la fuerza de tu <span className="text-rose-600 underline decoration-rose-300 decoration-wavy decoration-2">cultura</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                <strong>Wayuuglish</strong> conecta el <strong>Wayuunaiki</strong> con el <strong>inglés y español</strong> mediante lecciones interactivas. Diseñado para funcionar <strong>100% sin internet</strong> en rancherías y aulas rurales, guardando tu aprendizaje en todo momento.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <button
                  onClick={() => {
                    sounds.playPop();
                    onOpenAuth('register');
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-sm rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5"
                >
                  <i className="fa-solid fa-rocket text-sm"></i>
                  <span>Crear Cuenta Gratis</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playPop();
                    onOpenAuth('login');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border-2 border-slate-300 font-bold text-sm rounded-2xl shadow-2xs transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-arrow-right-to-bracket text-rose-600 text-sm"></i>
                  <span>Ya tengo cuenta</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playPop();
                    onStartAsGuest();
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs rounded-2xl transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-play text-slate-400 text-xs"></i>
                  <span>Probar como invitado</span>
                </button>
              </div>

              {/* Micro Proof & Security */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-check-circle text-emerald-600"></i>
                  <span>Gratis para escuelas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-signal text-amber-600"></i>
                  <span>Aprende sin conexión</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-shield-check text-sky-600"></i>
                  <span>Progreso seguro y protegido</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Mascot & Cultural Showcase Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/60 text-center">
                {/* Cultural Geometric Top Accent Ribbon */}
                <div className="absolute top-0 left-6 right-6 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-teal-600 rounded-b-md"></div>

                {/* Mascot Bird */}
                <div className="pt-2 pb-1 flex justify-center">
                  <MascotWaraush
                    mood="happy"
                    size="lg"
                    message="¡Jamaya pia! Bienvenido a Wayuuglish."
                  />
                </div>

                <div className="mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                    Waraush · El Cardenal Guajiro
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-2">
                    Tu compañero de aprendizaje
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Te acompañará en cada lección con pronunciación, historias de origen y celebraciones por tus metas diarias cumplidas.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-left">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">Meta sugerida</div>
                    <div className="text-xs font-bold text-slate-800">1 lección al día (15 min)</div>
                  </div>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    Empezar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Strip */}
      <section className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <i className={`${stat.icon} text-lg`}></i>
                </div>
                <div>
                  <div className="font-black text-base text-slate-900">{stat.highlight}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-snug">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Tracks Selection Showcase */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3">
            <i className="fa-solid fa-shapes text-amber-600"></i>
            <span>Rutas Multilingües</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Elige la ruta que deseas explorar
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Puedes cambiar de par lingüístico en cualquier momento desde tu menú principal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRACK_CARDS.map((track) => {
            const isSelected = currentTrack === track.id;
            return (
              <div
                key={track.id}
                onClick={() => {
                  sounds.playPop();
                  onSelectTrack(track.id);
                }}
                className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-50/50 border-rose-600 shadow-lg shadow-rose-100'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-rose-600">
                      <i className={`${track.icon} text-base`}></i>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {track.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-base text-slate-900 mb-1">
                    {track.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {isSelected ? 'Ruta activa' : 'Seleccionar'}
                  </span>
                  <i
                    className={`fa-solid ${
                      isSelected ? 'fa-circle-check text-rose-600 text-base' : 'fa-arrow-right text-xs text-slate-400'
                    }`}
                  ></i>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features & Methodology Grid */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Innovación Pedagógica
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mt-3">
              Construido para el territorio y las aulas
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Resuelve de raíz los desafíos de conectividad en zonas apartadas respetando la tradición oral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <i className={`${feat.icon} text-lg`}></i>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-100/70 px-2.5 py-1 rounded-full">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-xl text-slate-900">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call To Action Banner */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-gradient-to-br from-rose-700 via-rose-600 to-amber-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              Comienza hoy mismo
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight">
              ¿Listo para dar tus primeros pasos en Wayuuglish?
            </h2>
            <p className="text-sm text-white/90 leading-relaxed">
              Crea tu cuenta gratis en 30 segundos, personaliza a tu cardenal Waraush y comienza a sumar puntos para tu aula.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  sounds.playComplete();
                  onOpenAuth('register');
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-rose-700 font-black text-sm rounded-2xl shadow-lg transition"
              >
                Registrarme Gratis
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  onStartAsGuest();
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-rose-800/60 hover:bg-rose-800 text-white border border-white/20 font-bold text-sm rounded-2xl transition"
              >
                Probar sin Registrarme
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
