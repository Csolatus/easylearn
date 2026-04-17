type Props = {
  lessonTitle: string;
  courseTitle: string;
  isCompleted: boolean;
  onMarkComplete: () => void;
};

export default function LessonHeader({ lessonTitle, courseTitle, isCompleted, onMarkComplete }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 dark:border-gray-200 bg-[#0f0f1a] dark:bg-white shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-white dark:text-gray-900">{lessonTitle}</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{courseTitle}</p>
      </div>
      <button
        onClick={onMarkComplete}
        disabled={isCompleted}
        className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
          isCompleted
            ? "bg-green-600/20 text-green-400 cursor-default"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
      >
        {isCompleted ? "Leçon complétée" : "Marquer comme lu"}
      </button>
    </div>
  );
}
