"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
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
      console.log("Login success", data);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] dark:bg-gray-50">
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 dark:border-gray-200">
        <span className="text-white dark:text-gray-900 font-bold text-sm">EasyLearn</span>
        <div className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
          <span>Nouveau ?</span>
          <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Créer un compte
          </a>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#111118] dark:bg-white dark:shadow-xl border border-white/8 dark:border-gray-200 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-indigo-500/30">
              🎓
            </div>
            <h1 className="text-2xl font-bold text-white dark:text-gray-900 mb-1">Welcome Back</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center">
              Accédez à votre espace EasyLearn
            </p>
          </div>

          {apiError && (
            <div className="mb-4 px-4 py-3 bg-red-900/20 dark:bg-red-50 border border-red-800 dark:border-red-200 rounded-lg text-red-400 dark:text-red-600 text-sm text-center">
              {apiError}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                <span className="text-gray-500 text-sm">@</span>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="flex items-center gap-3 bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                <span className="text-gray-500 text-sm">🔒</span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-300 dark:hover:text-gray-600 transition-colors text-sm"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? "Connexion..." : "Sign In →"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-2">
              Pas de compte ?{" "}
              <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Créer un compte
              </a>
            </p>
          </form>
        </div>
      </div>
      <footer className="py-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-6 text-xs text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-gray-400 dark:hover:text-gray-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 dark:hover:text-gray-600 transition-colors">Need help?</a>
          <a href="#" className="hover:text-gray-400 dark:hover:text-gray-600 transition-colors">Legal notice</a>
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-400">
          © 2024 EasyLearn. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
