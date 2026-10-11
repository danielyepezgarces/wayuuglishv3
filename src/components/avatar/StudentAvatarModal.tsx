import React, { useState } from 'react';
import { User, CardinalAvatarConfig } from '../../types';
import { storage } from '../../services/storageService';
import { sounds } from '../../services/soundEffects';
import { CARDINAL_PRESETS } from '../../data/cardinalPresets';
import { CardinalAvatarRenderer } from './CardinalAvatarRenderer';
import { UniqueAvatarGenerator } from './UniqueAvatarGenerator';
import {
  X,
  Sparkles,
  Check,
  Palette,
  Wand2,
  Flame,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface StudentAvatarModalProps {
  user: User;
  onClose: () => void;
}

export const StudentAvatarModal: React.FC<StudentAvatarModalProps> = ({
  user,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'generator'>('presets');
  const currentAvatarId = typeof user.avatar === 'object' ? user.avatar?.id : user.avatar;

  const handleSelectPreset = (preset: CardinalAvatarConfig) => {
    sounds.playCorrect();
    storage.setUserAvatar(preset);
  };

  const handleSaveCustom = (customAvatar: CardinalAvatarConfig) => {
    storage.setUserAvatar(customAvatar);
    setActiveTab('presets');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        {/* Header Hero */}
        <div className="relative p-6 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <CardinalAvatarRenderer
              avatar={user.avatar}
              fallbackSeed={{ id: user.id, name: user.name }}
              size="lg"
              className="ring-2 ring-white/50 shadow-md"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-1">
                <span>Avatar del Estudiante</span>
                <span>·</span>
                <span>Cardenal Guajiro</span>
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">
                Elige tu Cardenal Wayuu
              </h2>
              <div className="text-xs text-white/80">
                Inspirado en el ave emblemática de La Guajira y los tejidos tradicionales
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-4 shrink-0 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'presets'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Colección de Estilos Cardenal ({CARDINAL_PRESETS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'generator'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-500" />
            <span>Generar Diseño Único</span>
          </button>
        </div>

        {/* Content Area with Scroll */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'presets' ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 leading-relaxed">
                Cada estilo refleja una zona sagrada de La Guajira y técnicas ancestrales de tejido Wayuu como el Kanasü. Haz clic en cualquiera para activarlo inmediatamente:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CARDINAL_PRESETS.map((preset) => {
                  const isSelected = currentAvatarId === preset.id;

                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-3.5 relative group ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/60 shadow-sm ring-2 ring-rose-200'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 shadow-xs'
                      }`}
                    >
                      <CardinalAvatarRenderer
                        avatar={preset}
                        size="lg"
                        className="shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-display font-bold text-sm text-slate-900 truncate">
                            {preset.name}
                          </h4>

                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 group-hover:text-rose-600 font-bold transition">
                              Elegir
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                          {preset.description}
                        </p>

                        <div className="mt-2.5 flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {preset.chestPattern.replace('kanasu-', 'Kanasü ')}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {preset.accessory.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Banner promoting the unique generator */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      ¿Prefieres un diseño totalmente exclusivo?
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Usa el generador interactivo con combinaciones ilimitadas de Kanasü y colores.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('generator')}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition shadow-xs shrink-0"
                >
                  Abrir Generador
                </button>
              </div>
            </div>
          ) : (
            <UniqueAvatarGenerator
              onSaveAvatar={handleSaveCustom}
              initialConfig={typeof user.avatar === 'object' ? user.avatar : null}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span>Racha activa: <strong>{user.streak} días</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition shadow-xs"
          >
            Listo / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
