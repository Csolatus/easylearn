type Props = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function LessonTabs({ tabs, activeTab, onTabChange }: Props) {
  return (
    <div className="flex border-b border-border bg-background shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === tab
              ? "border-purple-500 text-purple-400 dark:text-purple-600"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
