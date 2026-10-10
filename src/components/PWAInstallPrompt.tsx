import React, { useState, useEffect } from 'react';
import { Download, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(standalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (!deferredPrompt && !isIOS) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Instalar Wayuuglish en tu dispositivo para usar sin internet"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Instalar App Offline</span>
        <span className="md:hidden">Instalar</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-2">Instalar en iPhone o iPad</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Para usar Wayuuglish sin conexión:
              <br />
              1. Toca el botón <strong>Compartir</strong> en la barra inferior de Safari.
              <br />
              2. Elige <strong>"Agregar a pantalla de inicio"</strong>.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
