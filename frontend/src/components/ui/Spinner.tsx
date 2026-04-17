type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASSES = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };

export default function Spinner({ className = "", size = "md" }: SpinnerProps) {
  return (
    <div
      className={`${SIZE_CLASSES[size]} border-2 border-accent border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
}
