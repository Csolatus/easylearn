"use client";

import { useRef, useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

type Props = {
  content: string;
  onProgressChange?: (progress: number) => void;
};

export default function TheoryTab({ content, onProgressChange }: Props) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const total = el.scrollHeight - el.clientHeight;
    if (total <= 0) return;
    const value = Math.min(100, Math.round((el.scrollTop / total) * 100));
    setProgress(value);
    onProgressChange?.(value);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="h-1 bg-white/5 dark:bg-gray-200 shrink-0">
        <div
          className="h-full bg-purple-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress label */}
      <div className="flex justify-end px-5 py-1.5 shrink-0">
        <span className="text-xs text-gray-500">{progress}% lu</span>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-8 py-4 max-w-3xl mx-auto w-full"
      >
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}
