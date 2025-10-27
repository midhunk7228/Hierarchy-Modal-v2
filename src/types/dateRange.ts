export type DateRangeUnit = "day" | "week" | "month" | "quarter";

export interface DateRangeSelection {
  startDateUtc: string; // yyyy-MM-dd format
  endDateUtc: string; // yyyy-MM-dd format
  unit: DateRangeUnit;
  duration: number; // in selected unit
  excludedWeekdays: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  includedDatesUtc: string[]; // yyyy-MM-dd, all dates excluding weekdays
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
