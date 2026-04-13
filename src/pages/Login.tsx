import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/src/store/useAuth";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { GraduationCap, AlertCircle } from "lucide-react";

export function Login() {
  // Trazemos o "user" do useAuth para saber se ele já entrou
  const { login, register, error, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Hook para mudar de página
  const navigate = useNavigate();

  // O "Efeito Mágico": Fica a observar. Se o "user" existir (logou com sucesso), vai para o Painel!
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isRegistering) {
      await register(email, password);
    } else {
      await login(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-slate-950 p-4 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-4xl shadow-xl border border-slate-100 dark:border-slate-800 text-center">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
        </div>

        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AcaManager
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isRegistering
              ? "Cria a tua conta para começar."
              : "Entra com o teu e-mail e senha."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm text-left">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              E-mail
            </label>
            <Input
              type="email"
              placeholder="teu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Senha
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base mt-2">
            {isRegistering ? "Criar Conta" : "Entrar"}
          </Button>
        </form>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline bg-transparent border-none cursor-pointer"
          >
            {isRegistering
              ? "Já tens uma conta? Faz login."
              : "Não tens conta? Cria uma agora."}
          </button>
        </div>
      </div>
    </div>
  );
}
