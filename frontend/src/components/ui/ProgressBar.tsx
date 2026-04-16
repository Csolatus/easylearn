type Props = {
  value: number;
  color?: string;
  showLabel?: boolean;
};

export default function ProgressBar({ value, color = "bg-purple-500", showLabel = false }: Props) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-white/10 dark:bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>}
    </div>
  );
}
