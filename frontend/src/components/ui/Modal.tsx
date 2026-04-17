"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "full";
};

const SIZE_CLASSES: Record<string, string> = {
  xs:   "max-w-xs",
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  full: "max-w-full mx-4",
};

export function Modal({ isOpen, onClose, title, children, footer, size = "md" }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className={`relative w-full ${SIZE_CLASSES[size] ?? SIZE_CLASSES.md} bg-surface border border-white/10 dark:border-gray-400 rounded-2xl shadow-xl`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-gray-400">
          {title && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto text-muted hover:text-foreground transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-white/10 dark:border-gray-400 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
