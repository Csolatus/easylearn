import { ChipRoot, ChipLabel } from "@heroui/react";
import type { ComponentProps } from "react";

type BadgeProps = ComponentProps<typeof ChipRoot> & {
  children: React.ReactNode;
  color?: "default" | "accent" | "success" | "warning" | "danger";
};

export function Badge({ children, color = "default", className = "", ...props }: BadgeProps) {
  return (
    <ChipRoot color={color} className={className} {...props}>
      <ChipLabel>{children}</ChipLabel>
    </ChipRoot>
  );
}
