import { CardinalAvatarConfig } from '../types';

export const CARDINAL_PRESETS: CardinalAvatarConfig[] = [
  {
    id: 'preset-waraush-clasico',
    name: 'Waraush Tradicional',
    description: 'Cardenal rojo guajiro con penacho erguido de fuego y faja Wayuu de tonos cálidos.',
    bodyColor: '#E11D48',
    crestColor: '#9F1239',
    beakColor: '#F59E0B',
    chestPattern: 'kanasu-molokonoutaya',
    patternColorPrimary: '#FBBF24',
    patternColorSecondary: '#DC2626',
    accessory: 'mochila',
    eyeExpression: 'cheerful',
    borderPalette: 'from-rose-500 via-amber-500 to-rose-600'
  },
  {
    id: 'preset-dunas-taroa',
    name: 'Dunas de Taroa',
    description: 'Tonos bermellón y oro del desierto frente al mar, con sombrero mawisa tradicional.',
    bodyColor: '#EA580C',
    crestColor: '#C2410C',
    beakColor: '#FDE047',
    chestPattern: 'kanasu-pulikeruya',
    patternColorPrimary: '#06B6D4',
    patternColorSecondary: '#F59E0B',
    accessory: 'sombrero-wayuu',
    eyeExpression: 'focused',
    borderPalette: 'from-amber-400 via-orange-500 to-cyan-500'
  },
  {
    id: 'preset-cabo-vela',
    name: 'Cabo de la Vela',
    description: 'Inspirado en el contraste turquesa del Caribe y el rojo ancestral de las rancherías.',
    bodyColor: '#0284C7',
    crestColor: '#E11D48',
    beakColor: '#FBBF24',
    chestPattern: 'kanasu-pasuatalooshi',
    patternColorPrimary: '#F43F5E',
    patternColorSecondary: '#38BDF8',
    accessory: 'mochila',
    eyeExpression: 'curious',
    borderPalette: 'from-sky-400 via-cyan-500 to-rose-500'
  },
  {
    id: 'preset-tumuma-sagrada',
    name: 'Tumuma de Sabiduría',
    description: 'Porta el collar de cuentas sagradas Tumuma que protege a los sabios y palabreros (Pütchipü\'ü).',
    bodyColor: '#B91C1C',
    crestColor: '#7F1D1D',
    beakColor: '#F59E0B',
    chestPattern: 'kanasu-triangles',
    patternColorPrimary: '#10B981',
    patternColorSecondary: '#F59E0B',
    accessory: 'tumuma-necklace',
    eyeExpression: 'proud',
    borderPalette: 'from-red-600 via-emerald-500 to-amber-500'
  },
  {
    id: 'preset-manaure-salinas',
    name: 'Atardecer en Manaure',
    description: 'Reflejos magenta y rosa inspirados en las salinas marinas y los flamencos de La Guajira.',
    bodyColor: '#DB2777',
    crestColor: '#9D174D',
    beakColor: '#FCD34D',
    chestPattern: 'kanasu-molokonoutaya',
    patternColorPrimary: '#F472B6',
    patternColorSecondary: '#FDE047',
    accessory: 'feather-crest',
    eyeExpression: 'cheerful',
    borderPalette: 'from-pink-500 via-rose-400 to-amber-300'
  },
  {
    id: 'preset-macuira-oasis',
    name: 'Serranía de Macuira',
    description: 'Homenaje al bosque nublado en el corazón del desierto guajiro, con acentos esmeralda.',
    bodyColor: '#059669',
    crestColor: '#E11D48',
    beakColor: '#FBBF24',
    chestPattern: 'kanasu-pulikeruya',
    patternColorPrimary: '#F59E0B',
    patternColorSecondary: '#10B981',
    accessory: 'mochila',
    eyeExpression: 'curious',
    borderPalette: 'from-emerald-500 via-amber-400 to-rose-500'
  },
  {
    id: 'preset-noche-kasutaya',
    name: 'Noche Wayuu Estelar',
    description: 'Púrpura y zafiro de las noches despejadas donde los Wayuu leen las constelaciones.',
    bodyColor: '#4C1D95',
    crestColor: '#7C3AED',
    beakColor: '#FBBF24',
    chestPattern: 'stripes',
    patternColorPrimary: '#EC4899',
    patternColorSecondary: '#38BDF8',
    accessory: 'tumuma-necklace',
    eyeExpression: 'focused',
    borderPalette: 'from-purple-600 via-indigo-500 to-pink-500'
  },
  {
    id: 'preset-tejedor-real',
    name: 'Tejedor Real de Mochilas',
    description: 'Maestro del tejido fino con sombrero mawisa y patrones Kanasü de alta complejidad.',
    bodyColor: '#DC2626',
    crestColor: '#B91C1C',
    beakColor: '#F59E0B',
    chestPattern: 'kanasu-pasuatalooshi',
    patternColorPrimary: '#FBBF24',
    patternColorSecondary: '#0284C7',
    accessory: 'sombrero-wayuu',
    eyeExpression: 'proud',
    borderPalette: 'from-rose-600 via-amber-400 to-sky-500'
  }
];

// Deterministic generator if no avatar is explicitly chosen by student
export function generateDefaultCardinalForUser(userId: string, userName: string): CardinalAvatarConfig {
  let hash = 0;
  const str = userId + userName;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CARDINAL_PRESETS.length;
  const basePreset = CARDINAL_PRESETS[index];

  return {
    ...basePreset,
    id: `auto-${userId}`,
    name: `${basePreset.name} de ${userName.split(' ')[0]}`,
    seed: str
  };
}
