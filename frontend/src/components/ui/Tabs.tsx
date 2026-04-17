import { TabsRoot, TabList, Tab } from "@heroui/react";

type TabItem = { key: string; label: string };

type Props = {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
};

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <TabsRoot selectedKey={active} onSelectionChange={(key) => onChange(key as string)}>
      <TabList>
        {tabs.map((tab) => (
          <Tab key={tab.key} id={tab.key}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
    </TabsRoot>
  );
}
