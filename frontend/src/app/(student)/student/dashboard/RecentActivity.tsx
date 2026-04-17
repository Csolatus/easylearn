import { CheckCircle, FileText, Pin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ActivityItem } from "@/types/api";

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  lesson_complete: CheckCircle,
  quiz_submit: FileText,
};

const ACTIVITY_LABELS: Record<string, string> = {
  lesson_complete: "Leçon complétée",
  quiz_submit: "Quiz soumis",
};

type Props = { activity: ActivityItem[] };

export default function RecentActivity({ activity }: Props) {
  return (
    <div className="bg-surface rounded-2xl p-6 flex flex-col gap-4">
      <h2 className="font-semibold text-foreground">Activité récente</h2>
      {activity.length === 0 && (
        <p className="text-xs text-gray-500 text-center py-4">Aucune activité récente.</p>
      )}
      {activity.map((item, i) => {
        const Icon = ACTIVITY_ICONS[item.type] ?? Pin;
        return (
          <div key={i} className="flex gap-3">
            <span className="shrink-0 mt-0.5 text-gray-400">
              <Icon size={18} />
            </span>
            <div>
              <p className="text-xs text-gray-300 dark:text-gray-700 leading-snug">
                {ACTIVITY_LABELS[item.type] ?? item.type} — <span className="text-white dark:text-gray-900">{item.lesson_title}</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.course_title} · {new Date(item.timestamp).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
