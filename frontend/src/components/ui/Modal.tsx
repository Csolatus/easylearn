"use client";

import {
  ModalRoot,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalFooter,
  ModalCloseTrigger,
  useOverlayState,
} from "@heroui/react";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <ModalRoot state={state}>
      <ModalBackdrop isDismissable />
      <ModalContainer size={size}>
        <ModalDialog>
          <ModalHeader>
            {title && <ModalHeading>{title}</ModalHeading>}
            <ModalCloseTrigger />
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </ModalDialog>
      </ModalContainer>
    </ModalRoot>
  );
}
