"use client";

interface Props {
  total: number;
  active: number;
}

export function SuperAdminKpiCards({ total, active }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-5 flex flex-col gap-3">
        <span className="text-xl">🏛️</span>
        <div>
          <p className="text-2xl font-bold text-red-400">{total}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Écoles enregistrées</p>
        </div>
      </div>
      <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-5 flex flex-col gap-3">
        <span className="text-xl">✅</span>
        <div>
          <p className="text-2xl font-bold text-green-400">{active}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Écoles actives</p>
        </div>
      </div>
    </div>
  );
}
