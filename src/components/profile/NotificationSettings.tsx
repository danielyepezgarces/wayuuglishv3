import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { notifications } from '../../services/notificationService';
import { sounds } from '../../services/soundEffects';
import {
  Bell,
  BellOff,
  BellRing,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Sparkles,
  Send,
  ShieldCheck,
  Info
} from 'lucide-react';

interface NotificationSettingsProps {
  user: User;
}

const REMINDER_HOURS = [
  { value: '17:00', label: '5:00 PM (Tarde)' },
  { value: '18:00', label: '6:00 PM (Al caer el sol)' },
  { value: '19:00', label: '7:00 PM (Recomendado)' },
  { value: '20:00', label: '8:00 PM (Noche)' },
  { value: '21:00', label: '9:00 PM (Antes de dormir)' }
];

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ user }) => {
  const [isSupported, setIsSupported] = useState(notifications.isSupported());
  const [permission, setPermission] = useState<NotificationPermission>(
    notifications.getPermissionStatus()
  );
  const [isEnabled, setIsEnabled] = useState(notifications.isEnabledByUser());
  const [selectedTime, setSelectedTime] = useState(notifications.getReminderTime());
  const [testingStatus, setTestingStatus] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported(notifications.isSupported());
    setPermission(notifications.getPermissionStatus());
    setIsEnabled(notifications.isEnabledByUser());
    setSelectedTime(notifications.getReminderTime());
  }, []);

  const handleRequestPermission = async () => {
    sounds.playPop();
    const granted = await notifications.requestPermission();
    setPermission(notifications.getPermissionStatus());
    setIsEnabled(granted);
    if (granted) {
      notifications.scheduleNextReminder(user);
    }
  };

  const handleToggle = (checked: boolean) => {
    sounds.playPop();
    notifications.setEnabled(checked, user);
    setIsEnabled(checked);
  };

  const handleTimeChange = (time: string) => {
    sounds.playPop();
    setSelectedTime(time);
    notifications.setReminderTime(time, user);
  };

  const handleSendTest = async () => {
    setTestingStatus('Enviando notificación al navegador...');
    const ok = await notifications.sendTestNotification(user.streak);
    if (ok) {
      setTestingStatus('¡Notificación enviada con éxito! Revisa la bandeja de tu dispositivo.');
    } else {
      setTestingStatus('No se pudo enviar. Verifica los permisos de notificaciones del navegador.');
    }
    setTimeout(() => {
      setTestingStatus(null);
    }, 4500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Description */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BellRing className="w-5 h-5 text-rose-600" />
          <h3 className="font-display font-bold text-base text-slate-900">
            Notificaciones Push y Avisos de Racha
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Recibe recordatorios automáticos en tu navegador o móvil mediante el <strong>Service Worker</strong> para proteger tu racha (🔥) incluso cuando la app esté cerrada o sin conexión continua.
        </p>
      </div>

      {/* Main Push Activation Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isEnabled
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-rose-50 text-rose-600 border border-rose-200'
              }`}
            >
              {isEnabled ? (
                <Bell className="w-5 h-5 fill-emerald-500 text-emerald-600" />
              ) : (
                <BellOff className="w-5 h-5 text-rose-500" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  Recordatorios de Racha Diaria
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isEnabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isEnabled ? 'Activado' : 'Inactivo'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Waraush te enviará un aviso discreto si se acerca la noche y aún no has cumplido tu objetivo diario ({user.dailyGoalXp || 30} XP).
              </p>
            </div>
          </div>

          {/* Action button: Request permission or toggle */}
          {permission !== 'granted' ? (
            <button
              onClick={handleRequestPermission}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Activar Permisos</span>
            </button>
          ) : (
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => handleToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          )}
        </div>

        {/* Warning if blocked by browser */}
        {permission === 'denied' && (
          <div className="mt-3.5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Permiso bloqueado en el navegador:</strong> Para recibir avisos, haz clic en el candado o icono de configuración en la barra de direcciones de tu navegador y permite las notificaciones para este sitio.
            </div>
          </div>
        )}
      </div>

      {/* Reminder Hour Selection */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-xs text-slate-800">
              Hora de aviso preferida
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Hora local
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {REMINDER_HOURS.map((h) => {
            const isCurrent = selectedTime === h.value;
            return (
              <button
                key={h.value}
                onClick={() => handleTimeChange(h.value)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-left transition flex items-center justify-between ${
                  isCurrent
                    ? 'border-rose-400 bg-rose-50/60 text-rose-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <span>{h.label}</span>
                {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400">
          Si ya cumpliste tu meta del día antes de esta hora, la notificación no te molestará.
        </p>
      </div>

      {/* Interactive Push API Test Trigger */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              Probar notificación en este dispositivo
            </div>
            <div className="text-[11px] text-slate-500">
              Verifica cómo aparecerá la alerta de racha de {user.streak} días
            </div>
          </div>
        </div>

        <button
          onClick={handleSendTest}
          disabled={permission !== 'granted'}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            permission === 'granted'
              ? 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-xs'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-transparent'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Enviar Prueba</span>
        </button>
      </div>

      {/* Feedback banner after test */}
      {testingStatus && (
        <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 font-medium animate-fade-in flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{testingStatus}</span>
        </div>
      )}

      {/* Offline & Service Worker Explanation Card */}
      <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200/60 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="text-xs text-rose-950 leading-relaxed">
          <strong>Soporte Offline & Segundo Plano:</strong> Las notificaciones están vinculadas al Service Worker registrado (<code className="font-mono text-[11px] bg-rose-100 px-1 py-0.5 rounded">/sw.js</code>). Funcionan con la Push API para recordarte estudiar Wayuunaiki o Inglés incluso si cierras la pestaña o estás en zonas rurales con señal intermitente.
        </div>
      </div>
    </div>
  );
};
