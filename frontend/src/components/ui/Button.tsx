import { ButtonRoot } from "@heroui/react";
import type { ComponentPropsWithRef } from "react";

type ButtonProps = ComponentPropsWithRef<typeof ButtonRoot>;

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return <ButtonRoot variant={variant} size={size} className={className} {...props} />;
}
