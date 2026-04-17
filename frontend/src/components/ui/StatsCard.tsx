type Props = {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  textColor: string;
};

export default function StatsCard({ label, value, icon, color, textColor }: Props) {
  return (
    <div className="bg-white/5 dark:bg-gray-800 border border-white/10 dark:border-gray-400 rounded-2xl shadow-md p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted text-sm">{label}</span>
        <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center text-lg`}>
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
