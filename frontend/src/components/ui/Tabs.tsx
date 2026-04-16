type Tab = { key: string; label: string };

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  accentColor?: string;
};

export default function Tabs({ tabs, active, onChange, accentColor = "purple" }: Props) {
  const activeClass = `border-${accentColor}-500 text-${accentColor}-400`;
  return (
    <div className="flex border-b border-white/10 dark:border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
            active === tab.key
              ? activeClass
              : "border-transparent text-gray-400 hover:text-white dark:hover:text-gray-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
