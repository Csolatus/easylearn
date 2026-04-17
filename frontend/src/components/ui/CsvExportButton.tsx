"use client";

import { ButtonRoot } from "@heroui/react";

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
    <ButtonRoot variant="outline" size="sm" onPress={handleExport}>
      📥 Exporter CSV
    </ButtonRoot>
  );
}
