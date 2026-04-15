"use client";

export default function StudentProfilPage() {
  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Mon Profil</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 dark:border-gray-200 bg-[#111118] dark:bg-white px-6 py-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          A
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white dark:text-gray-900">Alexandre Dupont</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">alexandre.dupont@email.com</p>
          <span className="inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 dark:text-purple-600">
            Étudiant
          </span>
        </div>
        <button className="shrink-0 text-sm font-medium px-4 py-2 rounded-xl border border-purple-500/30 text-purple-400 dark:text-purple-600 hover:bg-purple-500/10 transition-colors">
          ✏️ Modifier
        </button>
      </div>
    </div>
  );
}
