// import { useState } from "react";
// import { RevenueChart } from "./RevenueChart";
// import {
//   Share2,
//   Filter,
//   Download,
//   FileText,
//   Maximize2,
//   MoreHorizontal,
// } from "lucide-react";

// const Index = () => {
//   const [activeTab, setActiveTab] = useState("hour");

//   const tabs = [
//     "Hour",
//     "Meal period",
//     "Weekday",
//     "Daily",
//     "Weekly",
//     "Country",
//     "Brand",
//     "Outlet",
//   ];

//   const chartData = [
//     {
//       category: "Brand 1",
//       actual: 5200,
//       previous: 4800,
//       target: 5500,
//       flagged: true,
//     },
//     { category: "Brand 2", actual: 6800, previous: 5400, target: 6500 },
//     { category: "11:00 AM", actual: 3900, previous: 3500, target: 4200 },
//     { category: "12:00 PM", actual: 4200, previous: 4800, target: 4500 },
//     {
//       category: "01:00 PM",
//       actual: 5800,
//       previous: 6200,
//       target: 6000,
//       flagged: true,
//     },
//     { category: "02:00 PM", actual: 4100, previous: 3800, target: 4400 },
//     { category: "03:00 PM", actual: 5100, previous: 4900, target: 5300 },
//     { category: "04:00 PM", actual: 4500, previous: 4200, target: 4800 },
//     { category: "05:00 PM", actual: 5500, previous: 5800, target: 5700 },
//   ];

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-card rounded-lg ">
//           {/* Header */}
//           <div className="flex items-center justify-between px-6 py-4 ">
//             <h1 className="text-xl font-semibold text-foreground">Revenue</h1>
//             <div className="flex items-center gap-1">
//               <button className="p-2 hover:bg-accent rounded transition-colors">
//                 <Share2 className="w-4 h-4 text-muted-foreground" />
//               </button>
//               <button className="p-2 hover:bg-accent rounded transition-colors">
//                 <Filter className="w-4 h-4 text-muted-foreground" />
//               </button>
//               <button className="p-2 hover:bg-accent rounded transition-colors">
//                 <Download className="w-4 h-4 text-muted-foreground" />
//               </button>
//               <button className="p-2 hover:bg-accent rounded transition-colors">
//                 <FileText className="w-4 h-4 text-muted-foreground" />
//               </button>
//               <button className="p-2 hover:bg-accent rounded transition-colors">
//                 <Maximize2 className="w-4 h-4 text-muted-foreground" />
//               </button>
//               <button className="p-2 hover:bg-accent rounded transition-colors">
//                 <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
//               </button>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex items-center gap-6 px-6 py-3  overflow-x-auto ">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() =>
//                   setActiveTab(tab.toLowerCase().replace(" ", "-"))
//                 }
//                 className={`pb-2 px-1 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
//                   activeTab === tab.toLowerCase().replace(" ", "-")
//                     ? "text-foreground border-primary"
//                     : "text-muted-foreground border-transparent hover:text-foreground"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Content */}
//           <div className="px-6 py-6 shadow-sm border-0 border-gray-400 ">
//             <div className="mb-6">
//               <p className="text-sm text-muted-foreground mb-1">Kuwait</p>
//               <div className="flex items-baseline gap-2">
//                 <h2 className="text-3xl font-semibold text-foreground">
//                   35,615
//                 </h2>
//                 <div className="flex items-center gap-1 text-sm text-destructive">
//                   <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-destructive">
//                     <svg
//                       className="w-2 h-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </span>
//                   <span>-3.1%</span>
//                 </div>
//               </div>
//             </div>
//             <RevenueChart data={chartData} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;

import { useState } from "react";
import {
  Share2,
  Filter,
  Download,
  FileText,
  Maximize2,
  MoreHorizontal,
} from "lucide-react";
import { RevenueChart } from "./RevenueChart";

interface ChartData {
  category: string;
  actual: number;
  previous: number;
  target: number;
  flagged?: boolean;
}

interface RevenueChartProps {
  data: ChartData[];
  location: string;
  value: string;
  change: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("brand");

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

  const chartDataByTab = {
    hour: {
      location: "Kuwait",
      value: "35,615",
      change: "-3.1%",
      data: [
        { category: "11:00 AM", actual: 5500, previous: 5000, target: 6500 },
        { category: "12:00 PM", actual: 6500, previous: 7000, target: 7500 },
        { category: "01:00 PM", actual: 5300, previous: 6200, target: 6000, flagged: true },
        { category: "02:00 PM", actual: 4900, previous: 4500, target: 5000 },
        { category: "03:00 PM", actual: 7000, previous: 7600, target: 8000 },
        { category: "04:00 PM", actual: 5300, previous: 5000, target: 4700 },
        { category: "05:00 PM", actual: 5900, previous: 6500, target: 6700 },
        { category: "06:00 PM", actual: 4800, previous: 5100, target: 5000 },
      ],
    },
    "meal-period": {
      location: "Kuwait",
      value: "42,380",
      change: "+2.4%",
      data: [
        { category: "Breakfast", actual: 6200, previous: 5800, target: 6500 },
        { category: "Lunch", actual: 15400, previous: 14800, target: 15000, flagged: true },
        { category: "Dinner", actual: 12800, previous: 13200, target: 13000 },
        { category: "Snacks", actual: 7980, previous: 7400, target: 7800 },
      ],
    },
    weekday: {
      location: "Kuwait",
      value: "38,920",
      change: "-1.8%",
      data: [
        { category: "Monday", actual: 5700, previous: 4600, target: 5300 },
        { category: "Tuesday", actual: 5200, previous: 5000, target: 5500, flagged: true },
        { category: "Wednesday", actual: 6000, previous: 6100, target: 7000 },
        { category: "Thursday", actual: 6200, previous: 5900, target: 6000 },
        { category: "Friday", actual: 7100, previous: 6800, target: 7000 },
        { category: "Saturday", actual: 5920, previous: 6200, target: 6100 },
        { category: "Sunday", actual: 3400, previous: 3600, target: 3500 },
      ],
    },
    daily: {
      location: "Kuwait",
      value: "5,615",
      change: "-0.8%",
      data: [
        { category: "Day 1", actual: 5100, previous: 5300, target: 5200 },
        { category: "Day 2", actual: 5400, previous: 5600, target: 5500 },
        { category: "Day 3", actual: 5800, previous: 5500, target: 5700, flagged: true },
        { category: "Day 4", actual: 5200, previous: 5400, target: 5300 },
        { category: "Day 5", actual: 5600, previous: 5800, target: 5700 },
      ],
    },
    weekly: {
      location: "Kuwait",
      value: "156,240",
      change: "+4.2%",
      data: [
        { category: "Week 1", actual: 38200, previous: 36800, target: 37500 },
        { category: "Week 2", actual: 39100, previous: 38400, target: 38800 },
        { category: "Week 3", actual: 40400, previous: 38900, target: 39500, flagged: true },
        { category: "Week 4", actual: 38540, previous: 39200, target: 39000 },
      ],
    },
    country: {
      location: "All Countries",
      value: "285,400",
      change: "+1.9%",
      data: [
        { category: "Kuwait", actual: 35600, previous: 34200, target: 35000 },
        { category: "UAE", actual: 52800, previous: 51400, target: 52000, flagged: true },
        { category: "Saudi Arabia", actual: 68200, previous: 66800, target: 67500 },
        { category: "Qatar", actual: 42100, previous: 41600, target: 41800 },
        { category: "Bahrain", actual: 28400, previous: 27800, target: 28100 },
        { category: "Oman", actual: 35300, previous: 34900, target: 35100 },
        { category: "Jordan", actual: 23000, previous: 22500, target: 22800 },
      ],
    },
    brand: {
      location: "Kuwait",
      value: "48,720",
      change: "+3.5%",
      data: [
        { category: "Brand1", actual: 5500, previous: 5000, target: 6500 },
        { category: "Brand2", actual: 6500, previous: 7000, target: 7500 },
        { category: "Brand3", actual: 5300, previous: 6200, target: 6000, flagged: true },
        { category: "Brand4", actual: 4900, previous: 4500, target: 5000 },
        { category: "Brand5", actual: 7000, previous: 7600, target: 8000 },
        { category: "Brand6", actual: 5300, previous: 5000, target: 4700 },
        { category: "Brand7", actual: 5900, previous: 6500, target: 6700 },
        { category: "Brand8", actual: 4800, previous: 5100, target: 5000 },
      ],
    },
    outlet: {
      location: "Kuwait",
      value: "52,340",
      change: "-2.3%",
      data: [
        { category: "Outlet 1", actual: 7200, previous: 7600, target: 7400 },
        { category: "Outlet 2", actual: 8400, previous: 8100, target: 8200, flagged: true },
        { category: "Outlet 3", actual: 6800, previous: 7200, target: 7000 },
        { category: "Outlet 4", actual: 7600, previous: 7400, target: 7500 },
        { category: "Outlet 5", actual: 6200, previous: 6600, target: 6400 },
        { category: "Outlet 6", actual: 5900, previous: 6100, target: 6000 },
        { category: "Outlet 7", actual: 5400, previous: 5700, target: 5550 },
        { category: "Outlet 8", actual: 4840, previous: 5100, target: 4970 },
      ],
    },
  };

  const currentData = chartDataByTab[activeTab];

  return (
    <div className="h-fit bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Revenue</h1>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <Share2 className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <Filter className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <Download className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <FileText className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <Maximize2 className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 px-6 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab.toLowerCase().replace(" ", "-"))
                }
                className={`py-3 px-1 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.toLowerCase().replace(" ", "-")
                    ? "text-blue-900 bg-gray-100"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                {/* {activeTab === tab.toLowerCase().replace(" ", "-") && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                )} */}
              </button>
            ))}
          </div>

          <div className="px-6 py-6">
            <RevenueChart 
              data={currentData.data} 
              location={currentData.location} 
              value={currentData.value} 
              change={currentData.change} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;