"use client";

import { useEffect, useState } from "react";
import { ButtonRoot } from "@heroui/react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <ButtonRoot
      onPress={toggle}
      variant="outline"
      isIconOnly
      size="sm"
      aria-label={isDark ? "Mode clair" : "Mode sombre"}
    >
      {isDark ? "☀️" : "🌙"}
    </ButtonRoot>
  );
}
