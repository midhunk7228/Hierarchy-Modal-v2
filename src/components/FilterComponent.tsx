import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { AppliedFilter, FilterConfig } from "../DashbiardExampleProps";

const FilterComponent: React.FC<{
  filter: FilterConfig;
  value: AppliedFilter["value"];
  onChange: (value: AppliedFilter["value"]) => void;
}> = ({ filter, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderFilterInput = () => {
    switch (filter.type) {
      case "date-range":
        return (
          <div className="flex gap-2">
            <input
              type="date"
              value={
                typeof value === "object" && value !== null && "start" in value
                  ? (value as { start: string }).start
                  : ""
              }
              onChange={(e) => {
                const newDate = { start: e.target.value, end: "" };
                if (
                  typeof value === "object" &&
                  value !== null &&
                  "end" in value
                ) {
                  newDate.end = (value as { end: string }).end;
                }
                onChange(newDate);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-xs"
            />
            <span className="text-xs text-gray-500 self-center">to</span>
            <input
              type="date"
              value={
                typeof value === "object" && value !== null && "end" in value
                  ? (value as { end: string }).end
                  : ""
              }
              onChange={(e) => {
                const newDate = { start: "", end: e.target.value };
                if (
                  typeof value === "object" &&
                  value !== null &&
                  "start" in value
                ) {
                  newDate.start = (value as { start: string }).start;
                }
                onChange(newDate);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
        );

      case "single-date":
        return (
          <input
            type="date"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs w-full"
          />
        );

      case "select":
        return (
          <select
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs w-full"
          >
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "multi-select": {
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-2 py-1 border border-gray-300 rounded text-xs w-full text-left flex items-center justify-between"
            >
              <span>
                {selectedValues.length === 0
                  ? "Select options..."
                  : `${selectedValues.length} selected`}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded mt-1 max-h-32 overflow-y-auto">
                {filter.options?.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center px-2 py-1 hover:bg-gray-50 text-xs cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.value)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, option.value]
                          : selectedValues.filter((v) => v !== option.value);
                        onChange(newValues);
                      }}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      }

      case "text":
        return (
          <input
            type="text"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={filter.placeholder}
            className="px-2 py-1 border border-gray-300 rounded text-xs w-full"
          />
        );

      case "number-range":
        return (
          <div className="flex gap-2">
            <input
              type="number"
              value={
                typeof value === "object" && value !== null && "min" in value
                  ? (value as { min: number }).min
                  : ""
              }
              onChange={(e) => {
                const newRange = { min: Number(e.target.value), max: 0 };
                if (
                  typeof value === "object" &&
                  value !== null &&
                  "max" in value
                ) {
                  newRange.max = (value as { max: number }).max;
                }
                onChange(newRange);
              }}
              min={filter.min}
              max={filter.max}
              placeholder="Min"
              className="px-2 py-1 border border-gray-300 rounded text-xs flex-1"
            />
            <span className="text-xs text-gray-500 self-center">to</span>
            <input
              type="number"
              value={
                typeof value === "object" && value !== null && "max" in value
                  ? (value as { max: number }).max
                  : ""
              }
              onChange={(e) => {
                const newRange = { min: 0, max: Number(e.target.value) };
                if (
                  typeof value === "object" &&
                  value !== null &&
                  "min" in value
                ) {
                  newRange.min = (value as { min: number }).min;
                }
                onChange(newRange);
              }}
              min={filter.min}
              max={filter.max}
              placeholder="Max"
              className="px-2 py-1 border border-gray-300 rounded text-xs flex-1"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-2">
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {filter.label}
        {filter.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderFilterInput()}
    </div>
  );
};

export default FilterComponent;
