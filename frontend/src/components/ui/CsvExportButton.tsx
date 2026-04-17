"use client";

import { Download } from "lucide-react";

type Props = {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
};

export default function CsvExportButton({ headers, rows, filename }: Props) {
  const handleExport = () => {
    const content = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-xl border border-white/20 dark:border-gray-400 text-foreground hover:bg-white/5 transition-colors"
    >
      <Download size={14} /> Exporter CSV
    </button>
  );
}
