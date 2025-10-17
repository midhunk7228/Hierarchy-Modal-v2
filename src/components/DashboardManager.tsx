import {
  Download,
  Upload,
  RotateCcw,
  Bell,
  Plus,
  Settings,
  Pencil,
  Coins,
  Ellipsis,
  Calendar,
} from "lucide-react";
import Select from "react-select";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type {
  DashboardLayout,
  DashboardWidget,
} from "../DashbiardExampleProps";
import { useIndexedDB } from "../helper/useIndexedDB";
import { setDashboards } from "../redux/dashboardsSlice";
import { mergeDashboard } from "../helper";
import { dashboardStorage } from "../utils/dashboardStorage";
import { toggleEditMode } from "../redux/editModeSlice";
import WidgetPanel from "./WidgetPanel";

const DateRangeFilter: React.FC<{
  onDateChange: (startDate: string, endDate: string) => void;
  startDate?: string;
  endDate?: string;
}> = ({ onDateChange, startDate = "", endDate = "" }) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  const handleStartDateChange = (date: string) => {
    setLocalStartDate(date);
    onDateChange(date, localEndDate);
  };

  const handleEndDateChange = (date: string) => {
    setLocalEndDate(date);
    onDateChange(localStartDate, date);
  };

  return (
    <div className="flex items-center space-x-2 bg-slate-100 rounded-md p-2">
      <Calendar className="w-4 h-4 text-slate-500" />
      <input
        type="date"
        value={localStartDate}
        onChange={(e) => handleStartDateChange(e.target.value)}
        className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none w-32"
        placeholder="Start Date"
      />
      <span className="text-slate-400">-</span>
      <input
        type="date"
        value={localEndDate}
        onChange={(e) => handleEndDateChange(e.target.value)}
        className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none w-32"
        placeholder="End Date"
      />
    </div>
  );
};

const DashboardManager: React.FC<{
  currentDashboard: DashboardLayout;
  onLoadDashboard: (config: string) => void;
  onSelectDashboard: (id: string) => void;
  onCreateDashboard: (id: string) => void;
  currentNavigationPath: string;
  onClearLayout: () => void;
  selectedDashboard: string;
  onAddCustomWidget: () => void;
}> = ({
  currentDashboard,
  onLoadDashboard,
  onSelectDashboard,
  onCreateDashboard,
  currentNavigationPath,
  onClearLayout,
  selectedDashboard,
  onAddCustomWidget,
}) => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configText, setConfigText] = useState("");
  const { unreadCount } = useSelector(
    (state: RootState) => state.notifications
  );
  const dispatch = useDispatch();
  const dashboards = useSelector(
    (state: RootState) => state.dashboards.dashboards
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");

  const { isEditMode } = useSelector((state: RootState) => state.editMode);
  const [, setEditingWidget] = useState<DashboardWidget | null>(null);
  const [, setIsWidgetEditorOpen] = useState(false);
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(false);
  const [isOptionsPopupOpen, setIsOptionsPopupOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-03-01",
    endDate: "2025-03-31",
  });
  const [comparisonDate] = useState("Feb, 2025");
  const [openDatePopup, setOpenDatePopup] = useState<number | null>(null);

  const dashboardOptions = [
    ...dashboards.map((dashboard) => ({
      value: dashboard.id,
      label: dashboard.name,
    })),
    { value: "create-new", label: "+ Create New" },
  ];

  const { saveData, getData } = useIndexedDB();

  useEffect(() => {
    const loadDashboards = async () => {
      const savedDashboards = (await getData(
        "dashboards"
      )) as DashboardLayout[];
      console.log("selectedDashboard", selectedDashboard);
      const savedLayout = await dashboardStorage.getDashboard(
        `${selectedDashboard}:${currentNavigationPath}`
      );
      if (savedLayout) {
        const newDashboards = savedDashboards?.map((val) => {
          if (val.id === savedLayout.id) {
            return savedLayout;
          }
          return val;
        });
        if (newDashboards && newDashboards.length > 0) {
          dispatch(setDashboards(newDashboards));
        } else {
          await saveData("dashboards", [currentDashboard]);
          dispatch(setDashboards([currentDashboard]));
        }
        return;
      }
      if (savedDashboards && savedDashboards.length > 0) {
        dispatch(
          setDashboards(mergeDashboard(savedDashboards, currentDashboard))
        );
      } else {
        await saveData("dashboards", [currentDashboard]);
        dispatch(setDashboards([currentDashboard]));
      }
    };
    loadDashboards();
  }, [currentNavigationPath, currentDashboard]);
  console.log("setDashboards", dashboards);
  const handleCreateNewDashboard = async () => {
    if (newDashboardName.trim() === "") {
      alert("Dashboard name cannot be empty");
      return;
    }
    const newDashboard: DashboardLayout = {
      id: `dashboard-${newDashboardName.replace(/\s+/g, "")}`,
      name: newDashboardName,
      description: "New custom dashboard",
      grid: { columns: 12, rows: 8, gap: 16 },
      widgets: [],
    };
    const newDashboards = [...dashboards, newDashboard];
    dispatch(setDashboards(newDashboards));
    await saveData("dashboards", newDashboards);

    onCreateDashboard(newDashboard.id);
    onLoadDashboard(JSON.stringify(newDashboard));

    setIsCreateModalOpen(false);
    setNewDashboardName("");
  };

  const handleDashboardChange = async (selectedOption: any) => {
    const value = selectedOption?.value;
    if (!value) return;

    if (value === "create-new") {
      setIsCreateModalOpen(true);
    } else {
      const savedLayout = await dashboardStorage.getDashboard(
        `${value}:${currentNavigationPath}`
      );
      if (savedLayout) {
        const newDashboards = dashboards.map((val) => {
          if (val.id === savedLayout.id) {
            return savedLayout;
          }
          return val;
        });
        const selected = newDashboards.find((d) => d.id === value);
        if (selected) {
          onSelectDashboard(value);
          onLoadDashboard(JSON.stringify(selected));
        }
        return;
      }
      const defaultLayout = await dashboardStorage.getDashboard(
        `${value}:default`
      );
      if (defaultLayout) {
        onSelectDashboard(value);
        onLoadDashboard(JSON.stringify(defaultLayout));
      }
    }
  };

  const exportConfig = () => {
    const config = JSON.stringify(currentDashboard, null, 2);
    setConfigText(config);
    setIsConfigModalOpen(true);
  };

  const importConfig = async () => {
    try {
      const newDashboard: DashboardLayout = JSON.parse(configText);
      const newDashboards = [...dashboards, newDashboard];
      dispatch(setDashboards(newDashboards));
      await saveData("dashboards", newDashboards);

      onSelectDashboard(newDashboard.id);
      onLoadDashboard(configText);

      setIsCreateModalOpen(false);
      setConfigText("");
    } catch {
      alert("Invalid JSON configuration");
    }
  };

  const downloadConfig = () => {
    const config = JSON.stringify(currentDashboard, null, 2);
    const blob = new Blob([config], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentDashboard.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
    setIsWidgetPanelOpen(false); // Close the panel when opening the editor
  };

  // Custom styles for react-select
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: "#e5e7eb",
      borderRadius: "0.5rem",
      padding: "0.125rem",
      minHeight: "auto",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#e5e7eb",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: "0.875rem",
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:active": {
        backgroundColor: "#3b82f6",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#374151",
      fontSize: "0.875rem",
      fontWeight: "500",
    }),
  };

  console.log("dashboardsNew", dashboards);
  return (
    <>
    <div className="flex flex-col items-end gap-4">
      <div className="flex gap-2 ">
        <div style={{ minWidth: "200px" }}>
          <Select
            value={dashboardOptions.find(
              (option) => option.value === selectedDashboard
            )}
            onChange={handleDashboardChange}
            options={dashboardOptions}
            styles={customStyles}
            isSearchable={false}
          />
        </div>
        {/* <button
          onClick={exportConfig}
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
          title="Export Configuration"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={downloadConfig}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
          title="Download Configuration"
        >
          <Download className="w-4 h-4" />
          JSON
        </button>

        <button
          onClick={() => {
            setConfigText("");
            setIsConfigModalOpen(true);
          }}
          className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
          title="Import Configuration"
        >
          <Upload className="w-4 h-4" />
        </button>

        <button
          onClick={onClearLayout}
          className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center gap-1"
          title="Reset Layout for Current Path"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-1 relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button> */}
        {/* <div className="flex gap-2 w-full xl:w-auto">
          <button
            onClick={() => setIsWidgetPanelOpen(true)}
            // disabled={!isEditMode}
            className="flex-1 lg:flex-none px-3 sm:px-4 py-2 bg-[#73bda5] hover:bg-[#4f967f] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 text-sm sm:text-base cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Widget</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={() => {
              dispatch(toggleEditMode());
            }}
            className={`flex-1 lg:flex-none px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-1 text-sm sm:text-base cursor-pointer ${
              isEditMode
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-[#7d85df] hover:bg-[#626ac2] text-white "
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isEditMode ? "Exit Edit" : "Edit Mode"}
            </span>
            <span className="sm:hidden">{isEditMode ? "Exit" : "Edit"}</span>
          </button>
        </div> */}
        <div className="relative">
          <button
            onClick={() => setIsOptionsPopupOpen(!isOptionsPopupOpen)}
            className="px-3 sm:px-4 py-3 bg-gray-50 text-gray-700 cursor-pointer rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1 border border-gray-200"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {isOptionsPopupOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-3 min-w-48">
              {/* <div className="flex justify-end items-center mb-3">
                <button
                  onClick={() => setIsOptionsPopupOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div> */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsWidgetPanelOpen(true);
                    setIsOptionsPopupOpen(false);
                  }}
                  className="w-full px-3 py-2 bg-green-700 hover:bg-[#4f967f] cursor-pointer text-white rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Widget</span>
                </button>
                <button
                  onClick={() => {
                    dispatch(toggleEditMode());
                    setIsOptionsPopupOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm ${
                    isEditMode
                      ? "bg-red-700 text-white hover:bg-red-900"
                      : "bg-blue-700 hover:bg-[#626ac2] text-white"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>{isEditMode ? "Exit Edit Mode" : "Edit Mode"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <WidgetPanel
          isOpen={isWidgetPanelOpen}
          onClose={() => setIsWidgetPanelOpen(false)}
          onAddCustomWidget={onAddCustomWidget}
        />
      </div>

      <div className="flex items-center gap-3 ">
        <div className="relative">
          <button
            onClick={() => setOpenDatePopup(openDatePopup === 0 ? null : 0)}
            className="flex items-center gap-2 px-2 py-1 bg-white  text-gray-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Ellipsis className="w-6 h-6 cursor-pointer" />
            {/* <span className="font-medium">
                    {formatDateRangeForDisplay(
                      dateRange.startDate,
                      dateRange.endDate
                    )}
                  </span> */}
          </button>
          {openDatePopup === 0 && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 w-80">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800">
                  Select Date Range
                </h4>
                <button
                  onClick={() => setOpenDatePopup(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <DateRangeFilter
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDateChange={(startDate, endDate) =>
                  setDateRange({ startDate, endDate })
                }
              />
              <div className="mt-2 flex justify-end">
                <button className=" px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Comparison:</span>
          <span className="font-medium">{comparisonDate}</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Coins className="w-4 h-4" />
          <span className="font-medium">Thousands</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
          <span>+</span>
          <span>Filter</span>
        </button>
      </div>
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-96 border border-gray-200">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Create New Dashboard
            </h3>
            <input
              type="text"
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
              placeholder="Enter dashboard name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewDashboard}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      {/* Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold mb-4">
              Dashboard Configuration
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Current Navigation Path:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {currentNavigationPath.replace("->", " → ")}
              </code>
            </p>

            <textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              placeholder="Paste your dashboard configuration JSON here..."
              className="flex-1 p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ minHeight: "400px" }}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsConfigModalOpen(false);
                  setConfigText("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {configText && (
                <button
                  onClick={importConfig}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Import
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardManager;
