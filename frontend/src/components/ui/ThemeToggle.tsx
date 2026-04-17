"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-xl border border-white/20 dark:border-gray-400 text-foreground hover:bg-white/5 transition-colors flex items-center justify-center text-base"
      aria-label={isDark ? "Mode clair" : "Mode sombre"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
