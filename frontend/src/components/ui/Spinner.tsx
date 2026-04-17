import { SpinnerRoot } from "@heroui/react";
import type { ComponentProps } from "react";

type SpinnerProps = ComponentProps<typeof SpinnerRoot> & {
  /** @deprecated Use color prop instead */
  color?: string;
};

export default function Spinner({ color, className = "", ...props }: SpinnerProps) {
  return <SpinnerRoot className={className} {...props} />;
}
