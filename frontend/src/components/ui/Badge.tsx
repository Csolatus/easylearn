const COLOR_CLASSES: Record<string, string> = {
  default: "bg-white/10 text-gray-400",
  accent:  "bg-accent/20 text-accent",
  success: "bg-green-500/20 text-green-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  danger:  "bg-red-500/20 text-red-400",
};

type BadgeProps = {
  children: React.ReactNode;
  color?: "default" | "accent" | "success" | "warning" | "danger";
  className?: string;
};

export function Badge({ children, color = "default", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${COLOR_CLASSES[color] ?? COLOR_CLASSES.default} ${className}`}>
      {children}
    </span>
  );
}
