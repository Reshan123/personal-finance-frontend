import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-slate-800">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};