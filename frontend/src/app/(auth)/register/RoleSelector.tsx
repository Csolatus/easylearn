import { GraduationCap, UserRound } from "lucide-react";

type Props = {
  role: "student" | "teacher";
  onChange: (role: "student" | "teacher") => void;
};

const ROLE_CONFIG = {
  student: { label: "Élève", icon: GraduationCap },
  teacher: { label: "Professeur", icon: UserRound },
} as const;

export default function RoleSelector({ role, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">
        Je suis
      </label>
      <div className="flex gap-3">
        {(["student", "teacher"] as const).map((r) => {
          const { label, icon: Icon } = ROLE_CONFIG[r];
          return (
            <button
              key={r}
              type="button"
              onClick={() => onChange(r)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors border ${
                role === r
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                  : "bg-white/5 dark:bg-gray-100 text-gray-400 dark:text-gray-600 border-white/10 dark:border-gray-200 hover:border-indigo-500"
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
