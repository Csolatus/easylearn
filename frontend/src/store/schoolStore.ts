import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";
import type { School } from "@/types/api";

export type { School };

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
        try {
          const schools = await api.get<School[]>("/schools");
          set({
            schools,
            activeSchool: get().activeSchool ?? schools[0] ?? null,
            isLoaded: true,
          });
        } catch {
          // keep existing state on error
        }
      },
    }),
    { name: "school-storage" }
  )
);
