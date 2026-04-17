import {
  LayoutDashboard,
  BookOpen,
  User,
  School,
  BarChart2,
  UserRound,
  GraduationCap,
  Settings,
  Landmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type RoleNavConfig = {
  portalLabel: string;
  accent: string;
  accentHover: string;
  accentText: string;
  accentDot: string;
  navItems: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  settingsHref?: string;
};

export const NAV_CONFIG: Record<string, RoleNavConfig> = {
  student: {
    portalLabel: "Student Portal",
    accent: "bg-purple-600",
    accentHover: "hover:bg-purple-700",
    accentText: "text-purple-400",
    accentDot: "bg-purple-500",
    navItems: [
      { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { label: "Courses", href: "/student/catalogue", icon: BookOpen },
      { label: "Profile", href: "/student/profil", icon: User },
    ],
    ctaLabel: "Start Learning",
    settingsHref: "/student/settings",
  },
  teacher: {
    portalLabel: "Teacher Portal",
    accent: "bg-green-600",
    accentHover: "hover:bg-green-700",
    accentText: "text-green-400",
    accentDot: "bg-green-500",
    navItems: [
      { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
      { label: "Classes", href: "/teacher/classes", icon: School },
      { label: "Cours", href: "/teacher/cours", icon: BookOpen },
      { label: "Stats", href: "/teacher/stats", icon: BarChart2 },
    ],
    ctaLabel: "Nouveau cours",
    ctaHref: "/teacher/cours",
    settingsHref: "/teacher/settings",
  },
  school_admin: {
    portalLabel: "Admin Portal",
    accent: "bg-orange-600",
    accentHover: "hover:bg-orange-700",
    accentText: "text-orange-400",
    accentDot: "bg-orange-500",
    navItems: [
      { label: "Dashboard", href: "/school_admin/dashboard", icon: LayoutDashboard },
      { label: "Professeurs", href: "/school_admin/professeurs", icon: UserRound },
      { label: "Élèves", href: "/school_admin/eleves", icon: GraduationCap },
      { label: "Catalogue", href: "/school_admin/catalogue", icon: BookOpen },
      { label: "Paramètres", href: "/school_admin/parametres", icon: Settings },
    ],
  },
  super_admin: {
    portalLabel: "Super Admin",
    accent: "bg-red-600",
    accentHover: "hover:bg-red-700",
    accentText: "text-red-400",
    accentDot: "bg-red-500",
    navItems: [
      { label: "Dashboard", href: "/super_admin/dashboard", icon: LayoutDashboard },
      { label: "Écoles", href: "/super_admin/ecoles", icon: Landmark },
    ],
  },
};
