"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { decodeJwtPayload } from "@/lib/auth";
import AuthHeader from "@/components/layout/AuthHeader";
import AuthFooter from "@/components/layout/AuthFooter";

const ROLE_DASHBOARDS: Record<string, string> = {
  student:      "/student/dashboard",
  teacher:      "/teacher/dashboard",
  school_admin: "/school_admin/dashboard",
  super_admin:  "/super_admin/dashboard",
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const login = useAuthStore((s) => s.login);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide";
    if (!password) newErrors.password = "Le mot de passe est requis";
    else if (password.length < 6) newErrors.password = "Minimum 6 caractères";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    setApiError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Email ou mot de passe incorrect");
      const data = await res.json();
      login(data.access_token);
      const payload = decodeJwtPayload(data.access_token);
      router.push(ROLE_DASHBOARDS[payload?.role ?? ""] ?? "/");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthHeader questionText="Nouveau ?" linkText="Créer un compte" linkHref="/register" />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white/5 dark:bg-gray-800 border border-white/10 dark:border-gray-400 rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-accent/20">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Welcome Back</h1>
            <p className="text-muted text-sm text-center">Accédez à votre espace EasyLearn</p>
          </div>

          {justRegistered && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              Compte créé avec succès ! Vous pouvez vous connecter.
            </div>
          )}

          {apiError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {apiError}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest text-muted uppercase">
                Email Address
              </label>
              <div className="flex items-center bg-surface border border-white/10 dark:border-gray-400 rounded-xl focus-within:ring-2 focus-within:ring-accent overflow-hidden">
                <span className="pl-3 text-muted"><Mail size={14} /></span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder-gray-500 focus:outline-none"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-widest text-muted uppercase">
                  Password
                </label>
                <button type="button" className="text-xs text-accent hover:opacity-80 transition-opacity">
                  Forgot password?
                </button>
              </div>
              <div className="flex items-center bg-surface border border-white/10 dark:border-gray-400 rounded-xl focus-within:ring-2 focus-within:ring-accent overflow-hidden">
                <span className="pl-3 text-muted"><Lock size={14} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3 text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-accent hover:opacity-90 disabled:opacity-50 text-white font-semibold text-sm transition-opacity"
            >
              {isLoading ? "Connexion..." : "Sign In →"}
            </button>

            <p className="text-center text-sm text-muted mt-2">
              Pas de compte ?{" "}
              <a href="/register" className="text-accent hover:opacity-80 font-medium transition-opacity">
                Créer un compte
              </a>
            </p>
          </form>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}
