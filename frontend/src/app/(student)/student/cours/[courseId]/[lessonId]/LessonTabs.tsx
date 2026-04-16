type Props = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function LessonTabs({ tabs, activeTab, onTabChange }: Props) {
  return (
    <div className="flex border-b border-white/10 dark:border-gray-200 bg-white/5 dark:bg-gray-50 shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === tab
              ? "border-purple-500 text-purple-400 dark:text-purple-600"
              : "border-transparent text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
