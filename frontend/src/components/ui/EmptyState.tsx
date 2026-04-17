import { EmptyStateRoot } from "@heroui/react";
import type { ComponentProps } from "react";

type EmptyStateProps = ComponentProps<typeof EmptyStateRoot> & {
  message: string;
};

export default function EmptyState({ message, ...props }: EmptyStateProps) {
  return (
    <EmptyStateRoot {...props}>
      <p className="text-muted text-sm">{message}</p>
    </EmptyStateRoot>
  );
}
