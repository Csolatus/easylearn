type Props = {
  icon: string;
  value: string;
  label: string;
  delta: string;
  positive: boolean;
  bg: string;
  border: string;
  text: string;
};

export default function KpiCard({ icon, value, label, delta, positive, bg, border, text }: Props) {
  return (
    <div className={`rounded-2xl border ${border} ${bg} px-5 py-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <span className="text-xl">{icon}</span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            positive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          }`}
        >
          {delta}
        </span>
      </div>
      <div>
        <p className={`text-2xl font-bold ${text}`}>{value}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
