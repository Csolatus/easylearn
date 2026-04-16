import Link from "next/link";

type Lesson = { id: string; title: string };

type Props = {
  courseId: string;
  courseTitle: string | null;
  lessons: Lesson[];
  selectedId: string | null;
  showAddLesson: boolean;
  newLessonTitle: string;
  addingLesson: boolean;
  addLessonError: string | null;
  onSelectLesson: (id: string) => void;
  onShowAdd: () => void;
  onHideAdd: () => void;
  onNewTitleChange: (v: string) => void;
  onAddLesson: () => void;
};

export default function LessonEditorSidebar({
  courseId, courseTitle, lessons, selectedId, showAddLesson, newLessonTitle,
  addingLesson, addLessonError, onSelectLesson, onShowAdd, onHideAdd, onNewTitleChange, onAddLesson,
}: Props) {
  return (
    <aside className="w-64 shrink-0 border-r border-white/10 dark:border-gray-200 bg-[#0d0d1a] dark:bg-gray-50 flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b border-white/10 dark:border-gray-200">
        <Link href="/teacher/cours" className="text-xs text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors">
          ← Retour aux cours
        </Link>
        <p className="text-xs font-semibold text-white dark:text-gray-900 mt-2 truncate">{courseTitle ?? "Chargement..."}</p>
        <Link href={`/teacher/cours/${courseId}/edit`} className="text-xs text-green-400 hover:text-green-300 transition-colors mt-0.5 inline-block">
          ✏️ Paramètres du cours
        </Link>
      </div>

      <div className="px-3 py-3 flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Leçons</p>
        {lessons.length === 0 && <p className="text-xs text-gray-600 px-2 py-4 text-center">Aucune leçon.</p>}
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelectLesson(lesson.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors mb-1 ${
              selectedId === lesson.id ? "bg-green-600/20 text-green-400" : "text-gray-400 dark:text-gray-500 hover:bg-white/5 dark:hover:bg-gray-100"
            }`}
          >
            <span className="text-xs truncate flex-1">{lesson.title}</span>
          </button>
        ))}

        {showAddLesson ? (
          <div className="mt-2 flex flex-col gap-2 px-2">
            <input
              value={newLessonTitle}
              onChange={(e) => onNewTitleChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAddLesson()}
              placeholder="Titre de la leçon"
              autoFocus
              className="bg-white/5 dark:bg-white border border-white/20 dark:border-gray-300 text-white dark:text-gray-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-600"
            />
            {addLessonError && <p className="text-xs text-red-400">{addLessonError}</p>}
            <div className="flex gap-2">
              <button onClick={onHideAdd} className="flex-1 text-xs text-gray-500 hover:text-white transition-colors py-1">Annuler</button>
              <button onClick={onAddLesson} disabled={addingLesson || !newLessonTitle.trim()} className="flex-1 text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-1 rounded-lg transition-colors">
                {addingLesson ? "..." : "Ajouter"}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={onShowAdd} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-400 hover:text-green-300 transition-colors mt-2">
            + Ajouter une leçon
          </button>
        )}
      </div>
    </aside>
  );
}
