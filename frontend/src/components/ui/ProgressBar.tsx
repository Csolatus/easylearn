import { ProgressBarRoot, ProgressBarTrack, ProgressBarFill } from "@heroui/react";

type Props = {
  value: number;
  showLabel?: boolean;
};

export default function ProgressBar({ value, showLabel = false }: Props) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <ProgressBarRoot value={pct} minValue={0} maxValue={100} className="flex items-center gap-2">
      <ProgressBarTrack className="flex-1">
        <ProgressBarFill />
      </ProgressBarTrack>
      {showLabel && <span className="text-xs text-muted w-8 text-right">{pct}%</span>}
    </ProgressBarRoot>
  );
}
