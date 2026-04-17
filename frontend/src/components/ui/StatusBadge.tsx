const STATUS_COLORS: Record<string, string> = {
  active:    "bg-green-500/20 text-green-400",
  invited:   "bg-yellow-500/20 text-yellow-400",
  suspended: "bg-red-500/20 text-red-400",
  removed:   "bg-white/10 text-gray-400",
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
  const colorClass = STATUS_COLORS[status] ?? "bg-white/10 text-gray-400";
  const text = label ?? STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {text}
    </span>
  );
}
