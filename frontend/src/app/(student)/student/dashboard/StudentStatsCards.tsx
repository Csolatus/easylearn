type Stat = { label: string; value: string; color: string };

type Props = { stats: Stat[] };

export default function StudentStatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-surface rounded-2xl p-5">
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-foreground text-sm font-medium mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
