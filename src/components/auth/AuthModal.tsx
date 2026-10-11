import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await authService.signInWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error al conectar con Google';
      if (msg.includes('popup-closed-by-user')) {
        setErrorMessage('La ventana de Google se cerró antes de completar el acceso.');
      } else if (msg.includes('network-request-failed')) {
        setErrorMessage('Error de red. Verifica tu conexión a internet.');
      } else {
        setErrorMessage('No se pudo iniciar sesión con Google. Intenta con correo y contraseña.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          throw new Error('Por favor completa todos los campos.');
        }
        await authService.signInWithEmail(email.trim(), password);
        if (onSuccess) onSuccess();
        onClose();
      } else if (mode === 'register') {
        if (!email.trim() || !password || !name.trim()) {
          throw new Error('Por favor ingresa tu nombre, correo y contraseña.');
        }
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }
        await authService.signUpWithEmail(email.trim(), password, name.trim(), role);
        if (onSuccess) onSuccess();
        onClose();
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          throw new Error('Por favor ingresa tu correo electrónico.');
        }
        await authService.resetPassword(email.trim());
        setSuccessMessage('Te hemos enviado un enlace para restablecer tu contraseña a tu correo.');
      }
    } catch (err: unknown) {
      console.error(err);
      const code = (err as { code?: string }).code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setErrorMessage('Correo o contraseña incorrectos.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMessage('Este correo ya está registrado. Por favor inicia sesión.');
      } else if (code === 'auth/weak-password') {
        setErrorMessage('La contraseña es muy débil (mínimo 6 caracteres).');
      } else if (code === 'auth/invalid-email') {
        setErrorMessage('El formato de correo no es válido.');
      } else {
        setErrorMessage(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Wayuu Banner Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full w-8 h-8 flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-xs">
              <i className="fa-solid fa-feather text-amber-300 text-lg"></i>
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl tracking-tight leading-none text-white">
                Wayuuglish ID
              </h3>
              <p className="text-xs text-rose-100 font-medium mt-1">
                {mode === 'login' && 'Accede a tu progreso, rachas y aula'}
                {mode === 'register' && 'Crea tu cuenta institucional o libre'}
                {mode === 'forgot' && 'Recuperación de contraseña'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6">
          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <i className="fa-solid fa-arrow-right-to-bracket text-[11px] text-rose-600"></i>
                <span>Iniciar Sesión</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <i className="fa-solid fa-user-plus text-[11px] text-rose-600"></i>
                <span>Crear Cuenta</span>
              </button>
            </div>
          )}

          {/* Error & Success Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
              <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5 shrink-0"></i>
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
              <i className="fa-solid fa-circle-check text-emerald-600 mt-0.5 shrink-0"></i>
              <div className="leading-snug">{successMessage}</div>
            </div>
          )}

          {/* One-Click Google Authentication */}
          {mode !== 'forgot' && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-xs transition disabled:opacity-50"
              >
                <i className="fa-brands fa-google text-rose-600 text-sm"></i>
                <span>Continuar con Google Workspace</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                    o con tu correo
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <i className="fa-solid fa-user text-xs"></i>
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Katia Uriana Pushaina"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 focus:outline-hidden transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <i className="fa-solid fa-envelope text-xs"></i>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="estudiante@escuela.edu o usuario@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 focus:outline-hidden transition"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Contraseña</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage(null);
                      }}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold transition"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <i className="fa-solid fa-lock text-xs"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-9 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 focus:outline-hidden transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Rol Principal en Wayuuglish
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left flex items-center gap-2.5 transition ${
                      role === 'student'
                        ? 'border-rose-600 bg-rose-50/70 text-rose-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <i className="fa-solid fa-graduation-cap text-rose-600"></i>
                    <div>
                      <div className="font-bold">Estudiante</div>
                      <div className="text-[10px] text-slate-500">Aprende y compite</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left flex items-center gap-2.5 transition ${
                      role === 'teacher'
                        ? 'border-rose-600 bg-rose-50/70 text-rose-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <i className="fa-solid fa-chalkboard-user text-rose-600"></i>
                    <div>
                      <div className="font-bold">Docente</div>
                      <div className="text-[10px] text-slate-500">Crea aulas y lecciones</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Procesando...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <span>Ingresar a Wayuuglish</span>
                </>
              ) : mode === 'register' ? (
                <>
                  <i className="fa-solid fa-check"></i>
                  <span>Registrar Cuenta</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Enviar Correo de Recuperación</span>
                </>
              )}
            </button>
          </form>

          {/* Footer of modal */}
          {mode === 'forgot' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-rose-600 hover:underline font-semibold flex items-center justify-center gap-1.5 mx-auto"
              >
                <i className="fa-solid fa-arrow-left text-[10px]"></i>
                <span>Volver al Inicio de Sesión</span>
              </button>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-cloud-arrow-up text-emerald-600"></i>
              <span>Sincronización en la Nube</span>
            </span>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 font-medium transition"
            >
              Continuar como invitado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
