import type { ActivityItem } from "@/types/api";

const ACTIVITY_ICONS: Record<string, string> = {
  lesson_complete: "✅",
  quiz_submit: "📝",
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
      {activity.map((item, i) => (
        <div key={i} className="flex gap-3">
          <span className="text-lg shrink-0">{ACTIVITY_ICONS[item.type] ?? "📌"}</span>
          <div>
            <p className="text-xs text-gray-300 dark:text-gray-700 leading-snug">
              {ACTIVITY_LABELS[item.type] ?? item.type} — <span className="text-foreground">{item.lesson_title}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {item.course_title} · {new Date(item.timestamp).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
