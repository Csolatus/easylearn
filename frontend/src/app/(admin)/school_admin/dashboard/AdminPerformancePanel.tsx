"use client";

type SchoolAnalytics = {
  avg_lesson_completion_pct: number;
  avg_quiz_score_pct: number;
};

interface Props {
  analytics: SchoolAnalytics;
}

export function AdminPerformancePanel({ analytics }: Props) {
  const completion = Math.round(analytics.avg_lesson_completion_pct);
  const quiz = Math.round(analytics.avg_quiz_score_pct);

  return (
    <div className="rounded-2xl border border-white/10 dark:border-gray-300 bg-surface shadow-md p-6">
      <h2 className="text-sm font-semibold text-foreground mb-6">Performance globale</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-40">Complétion leçons</span>
          <div className="flex-1 h-2 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${completion}%` }} />
          </div>
          <span className="text-xs text-orange-400 w-10 text-right">{completion}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-40">Score quiz moyen</span>
          <div className="flex-1 h-2 bg-white/10 dark:bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${quiz}%` }} />
          </div>
          <span className="text-xs text-yellow-400 w-10 text-right">{quiz}%</span>
        </div>
      </div>
    </div>
  );
}
