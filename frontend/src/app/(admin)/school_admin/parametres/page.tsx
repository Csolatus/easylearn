"use client";

import { useState } from "react";
import { useSchoolStore } from "@/store/schoolStore";

export default function ParametresPage() {
  const activeSchool = useSchoolStore((s) => s.activeSchool);
  const [schoolName, setSchoolName] = useState(activeSchool?.name ?? "");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState("#ea580c");

  const PRESET_COLORS = [
    { label: "Orange", value: "#ea580c" },
    { label: "Bleu", value: "#2563eb" },
    { label: "Violet", value: "#7c3aed" },
    { label: "Vert", value: "#16a34a" },
    { label: "Rouge", value: "#dc2626" },
    { label: "Rose", value: "#db2777" },
  ];

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Configurez les informations de votre école
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50">
          <h2 className="text-sm font-semibold text-white dark:text-gray-900">Informations de l&apos;école</h2>
        </div>
        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nom de l&apos;école</label>
            <input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email de contact</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Site web</label>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Adresse</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-white dark:text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50">
          <h2 className="text-sm font-semibold text-white dark:text-gray-900">Logo de l&apos;école</h2>
        </div>
        <div className="px-6 py-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 dark:border-gray-300 bg-white/5 dark:bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
            {logo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
              </>
            ) : (
              <span className="text-3xl">🏛️</span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Format recommandé : PNG ou SVG, 256x256px minimum
            </p>
            <div className="flex gap-3">
              <label className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white transition-colors">
                📁 Choisir un fichier
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setLogo(URL.createObjectURL(file));
                  }}
                />
              </label>
              {logo && (
                <button
                  onClick={() => setLogo(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-white/10 dark:border-gray-300 text-gray-400 dark:text-gray-600 hover:bg-white/5 dark:hover:bg-gray-100 transition-colors"
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50">
          <h2 className="text-sm font-semibold text-white dark:text-gray-900">Couleur d&apos;accent</h2>
        </div>
        <div className="px-6 py-6 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl border-2 border-white/10 dark:border-gray-300 shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <div>
              <p className="text-sm font-medium text-white dark:text-gray-900">Couleur sélectionnée</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{accentColor}</p>
            </div>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="ml-auto w-10 h-10 rounded-lg cursor-pointer border border-white/10 dark:border-gray-300 bg-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setAccentColor(color.value)}
                title={color.label}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  accentColor === color.value ? "border-white dark:border-gray-900 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
          <button
            className="self-start px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            Sauvegarder les paramètres
          </button>
        </div>
      </div>
    </div>
  );
}
