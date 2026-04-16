type Stat = { label: string; value: string; color: string };

type Props = { stats: Stat[] };

export default function StudentStatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5">
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-white dark:text-gray-900 text-sm font-medium mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
