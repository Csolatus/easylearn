type Props = {
  title: string;
  visibility: "public" | "school" | "private";
  onTitleChange: (v: string) => void;
  onVisibilityChange: (v: "public" | "school" | "private") => void;
};

export default function CourseInfoForm({ title, visibility, onTitleChange, onVisibilityChange }: Props) {
  return (
    <div className="bg-[#1a1a2e] dark:bg-white dark:shadow-sm rounded-2xl p-6 flex flex-col gap-5">
      <h2 className="font-semibold text-white dark:text-gray-900">Informations générales</h2>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">Titre</label>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-200 text-white dark:text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">Visibilité</label>
        <div className="flex gap-3 flex-wrap">
          {(["private", "school", "public"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onVisibilityChange(v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-colors ${
                visibility === v ? "border-green-500 bg-green-500/10 text-green-400" : "border-white/10 dark:border-gray-200 text-gray-400 hover:border-green-500/50"
              }`}
            >
              {v === "public" ? "🌍 Public" : v === "school" ? "🏫 École" : "🔒 Privé"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
