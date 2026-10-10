import React, { useState, useEffect } from 'react';
import { storage } from '../services/storageService';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export const OfflineSyncBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(storage.getOnlineStatus());
  const [queueCount, setQueueCount] = useState(storage.getSyncQueue().length);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(storage.getLastSyncTime());
  const [justSynced, setJustSynced] = useState(false);

  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setIsOnline(storage.getOnlineStatus());
      setQueueCount(storage.getSyncQueue().length);
      setLastSync(storage.getLastSyncTime());
    });
    return unsubscribe;
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await storage.triggerSync();
    setIsSyncing(false);
    setJustSynced(true);
    setTimeout(() => setJustSynced(false), 2500);
  };

  // If online and no pending items, keep it clean and quiet
  if (isOnline && queueCount === 0 && !justSynced) {
    return null;
  }

  return (
    <div
      className={`w-full px-4 py-2 text-xs font-medium border-b transition-colors flex items-center justify-between gap-3 ${
        !isOnline
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : justSynced
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-sky-50 border-sky-200 text-sky-900'
      }`}
    >
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Modo Sin Conexión (Offline-First):</strong> Puedes seguir aprendiendo y completando lecciones sin internet en la ranchería.
            </span>
          </>
        ) : justSynced ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>¡Sincronización en la nube completada! El docente ya puede ver tu progreso.</span>
          </>
        ) : (
          <>
            <Wifi className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              Conexión restablecida · {queueCount} cambios pendientes por sincronizar.
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Última sync: {lastSync}
        </span>
        {isOnline && queueCount > 0 && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-md shadow-xs hover:bg-slate-50 active:scale-95 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-600' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar ahora'}
          </button>
        )}
      </div>
    </div>
  );
};
