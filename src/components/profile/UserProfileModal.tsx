import React, { useState } from 'react';
import { User } from '../../types';
import { storage } from '../../services/storageService';
import { DailyGoalSettings } from './DailyGoalSettings';
import { NotificationSettings } from './NotificationSettings';
import { CardinalAvatarRenderer } from '../avatar/CardinalAvatarRenderer';
import { StudentAvatarModal } from '../avatar/StudentAvatarModal';
import {
  User as UserIcon,
  X,
  Target,
  Flame,
  Zap,
  Users,
  Calendar,
  CheckCircle2,
  Award,
  Globe,
  Bell,
  Sparkles,
  Shield,
  LogOut,
  LogIn
} from 'lucide-react';
import { authService } from '../../services/authService';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  onOpenJoinModal: () => void;
  onOpenAuthModal?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  onOpenJoinModal,
  onOpenAuthModal
}) => {
  const [activeTab, setActiveTab] = useState<'goal' | 'notifications' | 'account' | 'details'>('goal');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(authService.getFirebaseUser());

  React.useEffect(() => {
    const unsub = authService.subscribe((fbUser) => {
      setFirebaseUser(fbUser);
    });
    return unsub;
  }, []);

  const classrooms = storage.getClassrooms();
  const currentClassroom = classrooms.find(
    (c) => c.code.toUpperCase() === (user.classroomCode || '').toUpperCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        {/* Header with profile hero */}
        <div className="relative p-6 bg-gradient-to-r from-rose-600 to-amber-500 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
              <CardinalAvatarRenderer
                avatar={user.avatar}
                fallbackSeed={{ id: user.id, name: user.name }}
                size="xl"
                className="ring-4 ring-white/30 shadow-lg transition-transform group-hover:scale-105"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-white text-rose-700 text-[10px] font-bold shadow-xs flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Cambiar</span>
              </span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-1">
                <span className="capitalize">{user.role === 'student' ? 'Estudiante' : 'Docente'}</span>
                <span>·</span>
                <span>{user.classroomCode || 'Sin Aula'}</span>
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">
                {user.name}
              </h2>
              <div className="text-xs text-white/80">{user.email}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 text-center py-3 px-4 shrink-0">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Racha Activa</span>
            <div className="flex items-center gap-1 text-amber-600 font-extrabold text-base mt-0.5">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
              <span>{user.streak} días</span>
            </div>
          </div>
          <div className="flex flex-col items-center border-x border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Puntos Totales</span>
            <div className="flex items-center gap-1 text-sky-600 font-extrabold text-base mt-0.5">
              <Zap className="w-4 h-4 fill-sky-500 text-sky-600" />
              <span>{user.xp} XP</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Lecciones Hechas</span>
            <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-base mt-0.5">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>{user.completedLessons.length}</span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-4 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('goal')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'goal'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Objetivo Diario</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notificaciones Push</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'account'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Mi Cuenta</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Aula & Sincronización</span>
          </button>
        </div>

        {/* Modal Content with Scroll */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'goal' && (
            <DailyGoalSettings user={user} />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings user={user} />
          )}

          {activeTab === 'account' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${firebaseUser ? 'bg-emerald-600' : 'bg-slate-400'}`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900">
                        {firebaseUser ? 'Cuenta Sincronizada' : 'Modo Invitado'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {firebaseUser
                          ? 'Tus logros, lecciones y racha están respaldados de forma segura.'
                          : 'Tus progresos actuales están guardados en este dispositivo.'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${firebaseUser ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                    {firebaseUser ? 'Activa' : 'Sin registrar'}
                  </span>
                </div>

                {firebaseUser ? (
                  <div className="mt-4 pt-3 border-t border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 font-medium">Nombre:</span>
                      <span className="font-bold text-slate-800">{firebaseUser.displayName || user.name}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 font-medium">Correo:</span>
                      <span className="font-mono text-slate-700">{firebaseUser.email || user.email}</span>
                    </div>
                    <div className="pt-3 flex gap-2">
                      <button
                        onClick={async () => {
                          await authService.logOut();
                          onClose();
                        }}
                        className="w-full py-2 px-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-2xs"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t border-slate-200 space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Crea tu cuenta o inicia sesión para conservar tus puntos, participar en el aula escolar y acceder desde cualquier celular o computador.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenAuthModal) onOpenAuthModal();
                      }}
                      className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Iniciar Sesión / Registrarse</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2.5">
                <i className="fa-solid fa-wifi text-emerald-600 mt-0.5"></i>
                <div className="leading-relaxed">
                  <strong>Aprendizaje Sin Conexión:</strong> Todas las lecciones funcionan sin acceso a internet para que nunca se interrumpa tu estudio en la comunidad.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Aula Actual</div>
                {currentClassroom ? (
                  <div>
                    <div className="font-bold text-base text-slate-900">{currentClassroom.name}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      Profesor titular: <strong>{currentClassroom.teacherName}</strong>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Código de registro: <code className="font-mono font-bold text-rose-600">{currentClassroom.code}</code>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">
                    Aún no estás inscrito en un aula con código docente.
                  </div>
                )}

                <button
                  onClick={() => {
                    onClose();
                    onOpenJoinModal();
                  }}
                  className="mt-3 px-3.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                >
                  {currentClassroom ? 'Cambiar a otra aula' : 'Ingresar código de aula'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Miembro desde:</span>
                  <span className="font-medium text-slate-800">{user.joinedAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Ruta de aprendizaje:</span>
                  <span className="font-bold text-rose-600 uppercase">{user.currentTrack}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Estado de sincronización:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sincronizado y respaldado</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition shadow-xs"
          >
            Listo / Guardar
          </button>
        </div>
      </div>

      {/* Embedded Student Avatar Customizer Modal */}
      {showAvatarModal && (
        <StudentAvatarModal
          user={user}
          onClose={() => setShowAvatarModal(false)}
        />
      )}
    </div>
  );
};
