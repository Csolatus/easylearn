import type { ComponentProps, ReactNode } from "react";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export function Input({ label, error, prefix, suffix, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold tracking-widest text-muted uppercase">
          {label}
        </label>
      )}
      <div className="flex items-center bg-surface border border-white/10 dark:border-gray-400 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent">
        {prefix && (
          <span className="pl-3 text-muted flex items-center shrink-0">{prefix}</span>
        )}
        <input
          className={`flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder-gray-500 focus:outline-none ${className}`}
          {...props}
        />
        {suffix && (
          <span className="pr-3 flex items-center shrink-0">{suffix}</span>
        )}
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
