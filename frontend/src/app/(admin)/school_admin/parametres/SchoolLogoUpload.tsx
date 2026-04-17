"use client";

import { Landmark, FolderOpen } from "lucide-react";

interface Props {
  logo: string | null;
  onLogoChange: (url: string) => void;
  onLogoRemove: () => void;
}

export function SchoolLogoUpload({ logo, onLogoChange, onLogoRemove }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-surface shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-white/5">
        <h2 className="text-sm font-semibold text-foreground">Logo de l&apos;école</h2>
      </div>
      <div className="px-6 py-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 dark:border-gray-300 bg-white/5 dark:bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <Landmark size={28} className="text-gray-400" />
          )}
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Format recommandé : PNG ou SVG, 256x256px minimum
          </p>
          <div className="flex gap-3">
            <label className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white transition-colors flex items-center gap-2">
              <FolderOpen size={14} /> Choisir un fichier
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onLogoChange(URL.createObjectURL(file));
                }}
              />
            </label>
            {logo && (
              <button
                onClick={onLogoRemove}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-white/10 dark:border-gray-300 text-gray-400 dark:text-gray-600 hover:bg-surface transition-colors"
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
