import { useState, useEffect } from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import type {
  DateRangeSelection,
  SavedDateRange,
} from "../../../types/dateRange";
import { getPresets } from "../../../utils/dateRange";
import { useIndexedDB } from "../../../helper/useIndexedDB";

interface PresetSidebarProps {
  onPresetSelect: (startDate: string, endDate: string) => void;
  onSavedDateSelect?: (selection: DateRangeSelection) => void;
  currentSelection: DateRangeSelection;
}

const SAVED_DATES_KEY = "savedDateRanges";

export default function PresetSidebar({
  onPresetSelect,
  onSavedDateSelect,
  currentSelection,
}: PresetSidebarProps) {
  const { saveData, getData } = useIndexedDB();
  const [savedDates, setSavedDates] = useState<SavedDateRange[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  // Load saved dates from IndexedDB
  useEffect(() => {
    const loadSavedDates = async () => {
      const data = await getData<SavedDateRange[]>(SAVED_DATES_KEY);
      if (data) {
        setSavedDates(data);
      }
    };
    loadSavedDates();
  }, [getData]);

  const presets = getPresets();

  const handlePresetClick = (
    getValue: () => { startDateUtc: string; endDateUtc: string }
  ) => {
    const { startDateUtc, endDateUtc } = getValue();
    onPresetSelect(startDateUtc, endDateUtc);
  };

  const handleSaveDateRange = async () => {
    if (newLabel.trim() === "") {
      alert("Please enter a label for the saved date range");
      return;
    }

    const newSavedDate: SavedDateRange = {
      id: `saved-${Date.now()}`,
      label: newLabel.trim(),
      selection: currentSelection,
      createdAt: Date.now(),
    };

    const updatedSavedDates = [...savedDates, newSavedDate];
    setSavedDates(updatedSavedDates);
    await saveData(SAVED_DATES_KEY, updatedSavedDates);

    setNewLabel("");
    setShowSaveModal(false);
  };

  const handleDeleteSavedDate = async (id: string) => {
    const updatedSavedDates = savedDates.filter((d) => d.id !== id);
    setSavedDates(updatedSavedDates);
    await saveData(SAVED_DATES_KEY, updatedSavedDates);
  };

  const handleLoadSavedDate = (saved: SavedDateRange) => {
    // If there's a handler for full saved date selection, use it
    if (onSavedDateSelect) {
      onSavedDateSelect(saved.selection);
    } else {
      // Fallback to just setting the date range
      onPresetSelect(saved.selection.startDateUtc, saved.selection.endDateUtc);
    }
  };

  const formatDateRange = (start: string, end: string) => {
    // Format dates as "MMM DD, YYYY"
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr + "T00:00:00");
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    if (start === end) {
      return formatDate(start);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 py-4 flex flex-col ">
      {/* Default Presets */}
      <div className="mb-3 px-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-600 uppercase">
            Quick Select
          </h3>
        </div>
        <div className="space-y-1">
          {Object.values(presets).map((preset) => {
            const { startDateUtc, endDateUtc } = preset.getValue();
            return (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset.getValue)}
                className="w-full text-left px-3 py-2 hover:bg-white hover:shadow-sm rounded-md transition-all"
              >
                <div className="text-sm font-semibold text-gray-900">
                  {preset.label}
                </div>
                <div className="text-xs text-gray-600 leading-relaxed mt-0.5">
                  {formatDateRange(startDateUtc, endDateUtc)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Saved Dates Section */}
      <div className="flex flex-col flex-1 min-h-0 border-t border-gray-200 px-4">
        <div className="flex items-center justify-between mb-2 flex-shrink-0 mt-3">
          <div className="flex items-center gap-1">
            <h3 className="text-xs font-semibold text-gray-600 uppercase">
              Saved Dates
            </h3>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
        </div>

        {showHelp && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 flex-shrink-0">
            Save your frequently used date ranges for quick access later.
          </div>
        )}

        {savedDates.length === 0 ? (
          <p className="text-xs text-gray-500 mb-3 italic flex-shrink-0">
            No saved dates yet
          </p>
        ) : (
          <div className="space-y-2 mb-3 overflow-y-auto flex-1 min-h-0">
            {savedDates.map((saved) => (
              <div
                key={saved.id}
                className="group bg-white rounded-md hover:shadow-sm transition-all border border-gray-200"
              >
                <div className="flex items-start justify-between px-3 py-2">
                  <button
                    onClick={() => handleLoadSavedDate(saved)}
                    className="flex-1 text-left"
                  >
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {saved.label}
                    </div>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {formatDateRange(
                        saved.selection.startDateUtc,
                        saved.selection.endDateUtc
                      )}
                    </div>
                    {saved.selection.excludedWeekdays.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Excluded:{" "}
                        {saved.selection.excludedWeekdays
                          .map(
                            (d) =>
                              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                                d
                              ]
                          )
                          .join(", ")}
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteSavedDate(saved.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowSaveModal(true)}
          className="w-full flex-shrink-0 px-3 py-2 text-[#003DB8] opacity-50 hover:opacity-100 text-sm font-medium rounded-mdtransition-colors flex items-center justify-center gap-2 mt-auto"
        >
          <Plus className="w-4 h-4" />
          Save selected date
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => setShowSaveModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-lg shadow-xl p-5 w-80 border border-gray-200 pointer-events-auto">
              <h3 className="text-base font-semibold mb-3 text-gray-800">
                Save Date Range
              </h3>
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g., Q1 2025, Holiday Period"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveDateRange();
                    }
                  }}
                />
              </div>
              <div className="mb-4 p-2 bg-gray-50 rounded text-xs text-gray-600">
                <div>
                  <strong>Range:</strong>{" "}
                  {formatDateRange(
                    currentSelection.startDateUtc,
                    currentSelection.endDateUtc
                  )}
                </div>
                <div>
                  <strong>Duration:</strong> {currentSelection.duration}{" "}
                  {currentSelection.unit}(s)
                </div>
                {currentSelection.excludedWeekdays.length > 0 && (
                  <div>
                    <strong>Excluded:</strong>{" "}
                    {currentSelection.excludedWeekdays
                      .map(
                        (d) =>
                          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]
                      )
                      .join(", ")}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDateRange}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
