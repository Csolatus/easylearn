type Stat = { label: string; value: string; icon: string; color: string };

type Props = { stats: Stat[] };

export default function TeacherStatsRow({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className={`rounded-2xl p-5 bg-gradient-to-br ${s.color} text-white`}>
          <p className="text-3xl mb-1">{s.icon}</p>
          <p className="text-2xl font-bold">{s.value}</p>
          <p className="text-sm font-medium opacity-90 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
