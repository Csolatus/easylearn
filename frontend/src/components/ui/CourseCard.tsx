import { BookOpen } from "lucide-react";

const VISIBILITY_LABELS: Record<string, string> = {
  public:  "Public",
  school:  "École",
  private: "Privé",
};

const VISIBILITY_COLORS: Record<string, string> = {
  public:  "bg-green-500/20 text-green-400",
  school:  "bg-accent/20 text-accent",
  private: "bg-white/10 text-gray-400",
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
    <div
      className={`bg-white/5 dark:bg-gray-800 border border-white/10 dark:border-gray-400 rounded-2xl shadow-md overflow-hidden ${onClick ? "cursor-pointer hover:border-white/20 transition-colors" : ""}`}
      onClick={onClick}
    >
      <div className="h-20 bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center text-gray-400">
        <BookOpen size={32} />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-sm leading-snug">{title}</h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${VISIBILITY_COLORS[visibility] ?? "bg-white/10 text-gray-400"}`}>
            {VISIBILITY_LABELS[visibility] ?? visibility}
          </span>
        </div>
        {updatedAt && (
          <p className="text-xs text-muted">
            {new Date(updatedAt).toLocaleDateString("fr-FR")}
          </p>
        )}
        {actions && <div className="mt-3">{actions}</div>}
      </div>
    </div>
  );
}
