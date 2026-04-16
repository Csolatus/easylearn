"use client";

import KpiCard from "@/components/ui/KpiCard";
import DataTable from "@/components/ui/DataTable";

const KPI_CARDS = [
  {
    label: "Écoles actives",
    value: "24",
    delta: "+3 ce mois",
    positive: true,
    icon: "🏛️",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
  },
  {
    label: "Utilisateurs totaux",
    value: "12 480",
    delta: "+8% vs mois dernier",
    positive: true,
    icon: "👥",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  {
    label: "Cours publiés",
    value: "3 217",
    delta: "+142 cette semaine",
    positive: true,
    icon: "📖",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
  },
  {
    label: "Taux d'engagement",
    value: "73%",
    delta: "-2% vs mois dernier",
    positive: false,
    icon: "📊",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
  },
];

const RECENT_SCHOOLS = [
  { name: "École Polytechnique", admin: "admin@polytechnique.fr", eleves: 1240, statut: "Actif" },
  { name: "EFREI Paris", admin: "admin@efrei.fr", eleves: 980, statut: "Actif" },
  { name: "Sciences Po", admin: "admin@sciencespo.fr", eleves: 760, statut: "Actif" },
  { name: "HEC Paris", admin: "admin@hec.fr", eleves: 620, statut: "Suspendu" },
  { name: "CentraleSupélec", admin: "admin@centralesupelec.fr", eleves: 540, statut: "Actif" },
];

export default function SuperAdminDashboardPage() {
  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Vue d&apos;ensemble de toutes les écoles
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* Recent Schools Table */}
      <div className="rounded-2xl border border-white/5 dark:border-gray-200 bg-[#111118] dark:bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 dark:border-gray-100">
          <h2 className="text-sm font-semibold text-white dark:text-gray-900">Écoles récentes</h2>
          <a href="/super_admin/ecoles" className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium">
            Voir tout →
          </a>
        </div>
        <DataTable headers={["École", "Admin", "Élèves", "Statut"]}>
          {RECENT_SCHOOLS.map((school) => (
            <tr key={school.name} className="hover:bg-white/5 dark:hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center text-sm">🏛️</div>
                  <span className="font-medium text-white dark:text-gray-900">{school.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-400 dark:text-gray-500">{school.admin}</td>
              <td className="px-6 py-4 text-gray-300 dark:text-gray-700 font-medium">{school.eleves.toLocaleString()}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${school.statut === "Actif" ? "bg-green-500/10 text-green-400 dark:text-green-600" : "bg-red-500/10 text-red-400 dark:text-red-600"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${school.statut === "Actif" ? "bg-green-400" : "bg-red-400"}`} />
                  {school.statut}
                </span>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
