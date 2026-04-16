import { create } from "zustand";
import { persist } from "zustand/middleware";

export type School = {
  id: string;
  name: string;
  is_active?: boolean;
  created_at?: string;
};

type SchoolState = {
  schools: School[];
  activeSchool: School | null;
  setActiveSchool: (school: School) => void;
  setSchools: (schools: School[]) => void;
  fetchSchools: (token: string) => Promise<void>;
};

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set) => ({
      schools: [],
      activeSchool: null,
      setActiveSchool: (school: School) => set({ activeSchool: school }),
      setSchools: (schools: School[]) => set({ schools }),
      fetchSchools: async (token: string) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schools`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data: School[] = await res.json();
            set({ schools: data });
          }
        } catch {
          // ignore
        }
      },
    }),
    { name: "school-storage" }
  )
);
