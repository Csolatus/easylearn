"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    if (!email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide";
    if (!password) newErrors.password = "Le mot de passe est requis";
    else if (password.length < 6) newErrors.password = "Minimum 6 caractères";
    if (!confirmPassword) newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) throw new Error("Erreur lors de la création du compte");
      const data = await res.json();
      console.log("Register success", data);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#111118] border border-white/8 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-indigo-500/30">
              🎓
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Créer un compte</h1>
            <p className="text-gray-400 text-sm text-center">
              Rejoignez EasyLearn dès maintenant
            </p>
          </div>

          {apiError && (
            <div className="mb-4 px-4 py-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm text-center">
              {apiError}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                Je suis
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors border ${
                    role === "student"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                      : "bg-white/5 text-gray-400 border-white/10 hover:border-indigo-500"
                  }`}
                >
                  🎓 Élève
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors border ${
                    role === "teacher"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                      : "bg-white/5 text-gray-400 border-white/10 hover:border-indigo-500"
                  }`}
                >
                  🧑‍🏫 Professeur
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                <span className="text-gray-500 text-sm">@</span>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                Password
              </label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                <span className="text-gray-500 text-sm">🔒</span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                Confirm Password
              </label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                <span className="text-gray-500 text-sm">🔒</span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
