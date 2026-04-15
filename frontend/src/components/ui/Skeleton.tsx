import { Skeleton as HeroSkeleton } from "@heroui/react";
import type { ComponentProps } from "react";

type SkeletonProps = ComponentProps<typeof HeroSkeleton> & {
  className?: string;
};

export function Skeleton({ className = "", animationType = "pulse", ...props }: SkeletonProps) {
  return (
    <HeroSkeleton
      animationType={animationType}
      className={`rounded-xl bg-white/10 dark:bg-gray-200 ${className}`}
      {...props}
    />
  );
}
