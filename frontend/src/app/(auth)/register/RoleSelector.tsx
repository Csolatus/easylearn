import { ButtonRoot } from "@heroui/react";
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
            <ButtonRoot
              key={r}
              type="button"
              variant={role === r ? "primary" : "outline"}
              className="flex-1"
              onPress={() => onChange(r)}
            >
              <Icon size={16} className="mr-2" />
              {label}
            </ButtonRoot>
          );
        })}
      </div>
    </div>
  );
}
