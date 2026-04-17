import { SkeletonRoot } from "@heroui/react";
import type { ComponentProps } from "react";

type SkeletonProps = ComponentProps<typeof SkeletonRoot>;

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return <SkeletonRoot className={className} {...props} />;
}
