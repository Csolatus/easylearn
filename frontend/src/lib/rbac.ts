import type { Role } from "@/types/user";

const ROLE_HIERARCHY: Record<Role, number> = {
  student: 0,
  teacher: 1,
  school_admin: 2,
  super_admin: 3,
};

/** Vérifie si le rôle `userRole` est au moins aussi élevé que `minRole`. */
export function hasMinRole(userRole: Role, minRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
}

/** Vérifie si le rôle `userRole` fait partie des rôles autorisés. */
export function hasRole(userRole: Role, ...allowed: Role[]): boolean {
  return allowed.includes(userRole);
}

export const ROLE_LABELS: Record<Role, string> = {
  student: "Élève",
  teacher: "Professeur",
  school_admin: "Admin école",
  super_admin: "Super admin",
};
