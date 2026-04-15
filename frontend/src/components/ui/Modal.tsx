"use client";

import { Modal as HeroModal, useOverlayState } from "@heroui/react";
import type { ReactNode } from "react";
import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "full" | "cover";
};

export function Modal({ isOpen, onClose, title, children, footer, size = "md" }: ModalProps) {
  const state = useOverlayState({ isOpen, onOpenChange: (open) => { if (!open) onClose(); } });

  useEffect(() => {
    if (isOpen) state.open();
    else state.close();
  }, [isOpen]);

  return (
    <HeroModal.Root state={state}>
      <HeroModal.Backdrop isDismissable />
      <HeroModal.Container size={size}>
        <HeroModal.Dialog>
          <HeroModal.Header>
            {title && <HeroModal.Heading>{title}</HeroModal.Heading>}
            <HeroModal.CloseTrigger />
          </HeroModal.Header>
          <HeroModal.Body>{children}</HeroModal.Body>
          {footer && <HeroModal.Footer>{footer}</HeroModal.Footer>}
        </HeroModal.Dialog>
      </HeroModal.Container>
    </HeroModal.Root>
  );
}
