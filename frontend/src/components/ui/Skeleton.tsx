type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-white/10 dark:bg-gray-700 rounded-xl ${className}`} />
  );
}
