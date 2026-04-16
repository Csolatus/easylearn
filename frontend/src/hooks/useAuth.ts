"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { api, ApiError } from "@/lib/api";

const ROLE_DASHBOARDS: Record<string, string> = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  school_admin: "/school_admin/dashboard",
  super_admin: "/super_admin/dashboard",
};

export function useAuth() {
  const { user, token, login: storeLogin, setUser, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const data = await api.auth.login(email, password);
      storeLogin(data.access_token);

      // Récupère les données complètes (first_name, last_name) depuis l'API
      try {
        const me = await api.auth.me();
        setUser(me);
        router.push(ROLE_DASHBOARDS[me.role] ?? "/");
      } catch {
        const payload = JSON.parse(atob(data.access_token.split(".")[1]));
        router.push(ROLE_DASHBOARDS[payload.role] ?? "/");
      }
    },
    [storeLogin, setUser, router]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore — le token est peut-être déjà expiré
    }
    storeLogout();
    router.push("/login");
  }, [storeLogout, router]);

  const register = useCallback(
    async (data: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      role: string;
    }): Promise<void> => {
      await api.auth.register(data);
      router.push("/login?registered=1");
    },
    [router]
  );

  return { user, token, isAuthenticated: token !== null, login, logout, register, ApiError };
}
