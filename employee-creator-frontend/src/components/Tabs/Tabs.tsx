import classes from "./Tabs.module.scss";

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTabId: string;
}

export function Tabs({ tabs, activeTabId }: TabsProps) {
  return (
    <div className={classes.tabs} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeTabId}
          disabled={tab.disabled}
          className={[
            classes.tab,
            tab.id === activeTabId ? classes.active : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
