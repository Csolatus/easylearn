const STATUS_STYLES: Record<string, string> = {
  active:    "bg-green-900/30 text-green-400 dark:bg-green-50 dark:text-green-600",
  invited:   "bg-yellow-900/30 text-yellow-400 dark:bg-yellow-50 dark:text-yellow-600",
  suspended: "bg-red-900/30 text-red-400 dark:bg-red-50 dark:text-red-600",
  removed:   "bg-gray-900/30 text-gray-400 dark:bg-gray-100 dark:text-gray-500",
};

const STATUS_DOT: Record<string, string> = {
  active:    "bg-green-400",
  invited:   "bg-yellow-400",
  suspended: "bg-red-400",
  removed:   "bg-gray-400",
};

const STATUS_LABELS: Record<string, string> = {
  active:    "Actif",
  invited:   "Invité",
  suspended: "Suspendu",
  removed:   "Retiré",
};

type Props = {
  status: string;
  label?: string;
};

export default function StatusBadge({ status, label }: Props) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.removed;
  const dot = STATUS_DOT[status] ?? STATUS_DOT.removed;
  const text = label ?? STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {text}
    </span>
  );
}
