import { CardRoot, CardContent } from "@heroui/react";

type Props = {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  textColor: string;
};

export default function StatsCard({ label, value, icon, color, textColor }: Props) {
  return (
    <CardRoot variant="secondary">
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <span className="text-muted text-sm">{label}</span>
          <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center text-lg`}>
            {icon}
          </div>
        </div>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </CardContent>
    </CardRoot>
  );
}
