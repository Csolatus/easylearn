import { Button as HeroButton } from "@heroui/react";
import type { ComponentPropsWithRef } from "react";

type ButtonProps = ComponentPropsWithRef<typeof HeroButton>;

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return <HeroButton variant={variant} size={size} className={className} {...props} />;
}
