export type DateRangeUnit = "day" | "week" | "month" | "quarter";

export interface DateRangeSelection {
  startDateUtc: string; // yyyy-MM-dd format
  endDateUtc: string; // yyyy-MM-dd format
  unit: DateRangeUnit;
  duration: number; // in selected unit
  excludedWeekdays: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  includedDatesUtc: string[]; // yyyy-MM-dd, all dates excluding weekdays
  excludeEnabled?: boolean; // Whether exclude filters are enabled
  excludeFilterTypes?: (
    | "days"
    | "specific-date"
    | "saved-dates"
    | "date-range"
  )[]; // Which exclude filters are active
  excludedSpecificDates?: string[]; // Specific dates to exclude
  excludedSavedDates?: string[]; // IDs of saved date ranges to exclude
  excludedDateRanges?: Array<{ id: string; start: string; end: string }>; // Date ranges to exclude
}

export interface SavedDateRange {
  id: string;
  label: string;
  selection: DateRangeSelection;
  createdAt: number; // timestamp
}

export interface PresetDateRange {
  label: string;
  getValue: () => Pick<DateRangeSelection, "startDateUtc" | "endDateUtc">;
}
