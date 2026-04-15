"use client";

import { useState } from "react";

export default function ParametresPage() {
  const [schoolName, setSchoolName] = useState("EFREI Paris");
  const [email, setEmail] = useState("contact@efrei.fr");
  const [website, setWebsite] = useState("https://www.efrei.fr");
  const [address, setAddress] = useState("30-32 Avenue de la République, 94800 Villejuif");

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
    </div>
  );
}
