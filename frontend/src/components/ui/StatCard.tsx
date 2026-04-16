type Props = {
  label: string;
  value: string;
  color: string;
  sub?: string;
};

export default function StatCard({ label, value, color, sub }: Props) {
  return (
    <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-5">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-white dark:text-gray-900 text-sm font-medium mt-1">{label}</p>
      {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}
