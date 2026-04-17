"use client";

type Course = {
  id: string;
  title: string;
  visibility: string;
};

interface Props {
  courses: Course[];
  whitelist: Set<string>;
  toggling: string | null;
  hasActiveSchool: boolean;
  whitelistCount: number;
  onToggle: (courseId: string) => void;
}

export function CatalogueList({ courses, whitelist, toggling, hasActiveSchool, whitelistCount, onToggle }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 dark:border-gray-400 bg-surface shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 dark:border-gray-300 flex items-center justify-between bg-white/5">
        <h2 className="text-sm font-semibold text-foreground">Cours disponibles</h2>
        {hasActiveSchool && (
          <span className="text-xs text-muted">
            {whitelistCount} cours autorisé{whitelistCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {courses.length === 0 ? (
        <p className="px-6 py-6 text-sm text-gray-500 text-center">Aucun cours trouvé.</p>
      ) : (
        <div className="divide-y divide-white/10 dark:divide-gray-300">
          {courses.map((course) => {
            const isWhitelisted = whitelist.has(course.id);
            return (
              <div
                key={course.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-surface transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-600/20 flex items-center justify-center text-lg shrink-0">
                  📖
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                  <p className="text-xs text-muted mt-0.5 capitalize">{course.visibility}</p>
                </div>
                {hasActiveSchool && (
                  <button
                    onClick={() => onToggle(course.id)}
                    disabled={toggling === course.id}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                      isWhitelisted
                        ? "bg-orange-500/20 text-orange-400 hover:bg-red-500/20 hover:text-red-400"
                        : "bg-white/5 text-gray-400 hover:bg-orange-500/20 hover:text-orange-400"
                    }`}
                  >
                    {toggling === course.id ? "…" : isWhitelisted ? "Autorisé ✓" : "Autoriser"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
