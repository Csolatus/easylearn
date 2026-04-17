const VARIANT_CLASSES: Record<string, string> = {
  default:     "bg-surface border border-white/10 dark:border-gray-400",
  secondary:   "bg-white/5 dark:bg-gray-800 border border-white/10 dark:border-gray-400",
  tertiary:    "bg-white/10 border border-white/10",
  transparent: "bg-transparent",
};

type CardProps = {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "tertiary" | "transparent";
  className?: string;
  onClick?: () => void;
};

export function Card({ className = "", children, variant = "default", onClick }: CardProps) {
  return (
    <div
      className={`rounded-2xl shadow-md ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default} ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      <div className="p-5">{children}</div>
    </div>
  );
}
