"use client";

const PRESET_COLORS = [
  { label: "Orange", value: "#ea580c" },
  { label: "Bleu", value: "#2563eb" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Vert", value: "#16a34a" },
  { label: "Rouge", value: "#dc2626" },
  { label: "Rose", value: "#db2777" },
];

interface Props {
  accentColor: string;
  onColorChange: (color: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
  disabled: boolean;
}

export function AccentColorPicker({ accentColor, onColorChange, onSave, saving, saved, saveError, disabled }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-surface shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-white/5">
        <h2 className="text-sm font-semibold text-foreground">Couleur d&apos;accent</h2>
      </div>
      <div className="px-6 py-6 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl border-2 border-white/10 dark:border-gray-300 shrink-0"
            style={{ backgroundColor: accentColor }}
          />
          <div>
            <p className="text-sm font-medium text-foreground">Couleur sélectionnée</p>
            <p className="text-xs text-muted mt-0.5">{accentColor}</p>
          </div>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="ml-auto w-10 h-10 rounded-lg cursor-pointer border border-white/10 dark:border-gray-300 bg-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onColorChange(color.value)}
              title={color.label}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                accentColor === color.value ? "border-white dark:border-gray-900 scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
        {saveError && (
          <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{saveError}</p>
        )}
        <button
          onClick={onSave}
          disabled={saving || disabled}
          className="self-start px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: saved ? "#16a34a" : accentColor }}
        >
          {saving ? "Sauvegarde..." : saved ? "Sauvegardé" : "Sauvegarder les paramètres"}
        </button>
      </div>
    </div>
  );
}
