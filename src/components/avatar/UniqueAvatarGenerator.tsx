import React, { useState } from 'react';
import {
  CardinalAvatarConfig,
  KanasuPattern,
  CardinalAccessory,
  CardinalExpression
} from '../../types';
import { CardinalAvatarRenderer } from './CardinalAvatarRenderer';
import { sounds } from '../../services/soundEffects';
import {
  Wand2,
  Sparkles,
  Shuffle,
  Palette,
  Check,
  RefreshCw,
  Sliders,
  Feather
} from 'lucide-react';

interface UniqueAvatarGeneratorProps {
  onSaveAvatar: (avatar: CardinalAvatarConfig) => void;
  initialConfig?: CardinalAvatarConfig | null;
}

const BODY_COLORS = [
  { name: 'Rojo Carmesí Guajiro', hex: '#E11D48', crest: '#9F1239' },
  { name: 'Naranja Dunas de Taroa', hex: '#EA580C', crest: '#C2410C' },
  { name: 'Azul Caribe Cabo', hex: '#0284C7', crest: '#E11D48' },
  { name: 'Verde Oasis Macuira', hex: '#059669', crest: '#D97706' },
  { name: 'Magenta Salinas Manaure', hex: '#DB2777', crest: '#831843' },
  { name: 'Púrpura Noche Wayuu', hex: '#6D28D9', crest: '#4C1D95' },
  { name: 'Oro Sol Guajiro', hex: '#D97706', crest: '#92400E' },
  { name: 'Escarlata Guerrón', hex: '#B91C1C', crest: '#7F1D1D' }
];

const PATTERNS: { id: KanasuPattern; label: string; meaning: string }[] = [
  { id: 'kanasu-molokonoutaya', label: 'Molokonoutaya', meaning: 'Caparazón de morrocoy (Sabiduría y paciencia)' },
  { id: 'kanasu-pulikeruya', label: 'Pulikerüya', meaning: 'Diamantes de burro (Fuerza y resistencia)' },
  { id: 'kanasu-pasuatalooshi', label: 'Pasuatalooshi', meaning: 'Huella de ave (Libertad y viaje)' },
  { id: 'kanasu-triangles', label: 'Triángulos Kanasü', meaning: 'Montañas y dunas sagradas' },
  { id: 'stripes', label: 'Franjas Mawisa', meaning: 'Tejido fino de fajas ceremoniales' }
];

const ACCESSORIES: { id: CardinalAccessory; label: string; icon: string }[] = [
  { id: 'mochila', label: 'Mochila Wayuu', icon: '🎒' },
  { id: 'sombrero-wayuu', label: 'Sombrero Mawisa', icon: '👒' },
  { id: 'tumuma-necklace', label: 'Collar Tumuma', icon: '📿' },
  { id: 'feather-crest', label: 'Pluma de Honor', icon: '🪶' },
  { id: 'none', label: 'Sin accesorios', icon: '✨' }
];

const EXPRESSIONS: { id: CardinalExpression; label: string }[] = [
  { id: 'cheerful', label: 'Alegre' },
  { id: 'focused', label: 'Concentrado' },
  { id: 'proud', label: 'Orgulloso' },
  { id: 'curious', label: 'Curioso' }
];

export const UniqueAvatarGenerator: React.FC<UniqueAvatarGeneratorProps> = ({
  onSaveAvatar,
  initialConfig
}) => {
  const [config, setConfig] = useState<CardinalAvatarConfig>(() => {
    if (initialConfig) return initialConfig;
    return {
      id: `custom-${Date.now()}`,
      name: 'Mi Cardenal Único',
      bodyColor: '#E11D48',
      crestColor: '#9F1239',
      beakColor: '#F59E0B',
      chestPattern: 'kanasu-molokonoutaya',
      patternColorPrimary: '#FBBF24',
      patternColorSecondary: '#DC2626',
      accessory: 'mochila',
      eyeExpression: 'cheerful',
      borderPalette: 'from-rose-500 via-amber-500 to-rose-600',
      isCustomGenerated: true
    };
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [mode, setMode] = useState<'studio' | 'ai'>('studio');

  // Randomize generator
  const handleRandomize = () => {
    sounds.playPop();
    const color = BODY_COLORS[Math.floor(Math.random() * BODY_COLORS.length)];
    const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    const accessory = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)];
    const expression = EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)];

    const accentColors = ['#FBBF24', '#06B6D4', '#10B981', '#EC4899', '#F97316', '#38BDF8'];
    const p1 = accentColors[Math.floor(Math.random() * accentColors.length)];
    const p2 = accentColors[Math.floor(Math.random() * accentColors.length)];

    const borders = [
      'from-rose-500 via-amber-500 to-rose-600',
      'from-amber-400 via-orange-500 to-cyan-500',
      'from-sky-400 via-cyan-500 to-rose-500',
      'from-emerald-500 via-amber-400 to-rose-500',
      'from-purple-600 via-indigo-500 to-pink-500'
    ];

    setConfig({
      id: `custom-${Date.now()}`,
      name: `Cardenal ${pattern.label} ${accessory.label}`,
      bodyColor: color.hex,
      crestColor: color.crest,
      beakColor: '#F59E0B',
      chestPattern: pattern.id,
      patternColorPrimary: p1,
      patternColorSecondary: p2,
      accessory: accessory.id,
      eyeExpression: expression.id,
      borderPalette: borders[Math.floor(Math.random() * borders.length)],
      isCustomGenerated: true
    });
  };

  // AI-Assisted prompt interpretation
  const handleGenerateFromAiPrompt = () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    sounds.playPop();

    setTimeout(() => {
      const p = aiPrompt.toLowerCase();
      let color = BODY_COLORS[0];
      let accessory: CardinalAccessory = 'mochila';
      let pattern: KanasuPattern = 'kanasu-molokonoutaya';

      if (p.includes('azul') || p.includes('mar') || p.includes('cabo') || p.includes('playa')) {
        color = BODY_COLORS[2]; // Azul Caribe
        accessory = 'mochila';
      } else if (p.includes('naranja') || p.includes('duna') || p.includes('taroa') || p.includes('desierto')) {
        color = BODY_COLORS[1]; // Dunas
        accessory = 'sombrero-wayuu';
      } else if (p.includes('verde') || p.includes('macuira') || p.includes('selva')) {
        color = BODY_COLORS[3]; // Macuira
        pattern = 'kanasu-pulikeruya';
      } else if (p.includes('rosa') || p.includes('salina') || p.includes('manaure')) {
        color = BODY_COLORS[4]; // Manaure
      } else if (p.includes('noche') || p.includes('estrella') || p.includes('morado') || p.includes('púrpura')) {
        color = BODY_COLORS[5]; // Noche
        accessory = 'tumuma-necklace';
      }

      if (p.includes('sombrero')) accessory = 'sombrero-wayuu';
      if (p.includes('collar') || p.includes('tumuma')) accessory = 'tumuma-necklace';
      if (p.includes('pluma') || p.includes('penacho')) accessory = 'feather-crest';

      setConfig({
        id: `custom-ai-${Date.now()}`,
        name: `Cardenal "${aiPrompt.slice(0, 24)}"`,
        bodyColor: color.hex,
        crestColor: color.crest,
        beakColor: '#F59E0B',
        chestPattern: pattern,
        patternColorPrimary: '#FBBF24',
        patternColorSecondary: color.hex,
        accessory,
        eyeExpression: p.includes('sabio') || p.includes('fuerte') ? 'proud' : 'cheerful',
        borderPalette: 'from-amber-400 via-rose-500 to-sky-500',
        isCustomGenerated: true
      });

      setIsGeneratingAi(false);
      sounds.playCorrect();
    }, 600);
  };

  const handleSave = () => {
    sounds.playCorrect();
    onSaveAvatar(config);
  };

  return (
    <div className="space-y-6">
      {/* Top Preview Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <div className="relative">
          <CardinalAvatarRenderer
            avatar={config}
            size="2xl"
            className="shadow-lg ring-4 ring-white"
          />
          <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold shadow-xs">
            Único
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diseño Generado en Estudio</span>
          </div>

          <h3 className="font-display font-extrabold text-lg text-slate-900 leading-tight">
            {config.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Personaliza el plumaje, los patrones Kanasü y los accesorios tradicionales Wayuu para tu perfil.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={handleRandomize}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Shuffle className="w-3.5 h-3.5 text-rose-600" />
              <span>🎲 Aleatorio</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Guardar Este Avatar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setMode('studio')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            mode === 'studio'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-rose-600" />
          <span>Estudio de Tejidos y Plumaje</span>
        </button>

        <button
          onClick={() => setMode('ai')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            mode === 'ai'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wand2 className="w-4 h-4 text-amber-500" />
          <span>Generar con Descripción (IA)</span>
        </button>
      </div>

      {mode === 'studio' ? (
        <div className="space-y-5">
          {/* 1. Body Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-rose-600" />
              <span>Color del Plumaje del Cardenal</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BODY_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    sounds.playPop();
                    setConfig({ ...config, bodyColor: c.hex, crestColor: c.crest });
                  }}
                  className={`p-2 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    config.bodyColor === c.hex
                      ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-200'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full shrink-0 shadow-xs border border-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[11px] font-semibold text-slate-700 line-clamp-1">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Wayuu Kanasü Textile Pattern */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-amber-600" />
              <span>Patrón de Tejido Wayuu (Kanasü)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    sounds.playPop();
                    setConfig({ ...config, chestPattern: p.id });
                  }}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    config.chestPattern === p.id
                      ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-200'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{p.label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{p.meaning}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Accessories & Expression */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Accesorio Wayuu
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {ACCESSORIES.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      sounds.playPop();
                      setConfig({ ...config, accessory: acc.id });
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                      config.accessory === acc.id
                        ? 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{acc.icon}</span>
                    <span className="text-[11px] truncate">{acc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Expresión del Cardenal
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {EXPRESSIONS.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => {
                      sounds.playPop();
                      setConfig({ ...config, eyeExpression: exp.id });
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                      config.eyeExpression === exp.id
                        ? 'border-sky-500 bg-sky-50 text-sky-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[11px]">{exp.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* AI Prompt Generator Mode */
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Describe cómo quieres tu Cardenal Guajiro
            </label>
            <p className="text-[11px] text-slate-500 mb-3">
              Describe colores, elementos de La Guajira, mochilas o accesorios ceremoniales:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ej: Cardenal turquesa con sombrero wayuu en Cabo de la Vela..."
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-rose-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerateFromAiPrompt();
                }}
              />
              <button
                onClick={handleGenerateFromAiPrompt}
                disabled={isGeneratingAi || !aiPrompt.trim()}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                {isGeneratingAi ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5" />
                )}
                <span>Generar</span>
              </button>
            </div>
          </div>

          {/* Quick inspiration chips */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Ideas rápidas para generar:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Cardenal dorado con mochila en las dunas de Taroa',
                'Cardenal sabio con collar sagrado Tumuma',
                'Cardenal rosa flamingo en las salinas de Manaure',
                'Cardenal esmeralda guerrero con pluma ceremonial'
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setAiPrompt(chip);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 hover:border-slate-400 transition"
                >
                  "{chip}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
