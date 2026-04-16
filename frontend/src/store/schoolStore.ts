import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/store/authStore";

export type School = {
  id: string;
  name: string;
  is_active?: boolean;
  created_at?: string;
};

type SchoolState = {
  schools: School[];
  activeSchool: School | null;
  isLoaded: boolean;
  setActiveSchool: (school: School) => void;
  fetchSchools: () => Promise<void>;
};

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set, get) => ({
      schools: [],
      activeSchool: null,
      isLoaded: false,

      setActiveSchool: (school: School) => set({ activeSchool: school }),

      fetchSchools: async () => {
        if (get().isLoaded) return;
        const token = useAuthStore.getState().token;
        if (!token) return;
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schools`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const schools: School[] = await res.json();
            set({
              schools,
              activeSchool: get().activeSchool ?? schools[0] ?? null,
              isLoaded: true,
            });
          }
        } catch {
          // keep existing state on error
        }
      },
    }),
    { name: "school-storage" }
  )
);
