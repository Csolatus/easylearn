import { CardRoot, CardContent, ChipRoot, ChipLabel } from "@heroui/react";

const VISIBILITY_LABELS: Record<string, string> = {
  public:  "Public",
  school:  "École",
  private: "Privé",
};

const VISIBILITY_COLORS: Record<string, "default" | "accent" | "success" | "warning" | "danger"> = {
  public:  "success",
  school:  "accent",
  private: "default",
};

type Props = {
  title: string;
  visibility: string;
  updatedAt?: string;
  onClick?: () => void;
  actions?: React.ReactNode;
};

export default function CourseCard({ title, visibility, updatedAt, onClick, actions }: Props) {
  return (
    <CardRoot
      variant="secondary"
      onClick={onClick}
      className={onClick ? "cursor-pointer" : ""}
    >
      <div className="h-20 bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center text-3xl">
        📖
      </div>
      <CardContent>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-sm leading-snug">{title}</h3>
          <ChipRoot color={VISIBILITY_COLORS[visibility] ?? "default"} size="sm">
            <ChipLabel>{VISIBILITY_LABELS[visibility] ?? visibility}</ChipLabel>
          </ChipRoot>
        </div>
        {updatedAt && (
          <p className="text-xs text-muted">
            {new Date(updatedAt).toLocaleDateString("fr-FR")}
          </p>
        )}
        {actions && <div className="mt-3">{actions}</div>}
      </CardContent>
    </CardRoot>
  );
}
