import { useState, useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { startOfMonth } from "date-fns";
import {
  X,
  ChevronDown,
  CalendarDays,
  Bookmark,
  AlertTriangle,
} from "lucide-react";
import type {
  DateRangeSelection,
  DateRangeUnit,
  SavedDateRange,
} from "../../../types/dateRange";
import {
  parseUtc,
  formatUtc,
  getTodayUtc,
  calcEndFromDuration,
  calcStartFromDuration,
  calcDurationFromRange,
  createSelection,
  getUnitAbbreviation,
} from "../../../utils/dateRange";
import { ALLOW_FUTURE_DATES } from "../../../config/dateConfig";
import PresetSidebar from "./PresetSidebar";
import MonthPicker from "./MonthPicker";
import QuarterPicker from "./QuarterPicker";
import WeekPicker from "./WeekPicker";
import DateInput from "./DateInput";
import { useIndexedDB } from "../../../helper/useIndexedDB";

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
  const [excludedSpecificDates, setExcludedSpecificDates] = useState<string[]>(
    []
  );

  // Ref for measuring text width
  const durationInputRef = useRef<HTMLInputElement>(null);
  const [unitPosition, setUnitPosition] = useState(0);

  // Exclude filter state
  const [excludeEnabled, setExcludeEnabled] = useState(false);
  const [excludeFilterTypes, setExcludeFilterTypes] = useState<
    ("days" | "specific-date" | "saved-dates" | "date-range")[]
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeFilterView, setActiveFilterView] = useState<
    "days" | "specific-date" | "saved-dates" | "date-range" | null
  >(null);
  const [excludedSavedDates, setExcludedSavedDates] = useState<string[]>([]);
  const [excludedDateRanges, setExcludedDateRanges] = useState<
    Array<{ id: string; start: string; end: string }>
  >([]);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
    undefined
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved dates for filter
  const { getData } = useIndexedDB();
  const [savedDatesForFilter, setSavedDatesForFilter] = useState<
    SavedDateRange[]
  >([]);

  // State to control which month is displayed in DayPicker
  const [displayedMonth, setDisplayedMonth] = useState<Date>(() => {
    // Initialize with start date or today
    if (initialSelection?.startDateUtc) {
      return startOfMonth(parseUtc(initialSelection.startDateUtc));
    }
    return startOfMonth(parseUtc(today));
  });

  // Recalculate duration whenever dependencies change
  useEffect(() => {
    if (startDateUtc && endDateUtc) {
      const newDuration = calcDurationFromRange(
        startDateUtc,
        endDateUtc,
        unit,
        excludedWeekdays
      );
      setDuration(newDuration);
    } else {
      setDuration(1);
    }
  }, [startDateUtc, endDateUtc, unit, excludedWeekdays]);

  // Calculate unit position based on duration text width
  useEffect(() => {
    if (durationInputRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        // Match the input's font style
        context.font = "14px system-ui, -apple-system, sans-serif";
        const textWidth = context.measureText(duration.toString()).width;
        // 12px (left padding) + text width + 4px (one space)
        setUnitPosition(12 + textWidth + 4);
      }
    }
  }, [duration]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load saved dates for filter
  useEffect(() => {
    const loadSavedDates = async () => {
      const data = await getData<SavedDateRange[]>("savedDateRanges");
      if (data) {
        setSavedDatesForFilter(data);
      }
    };
    loadSavedDates();
  }, [getData]);

  const handleStartDateChange = (value: string) => {
    setStartDateUtc(value);
    // If new start is after end, adjust end (only if both dates are valid)
    if (value && endDateUtc && parseUtc(value) > parseUtc(endDateUtc)) {
      setEndDateUtc(value);
    }
    // Navigate calendar to show the month of the new start date
    if (value) {
      setDisplayedMonth(startOfMonth(parseUtc(value)));
    }
  };

  const handleEndDateChange = (value: string) => {
    setEndDateUtc(value);
    // If new end is before start, adjust start (only if both dates are valid)
    if (value && startDateUtc && parseUtc(value) < parseUtc(startDateUtc)) {
      setStartDateUtc(value);
    }
    // Navigate calendar to show the month of the new end date
    if (value) {
      setDisplayedMonth(startOfMonth(parseUtc(value)));
    }
  };

  // Check if dates violate ALLOW_FUTURE_DATES condition
  const hasFutureDates =
    !ALLOW_FUTURE_DATES &&
    startDateUtc &&
    endDateUtc &&
    (startDateUtc > today || endDateUtc > today);
  const getFutureDateWarning = () => {
    if (!hasFutureDates) return null;

    const startIsFuture = startDateUtc && startDateUtc > today;
    const endIsFuture = endDateUtc && endDateUtc > today;

    if (startIsFuture && endIsFuture) {
      return "Start date and end date cannot be in the future.";
    } else if (startIsFuture) {
      return "Start date cannot be in the future.";
    } else if (endIsFuture) {
      return "End date cannot be in the future.";
    }
    return null;
  };

  const handleDurationChange = (value: number) => {
    if (value <= 0) return;
    setDuration(value);

    // If startDate exists, calculate endDate from startDate
    if (startDateUtc) {
      const newEndDate = calcEndFromDuration(
        startDateUtc,
        unit,
        value,
        excludedWeekdays
      );
      setEndDateUtc(newEndDate);
      // Navigate calendar to show the month of the calculated end date
      setDisplayedMonth(startOfMonth(parseUtc(newEndDate)));
    }
    // If only endDate exists, calculate startDate from endDate (backwards)
    else if (endDateUtc) {
      const newStartDate = calcStartFromDuration(
        endDateUtc,
        unit,
        value,
        excludedWeekdays
      );
      setStartDateUtc(newStartDate);
      // Navigate calendar to show the month of the calculated start date
      setDisplayedMonth(startOfMonth(parseUtc(newStartDate)));
    }
    // If neither exists, do nothing (handled by input being disabled or validation)
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
    // Navigate calendar to show the month of the start date
    if (startDate) {
      setDisplayedMonth(startOfMonth(parseUtc(startDate)));
    }
  };

  const handleSavedDateSelect = (selection: DateRangeSelection) => {
    setStartDateUtc(selection.startDateUtc);
    setEndDateUtc(selection.endDateUtc);
    setUnit(selection.unit);
    setExcludedWeekdays(selection.excludedWeekdays);
    setDuration(selection.duration);

    // Restore exclude filter state
    if (selection.excludeEnabled !== undefined) {
      setExcludeEnabled(selection.excludeEnabled);
    }
    if (selection.excludeFilterTypes) {
      setExcludeFilterTypes(selection.excludeFilterTypes);
    } else {
      setExcludeFilterTypes([]);
    }
    if (selection.excludedSpecificDates) {
      setExcludedSpecificDates(selection.excludedSpecificDates);
    } else {
      setExcludedSpecificDates([]);
    }
    if (selection.excludedSavedDates) {
      setExcludedSavedDates(selection.excludedSavedDates);
    } else {
      setExcludedSavedDates([]);
    }
    if (selection.excludedDateRanges) {
      setExcludedDateRanges(selection.excludedDateRanges);
    } else {
      setExcludedDateRanges([]);
    }

    // Navigate calendar to show the month of the start date
    if (selection.startDateUtc) {
      setDisplayedMonth(startOfMonth(parseUtc(selection.startDateUtc)));
    }
  };

  const handleToday = () => {
    setStartDateUtc(today);
    setEndDateUtc(today);
    setExcludedWeekdays([]);
    // Navigate calendar to show the current month
    setDisplayedMonth(startOfMonth(parseUtc(today)));
  };

  const handleClear = () => {
    setStartDateUtc("");
    setEndDateUtc("");
    setDuration(1);
    setUnit("day");
    setExcludedWeekdays([]);

    // Clear all exclude filters
    setExcludeEnabled(false);
    setExcludeFilterTypes([]);
    setExcludedSpecificDates([]);
    setExcludedSavedDates([]);
    setExcludedDateRanges([]);
    setTempDateRange(undefined);
    setActiveFilterView(null);

    // Navigate calendar to current month
    setDisplayedMonth(startOfMonth(parseUtc(today)));
  };

  // Check if dates are empty
  const hasEmptyDates = Boolean(
    !startDateUtc ||
      startDateUtc.trim() === "" ||
      !endDateUtc ||
      endDateUtc.trim() === ""
  );

  const handleApply = () => {
    // Prevent applying if dates are empty
    if (hasEmptyDates) {
      return;
    }

    // Prevent applying if future dates are not allowed and dates violate the rule
    if (hasFutureDates) {
      return;
    }

    const selection = createSelection(
      startDateUtc,
      endDateUtc,
      unit,
      excludedWeekdays,
      excludeEnabled,
      excludeFilterTypes,
      excludedSpecificDates,
      excludedSavedDates,
      excludedDateRanges
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

  // Use today as default dates for MonthPicker and QuarterPicker when empty
  const todayDateObj = parseUtc(today);
  const selectedRange: DateRange = {
    from: startDateUtc ? parseUtc(startDateUtc) : undefined,
    to: endDateUtc ? parseUtc(endDateUtc) : undefined,
  };

  // For MonthPicker and QuarterPicker, provide default dates if empty
  const monthQuarterRange = {
    from: startDateUtc ? parseUtc(startDateUtc) : todayDateObj,
    to: endDateUtc ? parseUtc(endDateUtc) : todayDateObj,
  };

  return (
    <div className="flex gap-4 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-[85vh]">
      {/* Left Sidebar: Presets and Saved Dates */}
      <PresetSidebar
        onPresetSelect={handlePresetSelect}
        onSavedDateSelect={handleSavedDateSelect}
        currentSelection={createSelection(
          startDateUtc,
          endDateUtc,
          unit,
          excludedWeekdays,
          excludeEnabled,
          excludeFilterTypes,
          excludedSpecificDates,
          excludedSavedDates,
          excludedDateRanges
        )}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pt-6 overflow-y-auto flex-1">
          {/* Unit Tabs */}
          <div className="flex gap-2 mb-4">
            {(["day", "week", "month", "quarter"] as DateRangeUnit[]).map(
              (u) => (
                <button
                  key={u}
                  onClick={() => handleUnitChange(u)}
                  className={`px-4 py-2 rounded-lg text-sm font-light transition-colors ${
                    unit === u
                      ? "bg-[#EBF0F9] text-[#003DB8] border border-[#003DB8]"
                      : "bg-[#EBF0F9] text-gray-500 hover:bg-[#EBF0F9]"
                  }`}
                >
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Date Inputs Row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Start Date
              </label>
              <DateInput
                value={startDateUtc}
                onChange={handleStartDateChange}
                placeholder="DD/MM/YYYY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                End Date
              </label>
              <DateInput
                value={endDateUtc}
                onChange={handleEndDateChange}
                placeholder="DD/MM/YYYY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Duration
              </label>
              <div className="relative">
                <input
                  ref={durationInputRef}
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => handleDurationChange(Number(e.target.value))}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
                <span
                  className="absolute top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none"
                  style={{ left: `${unitPosition}px` }}
                >
                  {getUnitAbbreviation(unit)}
                </span>
              </div>
            </div>
          </div>

          {/* Future Date Warning */}
          {hasFutureDates && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">{getFutureDateWarning()}</p>
            </div>
          )}

          {/* Exclude Filter */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                id="exclude-checkbox"
                checked={excludeEnabled}
                onChange={(e) => setExcludeEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="exclude-checkbox"
                className="text-sm text-gray-700"
              >
                exclude from selection
              </label>

              <div className="relative flex-1" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() =>
                    excludeEnabled && setIsDropdownOpen(!isDropdownOpen)
                  }
                  disabled={!excludeEnabled}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                >
                  <span
                    className={
                      excludeFilterTypes.length === 0
                        ? "text-gray-400"
                        : "text-gray-700"
                    }
                  >
                    {excludeFilterTypes.length === 0
                      ? "select a filter"
                      : excludeFilterTypes.length === 1
                      ? excludeFilterTypes[0] === "days"
                        ? "Days"
                        : "Specific Date"
                      : `${excludeFilterTypes.length} filters selected`}
                  </span>
                </button>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                {isDropdownOpen && excludeEnabled && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="p-2 space-y-1">
                      <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={excludeFilterTypes.includes("days")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExcludeFilterTypes([
                                ...excludeFilterTypes,
                                "days",
                              ]);
                            } else {
                              setExcludeFilterTypes(
                                excludeFilterTypes.filter((t) => t !== "days")
                              );
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Days</span>
                      </label>
                      <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={excludeFilterTypes.includes("specific-date")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExcludeFilterTypes([
                                ...excludeFilterTypes,
                                "specific-date",
                              ]);
                            } else {
                              setExcludeFilterTypes(
                                excludeFilterTypes.filter(
                                  (t) => t !== "specific-date"
                                )
                              );
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Specific Date
                        </span>
                      </label>
                      <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={excludeFilterTypes.includes("saved-dates")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExcludeFilterTypes([
                                ...excludeFilterTypes,
                                "saved-dates",
                              ]);
                            } else {
                              setExcludeFilterTypes(
                                excludeFilterTypes.filter(
                                  (t) => t !== "saved-dates"
                                )
                              );
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Saved Dates
                        </span>
                      </label>
                      <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={excludeFilterTypes.includes("date-range")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExcludeFilterTypes([
                                ...excludeFilterTypes,
                                "date-range",
                              ]);
                            } else {
                              setExcludeFilterTypes(
                                excludeFilterTypes.filter(
                                  (t) => t !== "date-range"
                                )
                              );
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Date Range
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Icons */}
            {excludeEnabled && excludeFilterTypes.length > 0 && (
              <div className="flex gap-2 items-center">
                {excludeFilterTypes.includes("days") && (
                  <button
                    onClick={() =>
                      setActiveFilterView(
                        activeFilterView === "days" ? null : "days"
                      )
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeFilterView === "days"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>Days ({excludedWeekdays.length} selected)</span>
                  </button>
                )}

                {excludeFilterTypes.includes("specific-date") && (
                  <button
                    onClick={() =>
                      setActiveFilterView(
                        activeFilterView === "specific-date"
                          ? null
                          : "specific-date"
                      )
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeFilterView === "specific-date"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>Dates ({excludedSpecificDates.length} selected)</span>
                  </button>
                )}

                {excludeFilterTypes.includes("saved-dates") && (
                  <button
                    onClick={() =>
                      setActiveFilterView(
                        activeFilterView === "saved-dates"
                          ? null
                          : "saved-dates"
                      )
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeFilterView === "saved-dates"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Saved ({excludedSavedDates.length} selected)</span>
                  </button>
                )}

                {excludeFilterTypes.includes("date-range") && (
                  <button
                    onClick={() =>
                      setActiveFilterView(
                        activeFilterView === "date-range" ? null : "date-range"
                      )
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeFilterView === "date-range"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      Date Ranges ({excludedDateRanges.length} selected)
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Days Filter Content - Shown when icon clicked */}
            {excludeEnabled &&
              activeFilterView === "days" &&
              excludeFilterTypes.includes("days") && (
                <div className="mt-3 flex gap-2">
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
              )}

            {/* Specific Date Filter Content - Shown when icon clicked */}
            {excludeEnabled &&
              activeFilterView === "specific-date" &&
              excludeFilterTypes.includes("specific-date") && (
                <div className="mt-3 flex flex-col gap-3">
                  <p className="text-xs text-gray-500 text-center mb-2">
                    Click individual dates to exclude them
                  </p>
                  <div className="flex justify-center p-4 border border-gray-200 rounded-md bg-gray-50">
                    <DayPicker
                      mode="multiple"
                      selected={excludedSpecificDates.map((d) => parseUtc(d))}
                      onSelect={(dates) => {
                        if (dates) {
                          setExcludedSpecificDates(
                            dates.map((d) => formatUtc(d))
                          );
                        }
                      }}
                      numberOfMonths={2}
                      modifiersClassNames={{
                        selected:
                          "bg-red-500 text-white hover:bg-red-600 rounded-md",
                      }}
                    />
                  </div>

                  {excludedSpecificDates.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {excludedSpecificDates.map((date) => (
                        <div
                          key={date}
                          className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                        >
                          <span>
                            {new Date(date + "T00:00:00").toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <button
                            onClick={() => {
                              setExcludedSpecificDates(
                                excludedSpecificDates.filter((d) => d !== date)
                              );
                            }}
                            className="hover:bg-red-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {/* Saved Dates Filter Content - Shown when icon clicked */}
            {excludeEnabled &&
              activeFilterView === "saved-dates" &&
              excludeFilterTypes.includes("saved-dates") && (
                <div className="mt-3 flex flex-col gap-3">
                  {savedDatesForFilter.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No saved dates available
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {savedDatesForFilter.map((saved) => {
                        const isExcluded = excludedSavedDates.includes(
                          saved.id
                        );
                        return (
                          <div
                            key={saved.id}
                            className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${
                              isExcluded
                                ? "bg-red-50 border border-red-300"
                                : "bg-white hover:bg-gray-50 border border-gray-200"
                            }`}
                            onClick={() => {
                              if (isExcluded) {
                                setExcludedSavedDates(
                                  excludedSavedDates.filter(
                                    (id) => id !== saved.id
                                  )
                                );
                              } else {
                                setExcludedSavedDates([
                                  ...excludedSavedDates,
                                  saved.id,
                                ]);
                              }
                            }}
                          >
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {saved.label}
                              </div>
                              <div className="text-xs text-gray-600">
                                {new Date(
                                  saved.selection.startDateUtc + "T00:00:00"
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}{" "}
                                -{" "}
                                {new Date(
                                  saved.selection.endDateUtc + "T00:00:00"
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={isExcluded}
                              onChange={() => {}}
                              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            {/* Date Range Filter Content - Shown when icon clicked */}
            {excludeEnabled &&
              activeFilterView === "date-range" &&
              excludeFilterTypes.includes("date-range") && (
                <div className="mt-3 flex flex-col gap-3">
                  <div className="border border-gray-200 rounded-md bg-gray-50 p-4">
                    <DayPicker
                      mode="range"
                      selected={tempDateRange}
                      onSelect={(range) => setTempDateRange(range)}
                      numberOfMonths={2}
                      disabled={(date) => {
                        const isFutureDate =
                          !ALLOW_FUTURE_DATES && formatUtc(date) > today;
                        return isFutureDate;
                      }}
                      modifiersClassNames={{
                        selected:
                          "bg-red-500 text-white hover:bg-red-600 rounded-md",
                      }}
                    />
                  </div>

                  {tempDateRange?.from && tempDateRange?.to && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newRange = {
                            id: `range-${Date.now()}`,
                            start: formatUtc(tempDateRange.from!),
                            end: formatUtc(tempDateRange.to!),
                          };
                          setExcludedDateRanges([
                            ...excludedDateRanges,
                            newRange,
                          ]);
                          setTempDateRange(undefined);
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Add Date Range
                      </button>
                      <button
                        onClick={() => setTempDateRange(undefined)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                      >
                        Clear Selection
                      </button>
                    </div>
                  )}

                  {excludedDateRanges.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-gray-600 font-medium">
                        Excluded Date Ranges:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {excludedDateRanges.map((range) => (
                          <div
                            key={range.id}
                            className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                          >
                            <span>
                              {new Date(
                                range.start + "T00:00:00"
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                              {" - "}
                              {new Date(
                                range.end + "T00:00:00"
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <button
                              onClick={() => {
                                setExcludedDateRanges(
                                  excludedDateRanges.filter(
                                    (r) => r.id !== range.id
                                  )
                                );
                              }}
                              className="hover:bg-red-200 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Calendar Views - Conditional based on unit */}
          <div className="flex gap-4 justify-center mb-4">
            {unit === "day" && (
              <DayPicker
                mode="range"
                navLayout="around"
                selected={selectedRange}
                onSelect={handleCalendarSelect}
                month={displayedMonth}
                onMonthChange={setDisplayedMonth}
                numberOfMonths={2}
                disabled={(date) => {
                  // Check if future dates are not allowed
                  const isFutureDate =
                    !ALLOW_FUTURE_DATES && formatUtc(date) > today;

                  const isWeekdayExcluded =
                    excludeEnabled &&
                    excludeFilterTypes.includes("days") &&
                    excludedWeekdays.includes(date.getDay());
                  const isSpecificDateExcluded =
                    excludeEnabled &&
                    excludeFilterTypes.includes("specific-date") &&
                    excludedSpecificDates.includes(formatUtc(date));

                  // Check if date falls within any excluded saved date range
                  // and also check if the date should be excluded based on the saved date's own filters
                  const isInExcludedSavedDate =
                    excludeEnabled &&
                    excludeFilterTypes.includes("saved-dates") &&
                    excludedSavedDates.some((savedId) => {
                      const saved = savedDatesForFilter.find(
                        (s) => s.id === savedId
                      );
                      if (!saved) return false;
                      const dateStr = formatUtc(date);

                      // Check if date is within the saved date's range
                      const isInRange =
                        dateStr >= saved.selection.startDateUtc &&
                        dateStr <= saved.selection.endDateUtc;

                      if (!isInRange) return false;

                      // Check if the saved date has excluded weekdays and this date matches one
                      if (
                        saved.selection.excludedWeekdays &&
                        saved.selection.excludedWeekdays.length > 0 &&
                        saved.selection.excludedWeekdays.includes(date.getDay())
                      ) {
                        return true;
                      }

                      // Check if the saved date has excluded specific dates and this date is one of them
                      if (
                        saved.selection.excludedSpecificDates &&
                        saved.selection.excludedSpecificDates.length > 0 &&
                        saved.selection.excludedSpecificDates.includes(dateStr)
                      ) {
                        return true;
                      }

                      // Check if the saved date has excluded saved dates and this date is in one of them
                      if (saved.selection.excludedSavedDates) {
                        const isInExcludedSaved =
                          saved.selection.excludedSavedDates.some(
                            (excludedSavedId) => {
                              const excludedSaved = savedDatesForFilter.find(
                                (s) => s.id === excludedSavedId
                              );
                              if (!excludedSaved) return false;
                              return (
                                dateStr >=
                                  excludedSaved.selection.startDateUtc &&
                                dateStr <= excludedSaved.selection.endDateUtc
                              );
                            }
                          );
                        if (isInExcludedSaved) return true;
                      }

                      // Check if the saved date has excluded date ranges and this date is in one of them
                      let isInExcludedRange = false;
                      if (saved.selection.excludedDateRanges) {
                        isInExcludedRange =
                          saved.selection.excludedDateRanges.some(
                            (range) =>
                              dateStr >= range.start && dateStr <= range.end
                          );
                        if (isInExcludedRange) return true;
                      }

                      // Only exclude if this date was originally excluded in the saved date range
                      // If it wasn't excluded, it should remain enabled
                      return false;
                    });

                  // Check if date falls within any excluded date range
                  const isInExcludedDateRange =
                    excludeEnabled &&
                    excludeFilterTypes.includes("date-range") &&
                    excludedDateRanges.some((range) => {
                      const dateStr = formatUtc(date);
                      return dateStr >= range.start && dateStr <= range.end;
                    });

                  return (
                    isFutureDate ||
                    isWeekdayExcluded ||
                    isSpecificDateExcluded ||
                    isInExcludedSavedDate ||
                    isInExcludedDateRange
                  );
                }}
                modifiersClassNames={{
                  selected: "rdp-day_selected bg-[#003DB8]",
                  disabled:
                    "rdp-day_disabled opacity-30 bg-gray-100 text-black",
                }}
                classNames={{
                  chevron: "fill-black", // Style the chevron SVG
                }}
              />
            )}
            {unit === "week" && (
              <WeekPicker
                selectedRange={monthQuarterRange}
                onSelect={handleCalendarSelect}
              />
            )}
            {unit === "month" && (
              <MonthPicker
                selectedRange={monthQuarterRange}
                onSelect={handleCalendarSelect}
              />
            )}
            {unit === "quarter" && (
              <QuarterPicker
                selectedRange={monthQuarterRange}
                onSelect={handleCalendarSelect}
              />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 pb-6 px-6 border-t border-gray-200">
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
              disabled={Boolean(hasEmptyDates || hasFutureDates)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                hasEmptyDates || hasFutureDates
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
