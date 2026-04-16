import MarkdownRenderer from "@/components/course/MarkdownRenderer";

type Props = { content: string; onChange: (v: string) => void };

export default function TheoryEditor({ content, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 h-full divide-x divide-white/10 dark:divide-gray-200 overflow-hidden">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Écrivez le contenu en Markdown..."
        className="h-full bg-transparent text-white dark:text-gray-900 text-sm font-mono p-5 focus:outline-none resize-none placeholder-gray-600"
      />
      <div className="h-full overflow-y-auto p-5">
        {content ? <MarkdownRenderer content={content} /> : <p className="text-gray-600 text-sm italic">La prévisualisation apparaîtra ici.</p>}
      </div>
    </div>
  );
}
