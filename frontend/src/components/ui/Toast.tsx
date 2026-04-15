"use client";

import { Toast as HeroToast, toast } from "@heroui/react";

export { toast };

export function ToastProvider() {
  return (
    <HeroToast.Provider placement="bottom end" gap={8}>
      {({ toast: toastItem }) => (
        <HeroToast toast={toastItem} variant={toastItem.content?.variant}>
          <HeroToast.Indicator />
          <HeroToast.Content>
            {toastItem.content?.title && (
              <HeroToast.Title>{toastItem.content.title}</HeroToast.Title>
            )}
            {toastItem.content?.description && (
              <HeroToast.Description>{toastItem.content.description}</HeroToast.Description>
            )}
          </HeroToast.Content>
          <HeroToast.CloseButton />
        </HeroToast>
      )}
    </HeroToast.Provider>
  );
}
