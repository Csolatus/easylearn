"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "@/components/layout/AuthHeader";
import AuthFooter from "@/components/layout/AuthFooter";
import RoleSelector from "./RoleSelector";

export default function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide";
    if (!password) newErrors.password = "Le mot de passe est requis";
    else if (password.length < 8) newErrors.password = "Minimum 8 caractères";
    if (!confirmPassword) newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName.trim(), last_name: lastName.trim(), email, password, role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? "Erreur lors de la création du compte");
      }
      router.push("/login?registered=1");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] dark:bg-gray-50">
      <AuthHeader questionText="Déjà inscrit ?" linkText="Se connecter" linkHref="/login" />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#111118] dark:bg-white dark:shadow-xl border border-white/8 dark:border-gray-200 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-indigo-500/30">🎓</div>
            <h1 className="text-2xl font-bold text-white dark:text-gray-900 mb-1">Créer un compte</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center">Rejoignez EasyLearn dès maintenant</p>
          </div>

          {apiError && (
            <div className="mb-4 px-4 py-3 bg-red-900/20 dark:bg-red-50 border border-red-800 dark:border-red-200 rounded-lg text-red-400 dark:text-red-600 text-sm text-center">
              {apiError}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <RoleSelector role={role} onChange={setRole} />

            <div className="flex gap-3">
              {[
                { label: "Prénom", value: firstName, set: setFirstName, placeholder: "Jean", error: errors.firstName },
                { label: "Nom", value: lastName, set: setLastName, placeholder: "Dupont", error: errors.lastName },
              ].map(({ label, value, set, placeholder, error }) => (
                <div key={label} className="flex flex-col gap-2 flex-1">
                  <label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">{label}</label>
                  <div className="flex items-center gap-3 bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                    <input type="text" placeholder={placeholder} value={value} onChange={(e) => set(e.target.value)} className="flex-1 bg-transparent text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none" />
                  </div>
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">Email</label>
              <div className="flex items-center gap-3 bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                <span className="text-gray-500 text-sm">@</span>
                <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-transparent text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none" />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>

            {[
              { label: "Mot de passe", value: password, set: setPassword, show: showPassword, toggle: () => setShowPassword(!showPassword), error: errors.password },
              { label: "Confirmer le mot de passe", value: confirmPassword, set: setConfirmPassword, show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword), error: errors.confirmPassword },
            ].map(({ label, value, set, show, toggle, error }) => (
              <div key={label} className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-widest text-gray-400 uppercase">{label}</label>
                <div className="flex items-center gap-3 bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
                  <span className="text-gray-500 text-sm">🔒</span>
                  <input type={show ? "text" : "password"} placeholder="••••••••" value={value} onChange={(e) => set(e.target.value)} className="flex-1 bg-transparent text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none" />
                  <button type="button" onClick={toggle} className="text-gray-500 hover:text-gray-300 transition-colors text-sm">{show ? "🙈" : "👁️"}</button>
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
              </div>
            ))}

            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20">
              {isLoading ? "Inscription..." : "Créer mon compte →"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-2">
              Déjà un compte ?{" "}
              <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Se connecter</a>
            </p>
          </form>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}
