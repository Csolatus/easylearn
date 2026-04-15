import { create } from "zustand";
import { persist } from "zustand/middleware";

export type School = {
  id: string;
  name: string;
};

const MOCK_SCHOOLS: School[] = [
  { id: "1", name: "EFREI Paris" },
  { id: "2", name: "École Polytechnique" },
  { id: "3", name: "Sciences Po" },
];

type SchoolState = {
  schools: School[];
  activeSchool: School | null;
  setActiveSchool: (school: School) => void;
};

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set) => ({
      schools: MOCK_SCHOOLS,
      activeSchool: MOCK_SCHOOLS[0],
      setActiveSchool: (school: School) => set({ activeSchool: school }),
    }),
    { name: "school-storage" }
  )
);
