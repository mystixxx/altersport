import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface Tab {
  label: string;
  id: string;
}

interface LandingTabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function LandingTabs({
  tabs,
  defaultActiveTab,
  onTabChange,
}: LandingTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="flex w-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={cn(
            "flex-1 cursor-pointer border-b-2 border-[#5B5B5BCC] py-3 text-center font-medium text-white transition-colors",
            activeTab === tab.id
              ? "border-b-2 border-[#FF6D70] text-[#FF6D70]"
              : "hover:bg-white/10",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
