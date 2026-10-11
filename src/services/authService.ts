import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { User, UserRole } from '../types';
import { storage } from './storageService';

export interface AuthState {
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

class AuthService {
  private currentFirebaseUser: FirebaseUser | null = null;
  private listeners: Set<(user: FirebaseUser | null) => void> = new Set();
  private isInitialized = false;

  constructor() {
    onAuthStateChanged(auth, async (fbUser) => {
      this.currentFirebaseUser = fbUser;
      this.isInitialized = true;

      if (fbUser) {
        await this.syncFromCloud(fbUser);
      }

      this.listeners.forEach((listener) => listener(fbUser));
    });

    // Automatically sync changes to Firestore when user modifies progress
    storage.subscribe(() => {
      if (this.currentFirebaseUser) {
        const currentUser = storage.getUser();
        if (currentUser.id === this.currentFirebaseUser.uid) {
          this.saveToCloud(currentUser);
        }
      }
    });
  }

  public subscribe(listener: (user: FirebaseUser | null) => void): () => void {
    this.listeners.add(listener);
    if (this.isInitialized) {
      listener(this.currentFirebaseUser);
    }
    return () => this.listeners.delete(listener);
  }

  public getFirebaseUser(): FirebaseUser | null {
    return this.currentFirebaseUser;
  }

  public isAuthenticated(): boolean {
    return !!this.currentFirebaseUser;
  }

  /**
   * Syncs user profile between Firestore and local storageService
   */
  public async syncFromCloud(fbUser: FirebaseUser): Promise<User> {
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userRef);

      const localUser = storage.getUser();
      let updatedUser: User;

      if (snap.exists()) {
        const cloudData = snap.data() as Partial<User>;
        updatedUser = {
          ...localUser,
          ...cloudData,
          id: fbUser.uid,
          name: cloudData.name || fbUser.displayName || localUser.name,
          email: fbUser.email || localUser.email,
        };
      } else {
        // Create initial cloud record for new user
        updatedUser = {
          ...localUser,
          id: fbUser.uid,
          name: fbUser.displayName || localUser.name || 'Estudiante Guajiro',
          email: fbUser.email || '',
          joinedAt: new Date().toISOString().split('T')[0]
        };
        await setDoc(userRef, {
          ...updatedUser,
          updatedAt: new Date().toISOString()
        });
      }

      storage.setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.warn('Error fetching Firestore user (using local cache):', err);
      return storage.getUser();
    }
  }

  /**
   * Save current user state to Firestore if signed in
   */
  public async saveToCloud(user: User): Promise<void> {
    if (!this.currentFirebaseUser) return;
    try {
      const userRef = doc(db, 'users', this.currentFirebaseUser.uid);
      await setDoc(
        userRef,
        {
          ...user,
          id: this.currentFirebaseUser.uid,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not save to Firestore (offline):', err);
    }
  }

  /**
   * Google Sign In
   */
  public async signInWithGoogle(): Promise<User> {
    const result = await signInWithPopup(auth, googleProvider);
    return await this.syncFromCloud(result.user);
  }

  /**
   * Email and password sign-in
   */
  public async signInWithEmail(email: string, pass: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return await this.syncFromCloud(result.user);
  }

  /**
   * Email and password registration
   */
  public async signUpWithEmail(
    email: string,
    pass: string,
    displayName: string,
    role: UserRole = 'student'
  ): Promise<User> {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }

    const localUser = storage.getUser();
    const newUser: User = {
      ...localUser,
      id: result.user.uid,
      name: displayName || 'Estudiante',
      email: email,
      role: role,
      joinedAt: new Date().toISOString().split('T')[0]
    };

    try {
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        ...newUser,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Could not write initial user to Firestore:', err);
    }

    storage.setUser(newUser);
    return newUser;
  }

  /**
   * Send password reset email
   */
  public async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Sign out current user
   */
  public async logOut(): Promise<void> {
    await signOut(auth);
    this.currentFirebaseUser = null;
    storage.resetSession();
  }
}

export const authService = new AuthService();
