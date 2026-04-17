type TabItem = { key: string; label: string };

type Props = {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
};

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-white/5 rounded-xl p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            active === tab.key
              ? "bg-accent text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
