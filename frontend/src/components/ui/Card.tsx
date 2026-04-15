import { Card as HeroCard } from "@heroui/react";
import type { ComponentProps } from "react";

type CardProps = ComponentProps<typeof HeroCard> & {
  children: React.ReactNode;
};

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <HeroCard
      className={`bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </HeroCard>
  );
}
