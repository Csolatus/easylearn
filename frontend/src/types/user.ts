export type Role = "student" | "teacher" | "school_admin" | "super_admin";

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
};
