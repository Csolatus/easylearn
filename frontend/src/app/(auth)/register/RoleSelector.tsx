import { GraduationCap, Users } from "lucide-react";

type Props = {
  role: "student" | "teacher";
  onChange: (role: "student" | "teacher") => void;
};

const ROLE_CONFIG = {
  student: { label: "Élève", icon: GraduationCap },
  teacher: { label: "Professeur", icon: Users },
} as const;

export default function RoleSelector({ role, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold tracking-widest text-muted uppercase">Je suis</span>
      <div className="flex gap-3">
        {(["student", "teacher"] as const).map((r) => {
          const { label, icon: Icon } = ROLE_CONFIG[r];
          return (
            <button
              key={r}
              type="button"
              onClick={() => onChange(r)}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                role === r
                  ? "bg-accent text-white"
                  : "border border-white/20 dark:border-gray-400 text-foreground hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
