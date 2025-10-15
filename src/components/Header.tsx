import { Plus, Settings } from "lucide-react";
import React, { useState } from "react";
import type {
  DashboardLayout,
  DashboardWidget,
} from "../DashbiardExampleProps";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import WidgetPanel from "./WidgetPanel";
import { toggleEditMode } from "../redux/editModeSlice";

const DEFAULT_DASHBOARD: DashboardLayout = {
  id: "default-dashboard",
  name: "Default Dashboard",
  description: "A comprehensive view of business metrics with filtering",
  logos: [
    "/Nike.png",
    "/McDonalds.png",
    "/Starbucks.png",
    "/pepsi.png",
    "/Intel.png",
    "/coca-cola.png",
    "/Netflix.png",
    "/pg.png",
    "/Mastercard.png",
    "/NVIDIA.png",
    "/Samsung.png",
    "/Nestle.png",
    "/Louis.png",
    "/Meta.png",
    "/Amazon.png",
    "/Chevron.png",
    "/Tesla.png",
  ],
  grid: {
    columns: 12,
    rows: 8,
    gap: 16,
  },
  widgets: [
    {
      id: "widget-1",
      title: "Total Revenue",
      displayType: "summary",
      viewType: "single-value",
      position: { row: 0, col: 0, width: 3, height: 2 },
      apiEndpoint: "/api/summary",
      filters: [
        {
          id: "revenue-date-range",
          type: "date-range",
          label: "Date Range",
          field: "date",
          defaultValue: { start: "2024-01-01", end: "2024-12-31" },
        },
      ],
      inVisibleFilters: [
        {
          id: "revenue-date-range",
          type: "date-range",
          label: "Date Range",
          field: "date",
          defaultValue: { start: "2024-01-01", end: "2024-12-31" },
        },
        {
          id: "search-filter",
          type: "text",
          label: "Search",
          field: "name",
          placeholder: "Search by name...",
        },
      ],
    },
    {
      id: "widget-2",
      title: "Regional Performance",
      displayType: "summary",
      viewType: "comparison",
      position: { row: 0, col: 3, width: 3, height: 4 },
      additionalInfo: { outcome: true },
      apiEndpoint: "/api/distribution",
      filters: [
        {
          id: "region-filter",
          type: "multi-select",
          label: "Regions",
          field: "name",
          options: [
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
            { label: "Poland", value: "Poland" },
          ],
        },
        {
          id: "outcome-filter",
          type: "select",
          label: "Outcome",
          field: "outcome",
          options: [
            { label: "All", value: "" },
            { label: "Positive", value: "positive" },
            { label: "Negative", value: "negative" },
          ],
        },
      ],
      inVisibleFilters: [
        {
          id: "search-filter",
          type: "text",
          label: "Search",
          field: "name",
          placeholder: "Search by name...",
        },
        {
          id: "region-filter",
          type: "multi-select",
          label: "Regions",
          field: "name",
          options: [
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
          ],
        },
        {
          id: "outcome-filter",
          type: "select",
          label: "Outcome",
          field: "outcome",
          options: [
            { label: "All", value: "" },
            { label: "Positive", value: "positive" },
            { label: "Negative", value: "negative" },
          ],
        },
      ],
    },
    {
      id: "widget-3",
      title: "Market Distribution",
      displayType: "summary",
      viewType: "pie-chart",
      position: { row: 0, col: 6, width: 3, height: 4 },
      apiEndpoint: "/api/performance",
      filters: [
        {
          id: "category-date",
          type: "single-date",
          label: "Date",
          field: "date",
          defaultValue: "2024-01-15",
        },
      ],
      inVisibleFilters: [
        {
          id: "category-date",
          type: "single-date",
          label: "Date",
          field: "date",
          defaultValue: "2024-01-15",
        },
      ],
    },
    {
      id: "widget-4",
      title: "Performance Chart",
      displayType: "summary",
      viewType: "chart",
      position: { row: 0, col: 9, width: 3, height: 4 },
      apiEndpoint: "/api/comparison",
      filters: [
        {
          id: "revenue-range",
          type: "number-range",
          label: "Revenue Range",
          field: "revenue",
          min: 0,
          max: 1000000,
          defaultValue: { min: 100000, max: 800000 },
        },
      ],
      inVisibleFilters: [
        {
          id: "revenue-range",
          type: "number-range",
          label: "Revenue Range",
          field: "revenue",
          min: 0,
          max: 1000000,
          defaultValue: { min: 100000, max: 800000 },
        },
      ],
    },
    {
      id: "widget-5",
      title: "Regional Metrics",
      displayType: "summary",
      viewType: "comparison",
      position: { row: 2, col: 0, width: 6, height: 2 },
      additionalInfo: { outcome: true },
      apiEndpoint: "/api/regions",
      filters: [
        {
          id: "search-filter",
          type: "text",
          label: "Search",
          field: "name",
          placeholder: "Search by name...",
        },
      ],
      inVisibleFilters: [
        {
          id: "search-filter",
          type: "text",
          label: "Search",
          field: "name",
          placeholder: "Search by name...",
        },
        {
          id: "region-filter",
          type: "multi-select",
          label: "Regions",
          field: "name",
          options: [
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
          ],
        },
        {
          id: "outcome-filter",
          type: "select",
          label: "Outcome",
          field: "outcome",
          options: [
            { label: "All", value: "" },
            { label: "Positive", value: "positive" },
            { label: "Negative", value: "negative" },
          ],
        },
      ],
    },
    {
      id: "widget-6",
      title: "Detailed Analytics",
      displayType: "details",
      viewType: "tabular",
      position: { row: 4, col: 0, width: 12, height: 4 },
      additionalInfo: { outcome: true },
      apiEndpoint: "/api/metrics",
      filters: [
        {
          id: "revenue-date-range",
          type: "date-range",
          label: "Date Range",
          field: "date",
        },
        {
          id: "region-filter",
          type: "multi-select",
          label: "Region",
          field: "region",
          options: [
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
          ],
        },
        {
          id: "details-category",
          type: "select",
          label: "Category",
          field: "category",
          options: [
            { label: "All Categories", value: "" },
            { label: "Electronics", value: "Electronics" },
            { label: "Fashion", value: "Fashion" },
          ],
        },
      ],
      inVisibleFilters: [
        {
          id: "revenue-date-range",
          type: "date-range",
          label: "Date Range",
          field: "date",
        },
        {
          id: "region-filter",
          type: "multi-select",
          label: "Region",
          field: "region",
          options: [
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
            { label: "Poland", value: "Poland" },
          ],
        },
        {
          id: "details-category",
          type: "select",
          label: "Category",
          field: "category",
          options: [
            { label: "All Categories", value: "" },
            { label: "Electronics", value: "Electronics" },
            { label: "Fashion", value: "Fashion" },
          ],
        },
        {
          id: "outcome-filter",
          type: "select",
          label: "Outcome",
          field: "outcome",
          options: [
            { label: "All", value: "" },
            { label: "Positive", value: "positive" },
            { label: "Negative", value: "negative" },
          ],
        },
      ],
    },
  ],
};

const Header: React.FC = () => {
  const dispatch = useDispatch();
  // const { currentNavigationPath } = useSelector(
  //   (state: RootState) => state.layout
  // );
  const { isEditMode } = useSelector((state: RootState) => state.editMode);
  const [currentDashboard] = useState<DashboardLayout>(DEFAULT_DASHBOARD);
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(false);
  const [, setEditingWidget] = useState<DashboardWidget | null>(null);
  const [, setIsWidgetEditorOpen] = useState(false);
  const [selectedLogoIndex, setSelectedLogoIndex] = useState<number>(1);

  const handleAddCustomWidget = () => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      title: "New Widget",
      displayType: "summary",
      viewType: "single-value",
      position: { row: 0, col: 0, width: 3, height: 2 },
      filters: [],
    };
    setEditingWidget(newWidget);
    setIsWidgetEditorOpen(true);
  };

  //   return (
  //     <div className="flex justify-between items-center bg-white px-6 py-4">
  //       {" "}
  //       <div className="space-y-1 ">
  //         <div className="flex items-center gap-3">
  //           {currentDashboard?.logos?.map((logo, index) => (
  //             <img
  //               key={index}
  //               src={logo}
  //               alt={`Logo ${index + 1}`}
  //               onClick={() => setSelectedLogoIndex(index)}
  //               className={`h-7 cursor-pointer transition-all ${
  //                 selectedLogoIndex === index ? "" : "grayscale hover:grayscale-0"
  //               }`}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //       <div className="flex gap-2">
  //         <button
  //           onClick={() => setIsWidgetPanelOpen(true)}
  //           // disabled={!isEditMode}
  //           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
  //         >
  //           <Plus className="w-4 h-4" />
  //           Add Widget
  //         </button>
  //         <button
  //           onClick={() => {
  //             dispatch(toggleEditMode());
  //           }}
  //           className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1 ${
  //             isEditMode
  //               ? "bg-red-600 text-white hover:bg-red-700"
  //               : "bg-blue-600 text-white hover:bg-blue-700"
  //           }`}
  //         >
  //           <Settings className="w-4 h-4" />
  //           {isEditMode ? "Exit Edit" : "Edit Mode"}
  //         </button>
  //       </div>
  //       <WidgetPanel
  //         isOpen={isWidgetPanelOpen}
  //         onClose={() => setIsWidgetPanelOpen(false)}
  //         onAddCustomWidget={handleAddCustomWidget}
  //       />
  //     </div>
  //   );
  // };
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white px-4 sm:px-6 py-3 sm:py-4 gap-3 lg:gap-0">
      {" "}
      <div className="space-y-1 w-full lg:w-auto relative">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max px-1">
            {currentDashboard?.logos?.slice(0, 6).map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt={`Logo ${index + 1}`}
                onClick={() => setSelectedLogoIndex(index)}
                className={`h-5 sm:h-6 md:h-7 cursor-pointer transition-all flex-shrink-0 ${
                  selectedLogoIndex === index
                    ? ""
                    : "grayscale hover:grayscale-0"
                }`}
              />
            ))}
            <div className="hidden xl:flex lg:flex md:flex items-center gap-2 sm:gap-3">
              {currentDashboard?.logos?.slice(6).map((logo, index) => (
                <img
                  key={index + 6}
                  src={logo}
                  alt={`Logo ${index + 7}`}
                  onClick={() => setSelectedLogoIndex(index + 6)}
                  className={`h-5 sm:h-6 md:h-7 cursor-pointer transition-all flex-shrink-0 ${
                    selectedLogoIndex === index + 6
                      ? ""
                      : "grayscale hover:grayscale-0"
                  }`}
                />
              ))}
            </div>
            {currentDashboard?.logos && currentDashboard.logos.length > 6 && (
              <div className="md:hidden flex items-center justify-center h-5 sm:h-6 px-2 bg-gray-100 rounded text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">
                +{currentDashboard.logos.length - 6}
              </div>
            )}
          </div>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none lg:hidden"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none lg:hidden"></div>
      </div>
      <div className="flex gap-2 w-full xl:w-auto">
        <button
          onClick={() => setIsWidgetPanelOpen(true)}
          // disabled={!isEditMode}
          className="flex-1 lg:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Widget</span>
          <span className="sm:hidden">Add</span>
        </button>
        <button
          onClick={() => {
            dispatch(toggleEditMode());
          }}
          className={`flex-1 lg:flex-none px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-1 text-sm sm:text-base ${
            isEditMode
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">
            {isEditMode ? "Exit Edit" : "Edit Mode"}
          </span>
          <span className="sm:hidden">{isEditMode ? "Exit" : "Edit"}</span>
        </button>
      </div>
      <WidgetPanel
        isOpen={isWidgetPanelOpen}
        onClose={() => setIsWidgetPanelOpen(false)}
        onAddCustomWidget={handleAddCustomWidget}
      />
    </div>
  );
};

export default Header;
