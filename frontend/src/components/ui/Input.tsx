import { InputGroup, Label } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

type InputProps = ComponentProps<typeof InputGroup.Input> & {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  fullWidth?: boolean;
};

export function Input({ label, error, prefix, suffix, fullWidth = true, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">
          {label}
        </Label>
      )}
      <InputGroup fullWidth={fullWidth}>
        {prefix && <InputGroup.Prefix>{prefix}</InputGroup.Prefix>}
        <InputGroup.Input className={className} {...props} />
        {suffix && <InputGroup.Suffix>{suffix}</InputGroup.Suffix>}
      </InputGroup>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
