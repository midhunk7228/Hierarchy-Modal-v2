import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { DateRangeSelection } from "../types/dateRange";

/**
 * Custom hook to access the date range filter from Redux
 *
 * Usage example:
 * ```typescript
 * const { dateRange, hasDateFilter } = useDateRangeFilter();
 *
 * if (hasDateFilter && dateRange) {
 *   // Use dateRange.includedDatesUtc for API calls
 *   fetchData({ dates: dateRange.includedDatesUtc });
 *
 *   // Or use start/end dates
 *   fetchData({
 *     startDate: dateRange.startDateUtc,
 *     endDate: dateRange.endDateUtc
 *   });
 * }
 * ```
 */
export function useDateRangeFilter() {
  const filters = useSelector(
    (state: RootState) => state.filters.localAppliedFilters
  );

  const dateFilter = filters.find((f) => f.filterId === "date-range");
  const dateRange = dateFilter?.value as DateRangeSelection | undefined;

  return {
    dateRange,
    hasDateFilter: !!dateFilter,
    includedDates: dateRange?.includedDatesUtc || [],
    startDate: dateRange?.startDateUtc,
    endDate: dateRange?.endDateUtc,
    duration: dateRange?.duration,
    unit: dateRange?.unit,
    excludedWeekdays: dateRange?.excludedWeekdays || [],
  };
}
