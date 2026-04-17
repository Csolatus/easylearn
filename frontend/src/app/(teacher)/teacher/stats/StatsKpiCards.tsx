type KpiCard = { label: string; value: string; sub: string; color: string };

type Props = { cards: KpiCard[] };

export default function StatsKpiCards({ cards }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-surface rounded-2xl p-5">
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          <p className="text-foreground text-sm font-medium mt-1">{card.label}</p>
          <p className="text-gray-500 text-xs mt-0.5">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
