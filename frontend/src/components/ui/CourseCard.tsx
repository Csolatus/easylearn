const VISIBILITY_LABELS: Record<string, string> = {
  public:  "Public",
  school:  "École",
  private: "Privé",
};

const VISIBILITY_COLORS: Record<string, string> = {
  public:  "bg-green-900/30 text-green-400",
  school:  "bg-blue-900/30 text-blue-400",
  private: "bg-gray-900/30 text-gray-400",
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
      onClick={onClick}
      className={`bg-[#1a1a2e] dark:bg-white rounded-2xl border border-white/5 dark:border-gray-200 overflow-hidden ${onClick ? "cursor-pointer hover:border-white/10 transition-colors" : ""}`}
    >
      <div className="h-20 bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center text-3xl">
        📖
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white dark:text-gray-900 text-sm leading-snug">{title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${VISIBILITY_COLORS[visibility] ?? VISIBILITY_COLORS.private}`}>
            {VISIBILITY_LABELS[visibility] ?? visibility}
          </span>
        </div>
        {updatedAt && (
          <p className="text-xs text-gray-500">
            {new Date(updatedAt).toLocaleDateString("fr-FR")}
          </p>
        )}
        {actions && <div className="mt-3">{actions}</div>}
      </div>
    </div>
  );
}
