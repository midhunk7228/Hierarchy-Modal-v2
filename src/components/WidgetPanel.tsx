import React from "react";
import {
  BarChart,
  PieChart,
  Table,
  DollarSign,
  ChartBarBig,
  ChartColumnDecreasing,
} from "lucide-react";

const predefinedWidgets = [
  {
    id: "revenue-widget",
    title: "Total Revenue",
    icon: <DollarSign className="w-8 h-8 text-green-500" />,
    defaultLayout: { w: 3, h: 2, minW: 2, minH: 2 },
    displayType: "summary",
    viewType: "single-value",
    apiEndpoint: "/api/summary",
  },
  {
    id: "performance-chart-widget",
    title: "Performance Chart",
    icon: <BarChart className="w-8 h-8 text-blue-500" />,
    defaultLayout: { w: 4, h: 4, minW: 3, minH: 4 },
    // defaultLayout: { row: 0, col: 6, width: 3, height: 4 }
    displayType: "summary",
    viewType: "chart",
    apiEndpoint: "/api/performance",
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
    id: "distribution-widget",
    title: "Market Distribution",
    icon: <PieChart className="w-8 h-8 text-purple-500" />,
    defaultLayout: { w: 3, h: 4, minW: 3, minH: 3 },
    displayType: "summary",
    viewType: "pie-chart",
    apiEndpoint: "/api/distribution",
  },
  {
    id: "details-table-widget",
    title: "Detailed Analytics",
    icon: <Table className="w-8 h-8 text-indigo-500" />,
    defaultLayout: { w: 12, h: 4, minW: 6, minH: 3 },
    displayType: "details",
    viewType: "tabular",
    apiEndpoint: "/api/metrics",
  },
  {
    id: "bar-graph-widget",
    title: "Bar Graph",
    icon: <ChartBarBig className="w-8 h-8 text-blue-500" />,
    defaultLayout: { w: 10, h: 5, minW: 10, minH: 5 },
    displayType: "details",
    viewType: "bar-graph",
    apiEndpoint: "/api/metrics",
  },
  {
    id: "bar-graph-widget-two",
    title: "Revenue Graph",
    icon: <ChartColumnDecreasing className="w-8 h-8 text-blue-500" />,
    defaultLayout: { w: 6, h: 5, minW: 10, minH: 5 },
    displayType: "details",
    viewType: "bar-two",
    apiEndpoint: "/api/metrics",
  },
];

interface WidgetPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomWidget: () => void;
}

const WidgetPanel: React.FC<WidgetPanelProps> = ({
  isOpen,
  onClose,
  onAddCustomWidget,
}) => {
  if (!isOpen) {
    return null;
  }

  const onDragStart = (e: React.DragEvent, widgetId: string) => {
    e.dataTransfer.setData("text/plain", widgetId);
  };


  return (
    <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-40 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add a Widget</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      <div className="space-y-4">
        {predefinedWidgets.map((widget) => (
          <div
            key={widget.id}
            draggable
            onDragStart={(e) => onDragStart(e, widget.id)}
            onDragEnd={onClose}
            className="p-4 border border-gray-300 rounded-lg shadow-md cursor-grab flex items-center gap-4 hover:bg-gray-50"
          >
            <div className="flex">{widget.icon}</div>
            <div className="">
              <p className="font-medium">{widget.title}</p>
              <p className="text-sm text-gray-500">{widget.viewType}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          onClick={() => {
            onAddCustomWidget();
            onClose(); // Close the panel after triggering
          }}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Custom Widget
        </button>
      </div>
    </div>
  );
};

export default WidgetPanel;
