import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import type { UserResponse } from "@/types/api";
import { decodeJwtPayload } from "@/lib/auth";

type AuthState = {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  setUser: (user: UserResponse) => void;
  logout: () => void;
};

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
          first_name: "",
          last_name: "",
          email: payload.email,
          role: payload.role as User["role"],
        };

        document.cookie = `auth_token=${token}; path=/; max-age=3600; SameSite=Lax`;
        set({ token, user });
      },

      setUser: (data: UserResponse) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, ...data }
            : {
                id: data.id,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                role: data.role,
              },
        }));
      },

      logout: () => {
        document.cookie = "auth_token=; path=/; max-age=0";
        set({ token: null, user: null });
      },
    }),
    { name: "auth-storage" }
  )
);
