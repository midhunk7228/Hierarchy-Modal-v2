import { Plus, Settings, Pencil } from "lucide-react";
import Select from "react-select";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { DashboardLayout } from "../DashbiardExampleProps";
import { useIndexedDB } from "../helper/useIndexedDB";
import { setDashboards } from "../redux/dashboardsSlice";
import { mergeDashboard } from "../helper";
import { dashboardStorage } from "../utils/dashboardStorage";
import { toggleEditMode } from "../redux/editModeSlice";
import WidgetPanel from "./WidgetPanel";

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
  selectedDashboard,
  onAddCustomWidget,
}) => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configText, setConfigText] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(false);
  const [isOptionsPopupOpen, setIsOptionsPopupOpen] = useState(false);

  const dispatch = useDispatch();
  const dashboards = useSelector(
    (state: RootState) => state.dashboards.dashboards
  );
  const { isEditMode } = useSelector((state: RootState) => state.editMode);
  const { saveData, getData } = useIndexedDB();

  const dashboardOptions = [
    ...dashboards.map((dashboard) => ({
      value: dashboard.id,
      label: dashboard.name,
    })),
    { value: "create-new", label: "+ Create New" },
  ];

  useEffect(() => {
    const loadDashboards = async () => {
      const savedDashboards = (await getData(
        "dashboards"
      )) as DashboardLayout[];
      const savedLayout = await dashboardStorage.getDashboard(
        `${selectedDashboard}:${currentNavigationPath}`
      );

      if (savedLayout) {
        const newDashboards = savedDashboards?.map((val) =>
          val.id === savedLayout.id ? savedLayout : val
        );
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
        const newDashboards = dashboards.map((val) =>
          val.id === savedLayout.id ? savedLayout : val
        );
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

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: "#e5e7eb",
      borderRadius: "0.375rem",
      padding: "0",
      minHeight: "32px",
      height: "32px",
      fontSize: "0.75rem",
      fontWeight: "500",
      color: "#374151",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#d1d5db",
        backgroundColor: "#f9fafb",
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0 8px",
      height: "30px",
    }),
    input: (provided: any) => ({
      ...provided,
      margin: "0",
      padding: "0",
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: "30px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: "4px",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "0.375rem",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: "0.75rem",
      padding: "0.5rem 0.75rem",
      backgroundColor: state.isSelected
        ? "#374151"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:active": {
        backgroundColor: "#374151",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#374151",
      fontSize: "0.75rem",
      fontWeight: "500",
    }),
  };

  return (
    <>
      <div className="flex flex-col items-end gap-4">
        <div className="flex gap-2 px-4">
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

          <div className="relative">
            <button
              onClick={() => setIsOptionsPopupOpen(!isOptionsPopupOpen)}
              className="px-3 py-1 bg-white text-gray-700 rounded border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {isOptionsPopupOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOptionsPopupOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg z-20 p-2 min-w-48">
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsWidgetPanelOpen(true);
                        setIsOptionsPopupOpen(false);
                      }}
                      className="w-full px-3 py-2 bg-green-700 hover:bg-green-800 text-white rounded flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Widget</span>
                    </button>
                    <button
                      onClick={() => {
                        dispatch(toggleEditMode());
                        setIsOptionsPopupOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded flex items-center justify-center gap-2 text-sm font-medium ${
                        isEditMode
                          ? "bg-red-700 text-white hover:bg-red-800"
                          : "bg-blue-700 hover:bg-blue-800 text-white"
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>{isEditMode ? "Exit Edit Mode" : "Edit Mode"}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <WidgetPanel
            isOpen={isWidgetPanelOpen}
            onClose={() => setIsWidgetPanelOpen(false)}
            onAddCustomWidget={onAddCustomWidget}
          />
        </div>

        {isCreateModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsCreateModalOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-white rounded shadow-xl p-6 w-96 border border-gray-200 pointer-events-auto">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Create New Dashboard
                </h3>
                <input
                  type="text"
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  placeholder="Enter dashboard name"
                  className="w-full px-3 py-2 border border-gray-200 rounded mb-4 focus:outline-none focus:border-gray-300 text-sm"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-200 rounded hover:bg-gray-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNewDashboard}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {isConfigModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => {
              setIsConfigModalOpen(false);
              setConfigText("");
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded shadow-xl p-6 w-[600px] max-h-[80vh] overflow-hidden flex flex-col border border-gray-200 pointer-events-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
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
                className="flex-1 p-3 border border-gray-200 rounded font-mono text-sm resize-none focus:outline-none focus:border-gray-300"
                style={{ minHeight: "400px" }}
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setIsConfigModalOpen(false);
                    setConfigText("");
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>
                {configText && (
                  <button
                    onClick={importConfig}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                  >
                    Import
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardManager;
