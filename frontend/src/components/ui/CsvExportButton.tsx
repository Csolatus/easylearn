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
      className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl border border-white/10 transition-colors"
    >
      <Download size={14} />
      Exporter CSV
    </button>
  );
}
