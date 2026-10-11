import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from './firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export const authService = {
  async signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      return { success: false, error: err.message || 'Error en autenticación' };
    }
  },

  async signOut(): Promise<void> {
    await signOut(auth);
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  },
};
