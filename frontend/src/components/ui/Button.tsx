import type { ComponentPropsWithRef } from "react";

const VARIANTS: Record<string, string> = {
  primary: "bg-accent hover:opacity-90 text-white font-semibold",
  outline: "border border-white/20 dark:border-gray-400 text-foreground hover:bg-white/5",
  ghost:   "text-foreground hover:bg-white/5",
  danger:  "bg-red-600 hover:bg-red-700 text-white font-semibold",
  secondary: "bg-white/10 hover:bg-white/20 text-foreground",
};
const SIZES: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: string;
  size?: string;
  isDisabled?: boolean;
  onPress?: () => void;
  isIconOnly?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  isDisabled,
  onPress,
  isIconOnly,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={isDisabled ?? props.disabled}
      onClick={onPress ? () => onPress() : props.onClick}
      className={`rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${isIconOnly ? "w-9 h-9 p-0" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
