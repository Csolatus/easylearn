import { Chip } from "@heroui/react";
import type { ComponentProps } from "react";

type BadgeProps = ComponentProps<typeof Chip> & {
  children: React.ReactNode;
};

export function Badge({ children, color = "default", variant = "primary", size = "sm", className = "", ...props }: BadgeProps) {
  return (
    <Chip color={color} variant={variant} size={size} className={className} {...props}>
      <Chip.Label>{children}</Chip.Label>
    </Chip>
  );
}
