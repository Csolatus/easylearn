"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CardRoot, CardContent,
  InputGroupRoot, InputGroupInput, InputGroupPrefix, InputGroupSuffix,
  ButtonRoot,
  AlertRoot, AlertTitle,
  LabelRoot,
} from "@heroui/react";
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
        <CardRoot variant="secondary" className="w-full max-w-md">
          <CardContent>
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-2xl mb-4">
                🎓
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Créer un compte</h1>
              <p className="text-muted text-sm text-center">Rejoignez EasyLearn dès maintenant</p>
            </div>

            {apiError && (
              <AlertRoot status="danger" className="mb-4">
                <AlertTitle>{apiError}</AlertTitle>
              </AlertRoot>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <RoleSelector role={role} onChange={setRole} />

              <div className="flex gap-3">
                {[
                  { label: "Prénom", value: firstName, set: setFirstName, placeholder: "Jean", error: errors.firstName },
                  { label: "Nom", value: lastName, set: setLastName, placeholder: "Dupont", error: errors.lastName },
                ].map(({ label, value, set, placeholder, error }) => (
                  <div key={label} className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <LabelRoot className="text-xs font-semibold tracking-widest text-muted uppercase">
                      {label}
                    </LabelRoot>
                    <InputGroupRoot>
                      <InputGroupInput
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => set(e.target.value)}
                      />
                    </InputGroupRoot>
                    {error && <p className="text-danger text-xs">{error}</p>}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <LabelRoot className="text-xs font-semibold tracking-widest text-muted uppercase">
                  Email
                </LabelRoot>
                <InputGroupRoot>
                  <InputGroupPrefix>
                    <Mail size={14} className="text-muted" />
                  </InputGroupPrefix>
                  <InputGroupInput
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroupRoot>
                {errors.email && <p className="text-danger text-xs">{errors.email}</p>}
              </div>

              {[
                { label: "Mot de passe", value: password, set: setPassword, show: showPassword, toggle: () => setShowPassword(!showPassword), error: errors.password },
                { label: "Confirmer le mot de passe", value: confirmPassword, set: setConfirmPassword, show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword), error: errors.confirmPassword },
              ].map(({ label, value, set, show, toggle, error }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <LabelRoot className="text-xs font-semibold tracking-widest text-muted uppercase">
                    {label}
                  </LabelRoot>
                  <InputGroupRoot>
                    <InputGroupPrefix>
                      <Lock size={14} className="text-muted" />
                    </InputGroupPrefix>
                    <InputGroupInput
                      type={show ? "text" : "password"}
                      placeholder="••••••••"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                    />
                    <InputGroupSuffix>
                      <button
                        type="button"
                        onClick={toggle}
                        className="text-muted hover:text-foreground transition-colors p-1"
                      >
                        {show ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </InputGroupSuffix>
                  </InputGroupRoot>
                  {error && <p className="text-danger text-xs">{error}</p>}
                </div>
              ))}

              <ButtonRoot type="submit" variant="primary" isDisabled={isLoading} className="w-full">
                {isLoading ? "Inscription..." : "Créer mon compte →"}
              </ButtonRoot>

              <p className="text-center text-sm text-muted mt-2">
                Déjà un compte ?{" "}
                <a href="/login" className="text-accent hover:opacity-80 font-medium transition-opacity">
                  Se connecter
                </a>
              </p>
            </form>
          </CardContent>
        </CardRoot>
      </div>
      <AuthFooter />
    </div>
  );
}
