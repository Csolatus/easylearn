import { InputGroupRoot, InputGroupInput, InputGroupPrefix, InputGroupSuffix, LabelRoot } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

type InputProps = ComponentProps<typeof InputGroupInput> & {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export function Input({ label, error, prefix, suffix, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <LabelRoot className="text-xs font-semibold tracking-widest text-muted uppercase">
          {label}
        </LabelRoot>
      )}
      <InputGroupRoot>
        {prefix && <InputGroupPrefix>{prefix}</InputGroupPrefix>}
        <InputGroupInput className={className} {...props} />
        {suffix && <InputGroupSuffix>{suffix}</InputGroupSuffix>}
      </InputGroupRoot>
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  );
}
