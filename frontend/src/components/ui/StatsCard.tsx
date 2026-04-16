type Props = {
  label: string;
  value: string | number;
  icon: string;
  color: string; // Tailwind bg class e.g. "bg-purple-500/10"
  textColor: string; // e.g. "text-purple-400"
};

export default function StatsCard({ label, value, icon, color, textColor }: Props) {
  return (
    <div className="bg-[#1a1a2e] dark:bg-white rounded-2xl p-5 border border-white/5 dark:border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 dark:text-gray-500 text-sm">{label}</span>
        <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center text-lg`}>
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
