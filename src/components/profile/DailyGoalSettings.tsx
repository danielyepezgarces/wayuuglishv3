import React from 'react';
import { User, DailyGoalIntensity } from '../../types';
import { storage } from '../../services/storageService';
import { sounds } from '../../services/soundEffects';
import {
  Target,
  Zap,
  CheckCircle2,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';

interface DailyGoalSettingsProps {
  user: User;
  onSaved?: () => void;
}

interface GoalTierOption {
  tier: DailyGoalIntensity;
  title: string;
  subtitle: string;
  xpTarget: number;
  estMinutes: number;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  waraushAdvice: string;
}

const GOAL_TIERS: GoalTierOption[] = [
  {
    tier: 'casual',
    title: 'Casual',
    subtitle: 'Relajado y constante',
    xpTarget: 15,
    estMinutes: 5,
    colorClass: 'border-emerald-300 bg-emerald-50/60 text-emerald-900',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    description: '1 lección corta al día. Ideal para mantener la racha viva sin presiones.',
    waraushAdvice: '¡Perfecto para aprender a tu propio ritmo en la ranchería!'
  },
  {
    tier: 'regular',
    title: 'Regular',
    subtitle: 'Hábito diario recomendado',
    xpTarget: 30,
    estMinutes: 10,
    colorClass: 'border-sky-300 bg-sky-50/60 text-sky-900',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
    description: '2 lecciones al día. El ritmo ideal recomendado por los docentes de La Guajira.',
    waraushAdvice: '¡Gran equilibrio! 10 minutos al día construyen una memoria bilingüe fuerte.'
  },
  {
    tier: 'serious',
    title: 'Serious',
    subtitle: 'Aprendizaje acelerado',
    xpTarget: 45,
    estMinutes: 15,
    colorClass: 'border-amber-300 bg-amber-50/60 text-amber-900',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    description: '3 lecciones al día. Avance rápido y mayor fluidez en vocabulario.',
    waraushAdvice: '¡Compromiso ejemplar! Superarás los módulos y encabezarás la clasificación.'
  },
  {
    tier: 'insane',
    title: 'Insane',
    subtitle: 'Modo Guerrón Wayuu',
    xpTarget: 60,
    estMinutes: 20,
    colorClass: 'border-rose-400 bg-rose-50/70 text-rose-900',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    description: '4+ lecciones al día. Dominio intensivo y máxima acumulación de XP.',
    waraushAdvice: '¡Poder total! En Wayuu decimos: "Katsin ma\'i pia" (¡Eres incansable y fuerte!).'
  }
];

export const DailyGoalSettings: React.FC<DailyGoalSettingsProps> = ({ user, onSaved }) => {
  const currentTier = user.dailyGoalTier || 'regular';
  const targetXp = user.dailyGoalXp || 30;
  const todayDate = new Date().toISOString().split('T')[0];
  const earnedXpToday = user.xpEarnedToday ?? (user.lastActiveDate === todayDate ? 15 : 0);
  const progressPercent = Math.min(100, Math.round((earnedXpToday / targetXp) * 100));
  const isGoalReached = earnedXpToday >= targetXp;

  const currentOption = GOAL_TIERS.find((t) => t.tier === currentTier) || GOAL_TIERS[1];

  const handleSelectTier = (tier: DailyGoalIntensity) => {
    sounds.playPop();
    storage.setDailyGoalTier(tier);
    if (onSaved) onSaved();
  };

  return (
    <div className="space-y-6">
      {/* Header explanation */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-5 h-5 text-rose-600" />
          <h3 className="font-display font-bold text-base text-slate-900">
            Objetivo Diario de Experiencia (Daily Goal)
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Elige tu meta diaria de estudio. Cumplir este objetivo cada día protege tu racha diaria y te ayuda a destacar en la tabla de clasificación del aula.
        </p>
      </div>

      {/* Live Today's Progress Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-xs font-bold text-slate-800">
              Progreso de hoy: {earnedXpToday} de {targetXp} XP
            </span>
          </div>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isGoalReached
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isGoalReached ? '✓ ¡Meta Alcanzada!' : `${progressPercent}% completado`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isGoalReached ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-rose-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Nivel actual: <strong>{currentOption.title}</strong></span>
          <span className="flex items-center gap-1">
            {isGoalReached ? (
              <>
                <i className="fa-solid fa-fire text-amber-500 text-xs"></i>
                <span>Racha asegurada para hoy</span>
              </>
            ) : (
              <span>Faltan {Math.max(0, targetXp - earnedXpToday)} XP para cumplir</span>
            )}
          </span>
        </div>
      </div>

      {/* 4 Interactive Tier Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GOAL_TIERS.map((tier) => {
          const isSelected = currentTier === tier.tier;

          return (
            <button
              key={tier.tier}
              type="button"
              onClick={() => handleSelectTier(tier.tier)}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-rose-500 bg-rose-50/50 shadow-sm ring-2 ring-rose-200'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-slate-900">
                      {tier.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tier.badgeBg} ${tier.badgeText}`}
                    >
                      {tier.xpTarget} XP / día
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-rose-600 bg-rose-600 text-white'
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <div className="text-[11px] font-medium text-slate-500 mb-2">
                  {tier.subtitle}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {tier.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>~{tier.estMinutes} min diarios</span>
                </span>
                <span className="font-semibold text-slate-600">
                  {Math.ceil(tier.xpTarget / 15)} {tier.xpTarget === 15 ? 'lección' : 'lecciones'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Waraush Motivational Advice Card */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="text-xs text-amber-900 leading-snug">
          <strong>Consejo de Waraush:</strong> {currentOption.waraushAdvice}
        </div>
      </div>
    </div>
  );
};
