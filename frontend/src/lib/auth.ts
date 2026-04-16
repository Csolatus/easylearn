import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";

export function decodeJwtPayload(token: string): Record<string, string> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export async function refreshCurrentUser(): Promise<void> {
  try {
    const user = await api.auth.me();
    useAuthStore.getState().setUser(user);
  } catch {
    useAuthStore.getState().logout();
  }
}

export function isAuthenticated(): boolean {
  return useAuthStore.getState().token !== null;
}
