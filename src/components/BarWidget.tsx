import { useState } from "react";
import { RevenueChart } from "./RevenueChart";
import {
  Share2,
  Filter,
  Download,
  FileText,
  Maximize2,
  MoreHorizontal,
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("hour");

  const tabs = [
    "Hour",
    "Meal period",
    "Weekday",
    "Daily",
    "Weekly",
    "Country",
    "Brand",
    "Outlet",
  ];

  const chartData = [
    {
      category: "Brand 1",
      actual: 5200,
      previous: 4800,
      target: 5500,
      flagged: true,
    },
    { category: "Brand 2", actual: 6800, previous: 5400, target: 6500 },
    { category: "11:00 AM", actual: 3900, previous: 3500, target: 4200 },
    { category: "12:00 PM", actual: 4200, previous: 4800, target: 4500 },
    {
      category: "01:00 PM",
      actual: 5800,
      previous: 6200,
      target: 6000,
      flagged: true,
    },
    { category: "02:00 PM", actual: 4100, previous: 3800, target: 4400 },
    { category: "03:00 PM", actual: 5100, previous: 4900, target: 5300 },
    { category: "04:00 PM", actual: 4500, previous: 4200, target: 4800 },
    { category: "05:00 PM", actual: 5500, previous: 5800, target: 5700 },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-lg ">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 ">
            <h1 className="text-xl font-semibold text-foreground">Revenue</h1>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-accent rounded transition-colors">
                <Share2 className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded transition-colors">
                <Filter className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded transition-colors">
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded transition-colors">
                <FileText className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded transition-colors">
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded transition-colors">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 px-6 py-3  overflow-x-auto ">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab.toLowerCase().replace(" ", "-"))
                }
                className={`pb-2 px-1 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
                  activeTab === tab.toLowerCase().replace(" ", "-")
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="px-6 py-6 shadow-sm border-0 border-gray-400 ">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Kuwait</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-semibold text-foreground">
                  35,615
                </h2>
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-destructive">
                    <svg
                      className="w-2 h-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                  <span>-3.1%</span>
                </div>
              </div>
            </div>
            <RevenueChart data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
