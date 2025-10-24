import { useState } from "react";
import { Ellipsis, UserCircle, Plus, Settings, Check } from "lucide-react";
import MultiSelectDropdown from "../UI/MultiSelectDropdown";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  setSelectedBrand,
  setSelectedSubBrands,
} from "../../redux/brandSelectionSlice";
import { toggleEditMode } from "../../redux/editModeSlice";
import {
  addDashboard,
  setSelectedDashboardId,
} from "../../redux/dashboardsSlice";
import type { DashboardLayout } from "../../DashbiardExampleProps";
import { useIndexedDB } from "../../helper/useIndexedDB";
import { dashboardStorage } from "../../utils/dashboardStorage";
import { setCurrentNavigationPath } from "../../redux/layoutSlice";
import WidgetPanel from "../WidgetPanel";
export default function TopRightActions({
  isExpanded,
}: {
  isExpanded: boolean;
}) {
  const dispatch: AppDispatch = useDispatch();

  const {
    selectedSubBrands,
    selectedAllBrandWiseOutlets,
    selectedBrand,
    multiSelectedBrands,
    allBrands,
  } = useSelector((state: RootState) => state.brandSelection);

  const dashboards = useSelector(
    (state: RootState) => state.dashboards.dashboards
  );
  const selectedDashboardId =
    useSelector((state: RootState) => state.dashboards.selectedDashboardId) ||
    "default-dashboard";
  const { isEditMode } = useSelector((state: RootState) => state.editMode);
  const currentNavigationPath = useSelector(
    (state: RootState) => state.layout.currentNavigationPath
  );

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");

  const { saveData } = useIndexedDB();

  console.log(
    "selectedSubBrands",
    selectedSubBrands,
    selectedAllBrandWiseOutlets,
    selectedBrand,
    multiSelectedBrands
  );
  const handleOutletSelect = (outletName: string | string[]) => {
    const outletArray = Array.isArray(outletName) ? outletName : [outletName];
    dispatch(setSelectedSubBrands(outletArray));
  };

  const handleBrandSelect = (newSelectionData: string[]) => {
    const newSelection =
      multiSelectedBrands?.length === 0 && newSelectionData.includes("All")
        ? newSelectionData.filter((item) => item !== "All")
        : newSelectionData;
    console.log("multiSelectedBrands", selectedAllBrandWiseOutlets);
    if (newSelection.includes("All")) {
      const initailOutlets = allBrands
        .filter((brand) => brand.name !== "All")
        .flatMap((outs) => outs.outlets || [])
        .flatMap((outlets) => outlets.name);

      const initailBrandWiseOutlets = allBrands
        .filter((brand) => brand.name !== "All")
        .map((brand) => ({
          brandName: brand.name,
          outlets: (brand.outlets || []).map((outlet) => outlet.name),
        }));
      dispatch(
        setSelectedBrand({
          brandName: "All",
          outlets: initailOutlets,
          selectedAllBrandWiseOutlets: initailBrandWiseOutlets,
          multiSelectedBrands: [],
        })
      );
      return;
    }
    const selectedOutlets = newSelection?.map((out) => {
      const isExist = allBrands.find((aa) => aa.name === out);
      if (isExist) {
        return (isExist.outlets || []).flatMap((a) => a.name);
      }
      return [];
    });
    const selectedOutletsBrandWise = newSelection?.map((out) => {
      const isExist = allBrands.find((aa) => aa.name === out);
      if (isExist) {
        return {
          brandName: out,
          outlets: (isExist.outlets || []).flatMap((a) => a.name),
        };
      }
    });
    dispatch(
      setSelectedBrand({
        brandName: ["All"],
        outlets: selectedOutlets.flatMap((aa) => aa || []),
        selectedAllBrandWiseOutlets: selectedOutletsBrandWise.filter(
          Boolean
        ) as { brandName: string; outlets: string[] }[],
        multiSelectedBrands: newSelection,
      })
    );
  };

  // Dashboard management functions
  const handleCreateNewDashboard = async () => {
    if (newDashboardName.trim() === "") {
      alert("Dashboard name cannot be empty");
      return;
    }

    const newDashboardId = `dashboard-${newDashboardName.replace(/\s+/g, "")}`;
    const newDashboard: DashboardLayout = {
      id: newDashboardId,
      name: newDashboardName,
      description: "New custom dashboard",
      grid: { columns: 12, rows: 8, gap: 16 },
      widgets: [],
    };

    // Add dashboard to Redux
    dispatch(addDashboard(newDashboard));

    // Save to IndexedDB
    const newDashboards = [...dashboards, newDashboard];
    await saveData("dashboards", newDashboards);

    // Save empty dashboard to storage
    await dashboardStorage.saveDashboard(
      `${newDashboardId}:${currentNavigationPath}`,
      newDashboard
    );

    // Select the new dashboard
    dispatch(setSelectedDashboardId(newDashboardId));
    await saveData("selectedDashboard", newDashboardId);
    dispatch(setCurrentNavigationPath(currentNavigationPath));

    setIsCreateModalOpen(false);
    setNewDashboardName("");
  };

  const handleDashboardSelect = async (dashboardId: string) => {
    // Update Redux state
    dispatch(setSelectedDashboardId(dashboardId));

    // Save to IndexedDB
    await saveData("selectedDashboard", dashboardId);

    // Trigger navigation path update to reload dashboard
    dispatch(setCurrentNavigationPath(currentNavigationPath));
  };

  return (
    <>
      <div className="relative flex items-center gap-3 self-end md:self-center">
        <MultiSelectDropdown
          // To use for outlets, pass outletOptions and manage outlet selection state
          options={
            isExpanded
              ? selectedAllBrandWiseOutlets
                  ?.flatMap((out) => out.outlets)
                  .map((out) => {
                    return { label: out, value: out };
                  })
              : allBrands.map((brand) => {
                  return {
                    value: brand.name,
                    label: brand.name,
                    image: brand.logo,
                  };
                })
          }
          selected={
            isExpanded
              ? selectedSubBrands
              : multiSelectedBrands?.length === 0
              ? ["All"]
              : multiSelectedBrands
          }
          onChange={(kk) => {
            if (!isExpanded) {
              handleBrandSelect(kk);
            } else {
              handleOutletSelect(kk);
            }
          }}
          title={isExpanded ? "Outlets" : "Brands"}
          trigger={
            <button className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Ellipsis className="h-5 w-5" />
            </button>
          }
        />

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <UserCircle className="h-5 w-5" />
          </button>

          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-64 max-w-xs overflow-hidden">
                <div className="p-3">
                  {/* Dashboard Flat Picker */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Dashboards
                    </label>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {dashboards.map((dashboard) => (
                        <button
                          key={dashboard.id}
                          onClick={() => handleDashboardSelect(dashboard.id)}
                          className={`w-full px-3 py-2 rounded-md text-left text-xs font-medium transition-all flex items-center justify-between ${
                            selectedDashboardId === dashboard.id
                              ? "bg-gray-800 text-white"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="truncate">{dashboard.name}</span>
                          {selectedDashboardId === dashboard.id && (
                            <Check className="w-3.5 h-3.5 ml-2 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full px-3 py-2 rounded-md text-left text-xs font-medium transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create New Dashboard</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsWidgetPanelOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center gap-1.5 text-xs font-medium transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Widget</span>
                    </button>
                    <button
                      onClick={() => {
                        dispatch(toggleEditMode());
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 text-xs font-medium transition-colors ${
                        isEditMode
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>{isEditMode ? "Exit Edit Mode" : "Edit Mode"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Dashboard Modal */}
      {isCreateModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-md shadow-xl p-5 w-80 border border-gray-200 pointer-events-auto">
              <h3 className="text-base font-semibold mb-3 text-gray-800">
                Create New Dashboard
              </h3>
              <input
                type="text"
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                placeholder="Enter dashboard name"
                className="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewDashboard}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-medium transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Widget Panel */}
      <WidgetPanel
        isOpen={isWidgetPanelOpen}
        onClose={() => setIsWidgetPanelOpen(false)}
        onAddCustomWidget={() => {
          console.log("Add custom widget");
        }}
      />
    </>
  );
}
