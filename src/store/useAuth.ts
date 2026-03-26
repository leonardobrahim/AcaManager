import { create } from 'zustand';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => {
  // Observador do Firebase: Fica escutando se o usuário logou ou deslogou
  onAuthStateChanged(auth, (user) => {
    set({ user, loading: false });
  });

  return {
    user: null,
    loading: true, // Começa como true até o Firebase responder
    loginWithGoogle: async () => {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        console.error("Erro ao fazer login:", error);
      }
    },
    logout: async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Erro ao sair:", error);
      }
    },
  };
});