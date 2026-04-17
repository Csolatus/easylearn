type Props = {
  value: number;
  showLabel?: boolean;
};

export default function ProgressBar({ value, showLabel = false }: Props) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/10 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted w-8 text-right">{pct}%</span>
      )}
    </div>
  );
}
