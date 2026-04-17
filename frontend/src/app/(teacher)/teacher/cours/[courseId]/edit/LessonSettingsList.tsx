import { FileText, X } from "lucide-react";

type Lesson = { id: string; title: string; docs: string | null; ordre: number };

type Props = {
  lessons: Lesson[];
  deletingLesson: string | null;
  showAddForm: boolean;
  newTitle: string;
  newDocs: string;
  addingLesson: boolean;
  lessonError: string | null;
  onShowAdd: () => void;
  onHideAdd: () => void;
  onNewTitleChange: (v: string) => void;
  onNewDocsChange: (v: string) => void;
  onAddLesson: () => void;
  onDeleteLesson: (id: string) => void;
};

export default function LessonSettingsList({
  lessons, deletingLesson, showAddForm, newTitle, newDocs, addingLesson, lessonError,
  onShowAdd, onHideAdd, onNewTitleChange, onNewDocsChange, onAddLesson, onDeleteLesson,
}: Props) {
  return (
    <div className="bg-surface rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Leçons ({lessons.length})</h2>
        <button onClick={onShowAdd} className="text-green-400 hover:text-green-300 text-xs font-medium transition-colors">+ Ajouter une leçon</button>
      </div>

      {lessons.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Aucune leçon. Commencez par en ajouter une.</p>}

      <div className="flex flex-col gap-2">
        {lessons.map((lesson, i) => (
          <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 group">
            <span className="text-gray-500 text-xs w-4">{i + 1}</span>
            <span className="text-sm text-foreground flex-1 truncate">{lesson.title}</span>
            {lesson.docs && <span className="text-xs text-gray-500 hidden group-hover:block truncate max-w-32">📄 docs</span>}
            <button
              onClick={() => onDeleteLesson(lesson.id)}
              disabled={deletingLesson === lesson.id}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all disabled:opacity-30"
            ><X size={14} /></button>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-green-500/30 bg-green-500/5 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">Titre de la leçon *</label>
            <input
              value={newTitle}
              onChange={(e) => onNewTitleChange(e.target.value)}
              placeholder="ex: Introduction aux variables"
              autoFocus
              className="bg-white/5 dark:bg-gray-100 border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">Contenu / docs (Markdown)</label>
            <textarea
              value={newDocs}
              onChange={(e) => onNewDocsChange(e.target.value)}
              placeholder="Contenu de la leçon en Markdown..."
              rows={4}
              className="bg-white/5 dark:bg-gray-100 border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 resize-none"
            />
          </div>
          {lessonError && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{lessonError}</p>}
          <div className="flex gap-3">
            <button onClick={onHideAdd} className="flex-1 text-sm text-gray-400 hover:text-white transition-colors py-2">Annuler</button>
            <button onClick={onAddLesson} disabled={addingLesson || !newTitle.trim()} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
              {addingLesson ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
