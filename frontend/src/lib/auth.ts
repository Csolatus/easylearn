import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";

/**
 * Appelle GET /auth/me et met à jour le store avec les données fraîches du serveur.
 * À appeler au montage des layouts protégés pour synchroniser first_name/last_name.
 */
export async function refreshCurrentUser(): Promise<void> {
  try {
    const user = await api.auth.me();
    useAuthStore.getState().setUser(user);
  } catch {
    // Token expiré ou révoqué : déconnecter proprement
    useAuthStore.getState().logout();
  }
}

/**
 * Retourne true si l'utilisateur est authentifié (token présent en store).
 */
export function isAuthenticated(): boolean {
  return useAuthStore.getState().token !== null;
}
