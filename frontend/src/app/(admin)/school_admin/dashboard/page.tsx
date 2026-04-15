"use client";

const ACTIVITY_DATA = [
  40, 55, 30, 70, 60, 45, 80, 50, 65, 35,
  75, 90, 55, 40, 60, 70, 85, 45, 30, 65,
  50, 75, 60, 80, 40, 55, 70, 90, 65, 50,
];

const KPI_CARDS = [
  { label: "Élèves inscrits", value: "342", delta: "+12 ce mois", positive: true, icon: "🎓", bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
  { label: "Professeurs actifs", value: "18", delta: "+2 ce mois", positive: true, icon: "🧑‍🏫", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  { label: "Cours disponibles", value: "94", delta: "+7 cette semaine", positive: true, icon: "📖", bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
  { label: "Taux de complétion", value: "68%", delta: "-3% vs mois dernier", positive: false, icon: "📊", bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400" },
];

export default function SchoolAdminDashboardPage() {
  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Vue d&apos;ensemble de votre école
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border ${card.border} ${card.bg} px-5 py-5 flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">{card.icon}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                card.positive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              }`}>
                {card.delta}
              </span>
            </div>
            <div>
              <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-[#111118] dark:bg-white shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-white dark:text-gray-900">Activité — 30 derniers jours</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Connexions élèves par jour</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 dark:text-orange-600">
            +14% ce mois
          </span>
        </div>
        <div className="flex items-end gap-1 h-28">
          {ACTIVITY_DATA.map((value, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end group relative">
              <div
                className="w-full bg-orange-500/30 hover:bg-orange-500 rounded-sm transition-colors duration-150"
                style={{ height: `${value}%` }}
              />
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-white dark:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {value}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>J-30</span>
          <span>J-15</span>
          <span>Aujourd&apos;hui</span>
        </div>
      </div>
    </div>
  );
}
