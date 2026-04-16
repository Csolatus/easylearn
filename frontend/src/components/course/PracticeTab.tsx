"use client";

import { useState } from "react";
import CodeEditor from "@/components/editor/CodeEditor";
import { useAuthStore } from "@/store/authStore";

export type TerminalLine = {
  type: "info" | "success" | "error" | "log";
  text: string;
};

type Props = {
  initialCode: string;
  language?: string;
  objective?: string;
  objectiveProgress?: number;
};

const LANG_DISPLAY: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  sql: "SQL",
};

export default function PracticeTab({
  initialCode,
  language = "javascript",
  objective,
  objectiveProgress,
}: Props) {
  const [code, setCode] = useState(initialCode);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const token = useAuthStore((s) => s.token);

  const handleRun = async () => {
    setIsRunning(true);
    setTerminalLines([{ type: "info", text: "Compilation en cours..." }]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ language, code }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setTerminalLines([
          { type: "error", text: data.detail ?? `Erreur ${res.status}` },
        ]);
        return;
      }

      const result = await res.json();
      const lines: TerminalLine[] = [
        { type: "success", text: "Compilation réussie." },
      ];

      if (result.stdout) {
        result.stdout
          .split("\n")
          .filter((l: string) => l.trim() !== "")
          .forEach((l: string) => lines.push({ type: "log", text: l }));
      }

      if (result.stderr) {
        result.stderr
          .split("\n")
          .filter((l: string) => l.trim() !== "")
          .forEach((l: string) => lines.push({ type: "error", text: l }));
      }

      if (result.exit_code !== 0 && result.exit_code != null) {
        lines.push({ type: "error", text: `Processus terminé avec le code ${result.exit_code}` });
      }

      setTerminalLines(lines);
    } catch {
      setTerminalLines([{ type: "error", text: "Impossible de contacter le serveur." }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setTerminalLines([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 shrink-0">
        <span className="text-xs text-gray-500 mr-1">
          {LANG_DISPLAY[language] ?? language}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">·</span>
        <span className="text-xs text-gray-500">
          {isRunning
            ? "Compilation en cours..."
            : terminalLines.length > 0
            ? "Exécuté"
            : "Prêt"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleReset}
            className="text-xs px-3 py-1.5 rounded-lg border border-white/10 dark:border-gray-300 text-gray-400 dark:text-gray-600 hover:bg-white/5 dark:hover:bg-gray-100 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="text-xs px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold transition-colors"
          >
            {isRunning ? "..." : "▶ Exécuter"}
          </button>
        </div>
      </div>

      {/* Editor + terminal split */}
      <div className="flex-1 grid grid-cols-2 divide-x divide-white/10 dark:divide-gray-200 overflow-hidden">
        {/* Code editor */}
        <div className="overflow-hidden">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            minHeight="100%"
          />
        </div>

        {/* Terminal */}
        <div className="flex flex-col bg-[#0a0a14] dark:bg-gray-900 overflow-hidden">
          <div className="px-4 py-2 border-b border-white/10 dark:border-gray-700 flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
              Terminal / Console
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs flex flex-col gap-1.5">
            {terminalLines.length === 0 ? (
              <span className="text-gray-600">
                $ Appuyez sur Exécuter pour lancer le code
              </span>
            ) : (
              terminalLines.map((line, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${
                    line.type === "success"
                      ? "text-green-400"
                      : line.type === "error"
                      ? "text-red-400"
                      : line.type === "info"
                      ? "text-blue-400"
                      : "text-gray-300"
                  }`}
                >
                  {line.type === "success" && <span className="shrink-0 mt-0.5">✓</span>}
                  {line.type === "error" && <span className="shrink-0 mt-0.5">✗</span>}
                  {line.type === "info" && <span className="shrink-0 mt-0.5">›</span>}
                  {line.type === "log" && (
                    <span className="shrink-0 mt-0.5 text-gray-600">$</span>
                  )}
                  <span>{line.text}</span>
                </div>
              ))
            )}
          </div>

          {/* Objective */}
          {objective && (
            <div className="border-t border-white/10 dark:border-gray-700 px-4 py-3 shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-300">
                  Objectif du Lab
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-2">{objective}</p>
              {objectiveProgress != null && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${objectiveProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">{objectiveProgress}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
