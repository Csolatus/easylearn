import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

function decodeJwtPayload(token: string): Record<string, string> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (token: string) => {
        const payload = decodeJwtPayload(token);
        if (!payload) return;

        const user: User = {
          id: payload.sub,
          email: payload.email,
          role: payload.role as User["role"],
        };

        // Store in cookie so middleware can read it
        document.cookie = `auth_token=${token}; path=/; max-age=3600; SameSite=Lax`;
        set({ token, user });
      },

      logout: () => {
        document.cookie = "auth_token=; path=/; max-age=0";
        set({ token: null, user: null });
      },
    }),
    { name: "auth-storage" }
  )
);
