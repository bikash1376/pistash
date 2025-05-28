import React, { useState } from "react";

type TabProps = {
  tabs: {
    id: string;
    label: string;
    content: string;
    color?: string;
    textColor?: string;
    width?: string;
  }[];
};

const Tabs: React.FC<TabProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full mx-auto mt-10 p-4 bg-gray-100 rounded-lg shadow-md">
      {/* Tab Buttons */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-3 font-medium transition-transform duration-500 ease-in-out ${
              activeTab === tab.id ? `${tab.textColor || "text-blue-500"} border-b-4 border-blue-500 scale-110` : "text-gray-600"
            }`}
            style={{ backgroundColor: tab.color || "transparent", width: tab.width || "auto" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`transition-opacity duration-500 ease-in-out ${
              activeTab === tab.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 hidden"
            }`}
            style={{ backgroundColor: tab.color || "transparent", width: tab.width || "auto", color: tab.textColor || "black" }}
          >
            <p className="text-lg">{tab.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;