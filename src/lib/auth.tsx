'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from './firebase';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';

interface AuthUser {
  uid: string;
  name: string;
  email: string;
  role: 'director' | 'wholesaler';
}

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'director' | 'wholesaler') => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (role: 'director' | 'wholesaler') => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const cred = await getRedirectResult(auth);
        if (cred && cred.user) {
          const pendingRole = localStorage.getItem('annapurna_pending_role');
          const existingRole = cred.user.displayName?.split('|')[1];
          if (!existingRole && pendingRole) {
            const name = cred.user.displayName || 'User';
            await updateProfile(cred.user, { displayName: `${name}|${pendingRole}` });
          }
          localStorage.removeItem('annapurna_pending_role');
        }
      } catch (e) {
        console.error('Redirect sign-in error', e);
      }
    };
    handleRedirect();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const parts = fbUser.displayName?.split('|') || [fbUser.email || 'User', 'director'];
        setUser({
          uid: fbUser.uid,
          name: parts[0],
          email: fbUser.email || '',
          role: (parts[1] as 'director' | 'wholesaler') || 'director',
        });
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string, role: 'director' | 'wholesaler') => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: `${name}|${role}` });
  };

  
  const loginWithGoogle = async (role: 'director' | 'wholesaler') => {
    // Store the selected role in localStorage so we can retrieve it after redirect
    if (typeof window !== 'undefined') {
      localStorage.setItem('annapurna_pending_role', role);
    }
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };
  
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
