import { Grid, Plus, Settings } from "lucide-react";
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
  const { currentNavigationPath } = useSelector(
    (state: RootState) => state.layout
  );
  const { isEditMode } = useSelector((state: RootState) => state.editMode);
  const [currentDashboard, setCurrentDashboard] =
    useState<DashboardLayout>(DEFAULT_DASHBOARD);
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(
    null
  );
  const [isWidgetEditorOpen, setIsWidgetEditorOpen] = useState(false);

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

  return (
    <div className="flex justify-between items-center bg-white px-6 py-4">
      {" "}
      <div className="space-y-1 ">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Grid className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {currentDashboard.description}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsWidgetPanelOpen(true)}
          // disabled={!isEditMode}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Widget
        </button>
        <button
          onClick={() => {
            dispatch(toggleEditMode());
          }}
          className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1 ${
            isEditMode
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Settings className="w-4 h-4" />
          {isEditMode ? "Exit Edit" : "Edit Mode"}
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
