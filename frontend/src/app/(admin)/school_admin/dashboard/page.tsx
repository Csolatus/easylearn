"use client";

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
    </div>
  );
}
