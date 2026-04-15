export type Role = "student" | "teacher" | "school_admin" | "super_admin";

export type User = {
  id: string;
  email: string;
  role: Role;
};
