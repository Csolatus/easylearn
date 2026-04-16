type Props = {
  value: number; // 0-100
  className?: string;
  color?: "purple" | "green" | "blue" | "yellow" | "orange";
  size?: "sm" | "md" | "lg";
};

const COLOR_CLASSES: Record<NonNullable<Props["color"]>, string> = {
  purple: "bg-purple-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  orange: "bg-orange-500",
};

const SIZE_CLASSES: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
};

export default function ProgressBar({ value, className = "", color = "purple", size = "md" }: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`${SIZE_CLASSES[size]} bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${COLOR_CLASSES[color]} rounded-full transition-all duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
