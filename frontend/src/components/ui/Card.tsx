import { CardRoot, CardContent } from "@heroui/react";
import type { ComponentProps } from "react";

type CardProps = ComponentProps<typeof CardRoot> & {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "tertiary" | "transparent";
};

export function Card({ className = "", children, variant = "default", ...props }: CardProps) {
  return (
    <CardRoot variant={variant} className={className} {...props}>
      <CardContent>{children}</CardContent>
    </CardRoot>
  );
}
