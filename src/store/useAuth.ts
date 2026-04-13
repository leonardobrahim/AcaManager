import { create } from "zustand";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => {
  onAuthStateChanged(auth, (user) => {
    set({ user, loading: false });
  });

  return {
    user: null,
    loading: true,
    error: null,

    login: async (email, pass) => {
      set({ error: null });
      try {
        await signInWithEmailAndPassword(auth, email, pass);
      } catch (error: any) {
        set({
          error:
            "Erro ao entrar. Verifica se o e-mail e a senha estão corretos.",
        });
      }
    },

    register: async (email, pass) => {
      set({ error: null });
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
      } catch (error: any) {
        // Agora mostramos o erro real!
        if (error.code === "auth/email-already-in-use") {
          set({ error: "Este e-mail já está registado! Tente fazer login." });
        } else if (error.code === "auth/operation-not-allowed") {
          set({
            error: "O login por e-mail/senha não está ativado no Firebase.",
          });
        } else if (error.code === "auth/weak-password") {
          set({ error: "A senha é muito fraca. Use pelo menos 6 caracteres." });
        } else {
          set({ error: "Erro ao criar conta: " + error.message });
        }
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
