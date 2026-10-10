import React, { useState } from 'react';
import { storage } from '../../services/storageService';
import { User, Classroom } from '../../types';
import { Users, CheckCircle2, AlertCircle, Copy, X } from 'lucide-react';

interface JoinClassroomModalProps {
  user: User;
  onClose: () => void;
}

export const JoinClassroomModal: React.FC<JoinClassroomModalProps> = ({ user, onClose }) => {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<{ success?: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const classrooms = storage.getClassrooms();
  const currentClassroom = classrooms.find(
    (c) => c.code.toUpperCase() === (user.classroomCode || '').toUpperCase()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const res = storage.joinClassroomByCode(code.trim());
    if (res.success) {
      setFeedback({ success: true, text: res.message });
      setCode('');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setFeedback({ success: false, text: res.message });
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900">
              {currentClassroom ? 'Mi Aula Virtual' : 'Unirse con Código Docente'}
            </h2>
            <p className="text-xs text-slate-500">
              Conecta tu cuenta al salón de tu profesor para seguimiento de notas y rachas.
            </p>
          </div>
        </div>

        {currentClassroom && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <div className="text-xs text-emerald-800 font-semibold mb-1">
              Actualmente inscrito en:
            </div>
            <div className="text-sm font-bold text-slate-900">{currentClassroom.name}</div>
            <div className="text-xs text-slate-600 mt-1">
              Profesor: <strong>{currentClassroom.teacherName}</strong>
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-xs text-slate-600">
              <span>Código: <code className="font-mono font-bold text-emerald-800">{currentClassroom.code}</code></span>
              <button
                onClick={() => handleCopyCode(currentClassroom.code)}
                className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {currentClassroom ? 'Cambiar a otra aula (Ingresa nuevo código)' : 'Ingresa el código proporcionado por tu profesor'}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: WAYUU-2026"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-base uppercase font-bold tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Prueba con códigos de muestra: <code className="font-mono text-emerald-600 cursor-pointer" onClick={() => setCode('WAYUU-2026')}>WAYUU-2026</code> o <code className="font-mono text-emerald-600 cursor-pointer" onClick={() => setCode('GUAJIRA-789')}>GUAJIRA-789</code>
            </p>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedback.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {feedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
            >
              Unirse al Aula
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
