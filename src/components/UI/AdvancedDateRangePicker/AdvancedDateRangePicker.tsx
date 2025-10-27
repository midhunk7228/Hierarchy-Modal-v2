import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
  DateRangeSelection,
  DateRangeUnit,
} from "../../../types/dateRange";
import {
  parseUtc,
  formatUtc,
  getTodayUtc,
  calcEndFromDuration,
  calcDurationFromRange,
  enumerateIncludedDates,
  createSelection,
} from "../../../utils/dateRange";
import PresetSidebar from "./PresetSidebar";

interface AdvancedDateRangePickerProps {
  initialSelection?: Partial<DateRangeSelection>;
  onApply: (selection: DateRangeSelection) => void;
  onCancel: () => void;
}

const WEEKDAY_LABELS = [
  { value: 0, label: "Su" },
  { value: 1, label: "Mo" },
  { value: 2, label: "Tu" },
  { value: 3, label: "We" },
  { value: 4, label: "Th" },
  { value: 5, label: "Fr" },
  { value: 6, label: "Sa" },
];

export default function AdvancedDateRangePicker({
  initialSelection,
  onApply,
  onCancel,
}: AdvancedDateRangePickerProps) {
  const today = getTodayUtc();

  // Initialize state
  const [unit, setUnit] = useState<DateRangeUnit>(
    initialSelection?.unit || "day"
  );
  const [startDateUtc, setStartDateUtc] = useState(
    initialSelection?.startDateUtc || today
  );
  const [endDateUtc, setEndDateUtc] = useState(
    initialSelection?.endDateUtc || today
  );
  const [duration, setDuration] = useState(initialSelection?.duration || 1);
  const [excludedWeekdays, setExcludedWeekdays] = useState<number[]>(
    initialSelection?.excludedWeekdays || []
  );

  // Recalculate whenever dependencies change
  useEffect(() => {
    const newDuration = calcDurationFromRange(
      startDateUtc,
      endDateUtc,
      unit,
      excludedWeekdays
    );
    setDuration(newDuration);
  }, [startDateUtc, endDateUtc, unit, excludedWeekdays]);

  const handleStartDateChange = (value: string) => {
    setStartDateUtc(value);
    // If new start is after end, adjust end
    if (parseUtc(value) > parseUtc(endDateUtc)) {
      setEndDateUtc(value);
    }
  };

  const handleEndDateChange = (value: string) => {
    setEndDateUtc(value);
    // If new end is before start, adjust start
    if (parseUtc(value) < parseUtc(startDateUtc)) {
      setStartDateUtc(value);
    }
  };

  const handleDurationChange = (value: number) => {
    if (value <= 0) return;
    setDuration(value);
    const newEndDate = calcEndFromDuration(
      startDateUtc,
      unit,
      value,
      excludedWeekdays
    );
    setEndDateUtc(newEndDate);
  };

  const handleUnitChange = (newUnit: DateRangeUnit) => {
    setUnit(newUnit);
  };

  const toggleWeekday = (day: number) => {
    if (excludedWeekdays.includes(day)) {
      setExcludedWeekdays(excludedWeekdays.filter((d) => d !== day));
    } else {
      setExcludedWeekdays([...excludedWeekdays, day]);
    }
  };

  const handlePresetSelect = (startDate: string, endDate: string) => {
    setStartDateUtc(startDate);
    setEndDateUtc(endDate);
  };

  const handleToday = () => {
    setStartDateUtc(today);
    setEndDateUtc(today);
    setExcludedWeekdays([]);
  };

  const handleClear = () => {
    setStartDateUtc(today);
    setEndDateUtc(today);
    setDuration(1);
    setUnit("day");
    setExcludedWeekdays([]);
  };

  const handleApply = () => {
    const selection = createSelection(
      startDateUtc,
      endDateUtc,
      unit,
      excludedWeekdays
    );
    onApply(selection);
  };

  const handleCalendarSelect = (
    range: { from?: Date; to?: Date } | undefined
  ) => {
    if (range?.from) {
      const newStart = formatUtc(range.from);
      setStartDateUtc(newStart);

      if (range?.to) {
        const newEnd = formatUtc(range.to);
        setEndDateUtc(newEnd);
      } else {
        setEndDateUtc(newStart);
      }
    }
  };

  const selectedRange = {
    from: parseUtc(startDateUtc),
    to: parseUtc(endDateUtc),
  };

  return (
    <div className="flex gap-4 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-[85vh]">
      {/* Left Sidebar: Presets and Saved Dates */}
      <PresetSidebar
        onPresetSelect={handlePresetSelect}
        currentSelection={createSelection(
          startDateUtc,
          endDateUtc,
          unit,
          excludedWeekdays
        )}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Unit Tabs */}
        <div className="flex gap-2 mb-4">
          {(["day", "week", "month", "quarter"] as DateRangeUnit[]).map((u) => (
            <button
              key={u}
              onClick={() => handleUnitChange(u)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                unit === u
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {u.charAt(0).toUpperCase() + u.slice(1)}
            </button>
          ))}
        </div>

        {/* Date Inputs Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDateUtc}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDateUtc}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Duration
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => handleDurationChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {unit}(s)
              </span>
            </div>
          </div>
        </div>

        {/* Exclude Weekdays */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-gray-600">
              Exclude from selection
            </label>
          </div>
          <div className="flex gap-2">
            {WEEKDAY_LABELS.map((day) => (
              <button
                key={day.value}
                onClick={() => toggleWeekday(day.value)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  excludedWeekdays.includes(day.value)
                    ? "bg-red-100 text-red-700 border-2 border-red-400"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Twin Calendars */}
        <div className="flex gap-4 justify-center mb-4">
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={handleCalendarSelect}
            numberOfMonths={2}
            disabled={(date) => excludedWeekdays.includes(date.getDay())}
            modifiersClassNames={{
              selected: "rdp-day_selected bg-blue-600 text-white",
              disabled: "rdp-day_disabled opacity-30",
            }}
            components={{
              IconLeft: () => <ChevronLeft className="w-4 h-4" />,
              IconRight: () => <ChevronRight className="w-4 h-4" />,
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Today
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Clear dates
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
