import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

// Unregister legacy Service Workers from previous versions to prevent cache errors
if (Platform.OS === 'web' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  }).catch(() => {});
}

registerRootComponent(App);
