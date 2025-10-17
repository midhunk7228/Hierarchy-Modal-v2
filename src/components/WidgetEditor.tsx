import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { DashboardWidget, FilterConfig } from "../DashbiardExampleProps";

const WidgetEditor: React.FC<{
  widget: DashboardWidget | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (widget: DashboardWidget) => void;
}> = ({ widget, isOpen, onClose, onSave }) => {
  const [editWidget, setEditWidget] = useState<DashboardWidget | null>(widget);
  const [newFilter, setNewFilter] = useState<FilterConfig>({
    id: "",
    type: "select",
    label: "",
    field: "",
    required: false,
  });
  const [showAddFilter, setShowAddFilter] = useState(false);

  useEffect(() => {
    setEditWidget(widget);
  }, [widget]);

  if (!isOpen || !editWidget) return null;

  const handleSave = () => {
    if (editWidget) {
      onSave(editWidget);
      onClose();
    }
  };

  const addFilter = () => {
    if (!newFilter.id || !newFilter.label || !newFilter.field) return;

    const updatedWidget = {
      ...editWidget,
      filters: [
        ...(editWidget.filters || []),
        { ...newFilter, id: `filter-${Date.now()}` },
      ],
    };
    setEditWidget(updatedWidget);
    setNewFilter({
      id: "",
      type: "select",
      label: "",
      field: "",
      required: false,
    });
    setShowAddFilter(false);
  };

  const removeFilter = (filterId: string) => {
    const updatedWidget = {
      ...editWidget,
      filters: editWidget.filters?.filter((f) => f.id !== filterId) || [],
    };
    setEditWidget(updatedWidget);
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-lg">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Widget</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editWidget.title}
              onChange={(e) =>
                setEditWidget({ ...editWidget, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Endpoint
            </label>
            <input
              type="text"
              value={editWidget.apiEndpoint || ''}
              onChange={(e) =>
                setEditWidget({ ...editWidget, apiEndpoint: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Type
            </label>
            <select
              value={editWidget.displayType}
              onChange={(e) =>
                setEditWidget({
                  ...editWidget,
                  displayType: e.target.value as "summary" | "details",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">Summary</option>
              <option value="details">Details</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              View Type
            </label>
            <select
              value={editWidget.viewType}
              onChange={(e) =>
                setEditWidget({
                  ...editWidget,
                  viewType: e.target.value as DashboardWidget["viewType"],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tabular">Table</option>
              <option value="single-value">Single Value</option>
              <option value="pie-chart">Pie Chart</option>
              <option value="chart">Bar Chart</option>
              <option value="comparison">Comparison</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={editWidget.position.width}
                onChange={(e) =>
                  setEditWidget({
                    ...editWidget,
                    position: {
                      ...editWidget.position,
                      width: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={editWidget.position.height}
                onChange={(e) =>
                  setEditWidget({
                    ...editWidget,
                    position: {
                      ...editWidget.position,
                      height: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Endpoint (Optional)
            </label>
            <input
              type="text"
              value={editWidget.apiEndpoint || ""}
              onChange={(e) =>
                setEditWidget({
                  ...editWidget,
                  apiEndpoint: e.target.value || undefined,
                })
              }
              placeholder="https://api.example.com/data"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editWidget.additionalInfo?.outcome || false}
                onChange={(e) =>
                  setEditWidget({
                    ...editWidget,
                    additionalInfo: {
                      ...editWidget.additionalInfo,
                      outcome: e.target.checked,
                    },
                  })
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Show Outcome Indicators
              </span>
            </label>
          </div>

          {/* Filters Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Filters
              </label>
              <button
                onClick={() => setShowAddFilter(!showAddFilter)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-3 h-3 inline mr-1" />
                Add Filter
              </button>
            </div>

            {editWidget.filters && editWidget.filters.length > 0 && (
              <div className="space-y-2 mb-3">
                {editWidget.filters.map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium">
                        {filter.label}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({filter.type})
                      </span>
                    </div>
                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Filter Form */}
            {showAddFilter && (
              <div className="border border-gray-200 rounded p-3 bg-gray-50">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Filter Label"
                      value={newFilter.label}
                      onChange={(e) =>
                        setNewFilter({ ...newFilter, label: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Field Name"
                      value={newFilter.field}
                      onChange={(e) =>
                        setNewFilter({ ...newFilter, field: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <select
                    value={newFilter.type}
                    onChange={(e) =>
                      setNewFilter({
                        ...newFilter,
                        type: e.target.value as FilterConfig["type"],
                      })
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="select">Select</option>
                    <option value="multi-select">Multi Select</option>
                    <option value="text">Text</option>
                    <option value="date-range">Date Range</option>
                    <option value="single-date">Single Date</option>
                    <option value="number-range">Number Range</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addFilter}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddFilter(false)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default WidgetEditor;