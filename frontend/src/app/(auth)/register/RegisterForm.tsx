"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, GraduationCap } from "lucide-react";
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
  const [errors, setErrors] = useState<{
    firstName?: string; lastName?: string; email?: string;
    password?: string; confirmPassword?: string;
  }>({});
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
    <div className="min-h-screen flex flex-col bg-background">
      <AuthHeader questionText="Déjà inscrit ?" linkText="Se connecter" linkHref="/login" />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white/5 dark:bg-gray-800 border border-white/10 dark:border-gray-400 rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-2xl mb-4">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Créer un compte</h1>
            <p className="text-muted text-sm text-center">Rejoignez EasyLearn dès maintenant</p>
          </div>

          {apiError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
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
                <div key={label} className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <label className="text-xs font-semibold tracking-widest text-muted uppercase">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="bg-surface border border-white/10 dark:border-gray-400 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest text-muted uppercase">Email</label>
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

            {[
              { label: "Mot de passe", value: password, set: setPassword, show: showPassword, toggle: () => setShowPassword(!showPassword), error: errors.password },
              { label: "Confirmer le mot de passe", value: confirmPassword, set: setConfirmPassword, show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword), error: errors.confirmPassword },
            ].map(({ label, value, set, show, toggle, error }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-widest text-muted uppercase">{label}</label>
                <div className="flex items-center bg-surface border border-white/10 dark:border-gray-400 rounded-xl focus-within:ring-2 focus-within:ring-accent overflow-hidden">
                  <span className="pl-3 text-muted"><Lock size={14} /></span>
                  <input
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder-gray-500 focus:outline-none"
                  />
                  <button type="button" onClick={toggle} className="pr-3 text-muted hover:text-foreground transition-colors">
                    {show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-accent hover:opacity-90 disabled:opacity-50 text-white font-semibold text-sm transition-opacity"
            >
              {isLoading ? "Inscription..." : "Créer mon compte →"}
            </button>

            <p className="text-center text-sm text-muted mt-2">
              Déjà un compte ?{" "}
              <a href="/login" className="text-accent hover:opacity-80 font-medium transition-opacity">
                Se connecter
              </a>
            </p>
          </form>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}
