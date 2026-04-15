"use client";

const STATS = [
  { label: "Écoles actives", value: "12", icon: "🏛️", color: "text-red-400" },
  { label: "Professeurs", value: "148", icon: "🧑‍🏫", color: "text-orange-400" },
  { label: "Étudiants", value: "3 241", icon: "🎓", color: "text-yellow-400" },
  { label: "Cours publiés", value: "534", icon: "📖", color: "text-pink-400" },
];

const SCHOOLS = [
  { name: "EFREI Paris", teachers: 18, students: 420, plan: "Enterprise" },
  { name: "ISEP", teachers: 12, students: 310, plan: "Pro" },
  { name: "Epitech Lyon", teachers: 9, students: 180, plan: "Pro" },
  { name: "IUT Paris Rives de Seine", teachers: 7, students: 95, plan: "Starter" },
];

const ACTIVITY = [
  { text: "Nouvelle école inscrite : Polytech Nantes", time: "il y a 2h", icon: "🏛️" },
  { text: "EFREI Paris — 15 nouveaux étudiants", time: "il y a 5h", icon: "🎓" },
  { text: "Mise à jour plan Enterprise — ISEP", time: "hier", icon: "💳" },
  { text: "Rapport mensuel généré", time: "il y a 2 jours", icon: "📊" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] dark:bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        <div>
          <h1 className="text-3xl font-bold text-white dark:text-gray-900">Vue plateforme</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Supervision globale de toutes les écoles.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5">
              <span className="text-2xl">{s.icon}</span>
              <p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value}</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white dark:text-gray-900">Écoles</h2>
              <a href="/super_admin/ecoles" className="text-red-400 hover:text-red-300 text-xs">Voir tout →</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 dark:text-gray-500 text-xs border-b border-white/5 dark:border-gray-200">
                    <th className="text-left pb-3 font-medium">École</th>
                    <th className="text-left pb-3 font-medium">Profs</th>
                    <th className="text-left pb-3 font-medium">Étudiants</th>
                    <th className="text-left pb-3 font-medium">Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 dark:divide-gray-100">
                  {SCHOOLS.map((s) => (
                    <tr key={s.name} className="text-xs">
                      <td className="py-3 text-white dark:text-gray-900 font-medium">{s.name}</td>
                      <td className="py-3 text-gray-400 dark:text-gray-500">{s.teachers}</td>
                      <td className="py-3 text-gray-400 dark:text-gray-500">{s.students}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.plan === "Enterprise" ? "bg-red-500/20 text-red-400" :
                          s.plan === "Pro" ? "bg-orange-500/20 text-orange-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>{s.plan}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white dark:text-gray-900">Activité récente</h2>
            {ACTIVITY.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-lg shrink-0">{item.icon}</span>
                <div>
                  <p className="text-xs text-gray-300 dark:text-gray-700 leading-snug">{item.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
