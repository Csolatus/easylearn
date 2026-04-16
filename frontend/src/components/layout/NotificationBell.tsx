"use client";

type Props = {
  count?: number;
  accentColor?: "purple" | "green" | "blue" | "orange" | "red";
  onClick?: () => void;
};

const DOT_COLORS: Record<NonNullable<Props["accentColor"]>, string> = {
  purple: "bg-purple-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
};

export default function NotificationBell({ count = 0, accentColor = "purple", onClick }: Props) {
  const dotColor = DOT_COLORS[accentColor];

  return (
    <button
      onClick={onClick}
      aria-label={`Notifications${count > 0 ? ` (${count})` : ""}`}
      className="relative text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors"
    >
      🔔
      {count > 0 && (
        <span
          className={`absolute -top-1 -right-1 w-2 h-2 ${dotColor} rounded-full`}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
