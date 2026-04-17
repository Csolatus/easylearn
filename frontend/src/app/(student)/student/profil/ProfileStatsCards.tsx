import type { ReactNode } from "react";

type Stat = { label: string; value: string; icon: ReactNode; bg: string; border: string; text: string };

type Props = { stats: Stat[] };

export default function ProfileStatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`rounded-2xl border ${stat.border} ${stat.bg} px-5 py-5 flex flex-col gap-2`}>
          <span className={`${stat.text}`}>{stat.icon}</span>
          <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
          <p className="text-xs text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
