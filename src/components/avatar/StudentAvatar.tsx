import React, { useState } from 'react';
import { User } from '../../types';
import { CardinalAvatarRenderer } from './CardinalAvatarRenderer';
import { StudentAvatarModal } from './StudentAvatarModal';
import { sounds } from '../../services/soundEffects';
import { Sparkles, Palette } from 'lucide-react';

interface StudentAvatarProps {
  user: User;
  onOpenProfile?: () => void;
  className?: string;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  user,
  onOpenProfile,
  className = ''
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    sounds.playPop();
    setModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        title="Avatar del Cardenal Wayuu (Haz clic para personalizar)"
        className={`group relative flex items-center gap-2 p-1 sm:pr-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-200 shadow-xs hover:border-rose-300 ${className}`}
      >
        <div className="relative">
          {/* Cardinal Avatar Renderer with automatic fallback seed */}
          <CardinalAvatarRenderer
            avatar={user.avatar}
            fallbackSeed={{ id: user.id, name: user.name }}
            size="sm"
            className="transition-transform group-hover:scale-105"
          />

          {/* Sparkle badge indicating it can be customized */}
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs border border-white">
            <Sparkles className="w-2.5 h-2.5" />
          </span>
        </div>

        {/* Student Name */}
        <div className="text-left hidden lg:block">
          <div className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[85px] leading-tight">
            {user.name.split(' ')[0]}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Cardenal
          </div>
        </div>
      </button>

      {modalOpen && (
        <StudentAvatarModal
          user={user}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};
