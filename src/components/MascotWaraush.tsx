import React from 'react';

interface MascotProps {
  mood?: 'happy' | 'celebrate' | 'thinking' | 'encouraging' | 'sad';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
}

export const MascotWaraush: React.FC<MascotProps> = ({
  mood = 'happy',
  size = 'md',
  message,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56'
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {message && (
        <div className="relative mb-3 max-w-xs px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm font-medium text-slate-800 text-center animate-fade-in">
          {message}
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
          <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-slate-200 -z-10" />
        </div>
      )}

      <div className={`relative ${sizeMap[size]} transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow beneath bird */}
          <ellipse cx="80" cy="148" rx="42" ry="7" fill="#000000" fillOpacity="0.12" />

          {/* Tail Feathers */}
          <path
            d="M 38 105 C 22 115 15 130 18 138 C 28 137 45 125 54 116 Z"
            fill="#9F1239"
          />
          <path
            d="M 44 112 C 30 126 24 140 28 144 C 38 142 52 130 58 120 Z"
            fill="#BE123C"
          />

          {/* Little bird legs */}
          <line x1="68" y1="135" x2="68" y2="148" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          <line x1="92" y1="135" x2="92" y2="148" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          <path d="M 62 148 L 74 148" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          <path d="M 86 148 L 98 148" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />

          {/* Main Body - Cardinal Red */}
          <path
            d="M 80 40 C 114 40 128 72 128 100 C 128 126 106 142 80 142 C 54 142 32 126 32 100 C 32 72 46 40 80 40 Z"
            fill="#E11D48"
          />

          {/* Tummy highlight */}
          <path
            d="M 80 75 C 98 75 110 92 110 114 C 110 132 96 140 80 140 C 64 140 50 132 50 114 C 50 92 62 75 80 75 Z"
            fill="#F43F5E"
          />

          {/* Crest / Cresta de Cardenal Guajiro */}
          <path
            d="M 80 40 C 76 22 84 10 94 4 C 88 18 84 28 85 40 Z"
            fill="#BE123C"
          />
          <path
            d="M 74 42 C 68 26 73 14 80 8 C 76 22 74 30 76 42 Z"
            fill="#E11D48"
          />

          {/* Traditional Wayuu Sash (Kanaas Geometric Pattern across body) */}
          <g>
            {/* Belt strap base */}
            <path
              d="M 45 106 Q 80 120 115 106 Q 115 114 80 128 Q 45 114 45 106 Z"
              fill="#0F766E"
            />
            {/* Wayuu Kanaas diamond accents (Siwottouya pattern) */}
            <polygon points="62,111 67,116 62,121 57,116" fill="#FBBF24" />
            <polygon points="80,115 85,120 80,125 75,120" fill="#F43F5E" />
            <polygon points="98,111 103,116 98,121 93,116" fill="#FBBF24" />
            <circle cx="71" cy="118" r="2.2" fill="#38BDF8" />
            <circle cx="89" cy="118" r="2.2" fill="#38BDF8" />
          </g>

          {/* Face mask around eyes and beak (black mask characteristic of Cardinal bird) */}
          <path
            d="M 68 62 C 68 56 92 56 92 62 C 102 68 106 82 96 90 C 86 96 74 96 64 90 C 54 82 58 68 68 62 Z"
            fill="#1E293B"
          />

          {/* Eyes depending on mood */}
          {mood === 'happy' && (
            <>
              {/* Left Eye */}
              <circle cx="68" cy="70" r="7" fill="#FFFFFF" />
              <circle cx="70" cy="70" r="4" fill="#0F172A" />
              <circle cx="71.5" cy="68.5" r="1.5" fill="#FFFFFF" />
              {/* Right Eye */}
              <circle cx="92" cy="70" r="7" fill="#FFFFFF" />
              <circle cx="94" cy="70" r="4" fill="#0F172A" />
              <circle cx="95.5" cy="68.5" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {mood === 'celebrate' && (
            <>
              {/* Sparkle star eyes */}
              <path d="M 68 65 Q 68 73 64 73 Q 68 73 68 81 Q 68 73 72 73 Q 68 73 68 65" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
              <path d="M 92 65 Q 92 73 88 73 Q 92 73 92 81 Q 92 73 96 73 Q 92 73 92 65" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
            </>
          )}

          {mood === 'thinking' && (
            <>
              <circle cx="68" cy="68" r="7" fill="#FFFFFF" />
              <circle cx="70" cy="66" r="3.5" fill="#0F172A" />
              <line x1="63" y1="62" x2="74" y2="60" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

              <circle cx="92" cy="68" r="7" fill="#FFFFFF" />
              <circle cx="94" cy="66" r="3.5" fill="#0F172A" />
              <line x1="86" y1="60" x2="97" y2="62" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {mood === 'encouraging' && (
            <>
              {/* Wink left eye */}
              <path d="M 63 71 Q 68 65 73 71" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Open right eye */}
              <circle cx="92" cy="70" r="7" fill="#FFFFFF" />
              <circle cx="94" cy="70" r="4" fill="#0F172A" />
              <circle cx="95.5" cy="68.5" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {mood === 'sad' && (
            <>
              <circle cx="68" cy="72" r="6" fill="#FFFFFF" />
              <circle cx="69" cy="74" r="3" fill="#0F172A" />
              <circle cx="92" cy="72" r="6" fill="#FFFFFF" />
              <circle cx="91" cy="74" r="3" fill="#0F172A" />
              {/* Tear drop */}
              <circle cx="99" cy="84" r="2.5" fill="#38BDF8" />
            </>
          )}

          {/* Cardinal's Yellow/Orange Beak */}
          <path
            d="M 72 74 Q 80 66 88 74 L 80 87 Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="1"
          />
          <line x1="74" y1="76" x2="86" y2="76" stroke="#B45309" strokeWidth="1.2" />

          {/* Wings */}
          {mood === 'celebrate' ? (
            <>
              {/* Wings raised cheering */}
              <path
                d="M 44 95 C 22 75 14 55 24 50 C 34 46 45 70 52 86 Z"
                fill="#BE123C"
              />
              <path
                d="M 116 95 C 138 75 146 55 136 50 C 126 46 115 70 108 86 Z"
                fill="#BE123C"
              />
            </>
          ) : (
            <>
              {/* Rested wing with feather layers */}
              <path
                d="M 38 90 C 32 105 38 122 56 126 C 50 115 46 102 52 86 Z"
                fill="#BE123C"
              />
              <path
                d="M 122 90 C 128 105 122 122 104 126 C 110 115 114 102 108 86 Z"
                fill="#BE123C"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};
