import {
  parseISO,
  formatISO,
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  startOfWeek,
  startOfMonth,
  startOfYear,
  startOfQuarter,
  endOfWeek,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInQuarters,
  eachDayOfInterval,
} from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import type { DateRangeUnit, DateRangeSelection } from "../types/dateRange";

const UTC_ZONE = "UTC";

/**
 * Parse a date string (yyyy-MM-dd) as UTC
 */
export function parseUtc(dateStr: string): Date {
  const date = parseISO(`${dateStr}T00:00:00.000Z`);
  return toZonedTime(date, UTC_ZONE);
}

/**
 * Format a Date as yyyy-MM-dd in UTC
 */
export function formatUtc(date: Date): string {
  const utcDate = fromZonedTime(date, UTC_ZONE);
  return formatISO(utcDate, { representation: "date" });
}

/**
 * Get today's date in UTC as yyyy-MM-dd
 */
export function getTodayUtc(): string {
  return formatUtc(new Date());
}

/**
 * Add units to a date in UTC
 */
export function addUnitUtc(
  dateStr: string,
  unit: DateRangeUnit,
  amount: number
): string {
  const date = parseUtc(dateStr);
  let result: Date;

  switch (unit) {
    case "day":
      result = addDays(date, amount);
      break;
    case "week":
      result = addWeeks(date, amount);
      break;
    case "month":
      result = addMonths(date, amount);
      break;
    case "quarter":
      result = addQuarters(date, amount);
      break;
    default:
      result = date;
  }

  return formatUtc(result);
}

/**
 * Calculate the end date from start, duration, and excluded weekdays
 * For day unit, we count only included days
 */
export function calcEndFromDuration(
  startDateUtc: string,
  unit: DateRangeUnit,
  duration: number,
  excludedWeekdays: number[]
): string {
  if (duration <= 0) return startDateUtc;

  if (unit === "day" && excludedWeekdays.length > 0) {
    // Count only included days
    let currentDate = parseUtc(startDateUtc);
    let includedDaysCount = 0;

    // Include the start date itself if it's not excluded
    if (!excludedWeekdays.includes(currentDate.getDay())) {
      includedDaysCount = 1;
    }

    // Keep adding days until we reach the desired duration
    while (includedDaysCount < duration) {
      currentDate = addDays(currentDate, 1);
      if (!excludedWeekdays.includes(currentDate.getDay())) {
        includedDaysCount++;
      }
    }

    return formatUtc(currentDate);
  } else {
    // For other units or no exclusions, simple addition
    return addUnitUtc(startDateUtc, unit, duration - 1);
  }
}

/**
 * Calculate duration from start and end dates
 */
export function calcDurationFromRange(
  startDateUtc: string,
  endDateUtc: string,
  unit: DateRangeUnit,
  excludedWeekdays: number[]
): number {
  const start = parseUtc(startDateUtc);
  const end = parseUtc(endDateUtc);

  if (start > end) return 0;

  if (unit === "day" && excludedWeekdays.length > 0) {
    // Count only included days
    const allDays = eachDayOfInterval({ start, end });
    const includedDays = allDays.filter(
      (day) => !excludedWeekdays.includes(day.getDay())
    );
    return includedDays.length;
  }

  switch (unit) {
    case "day":
      return differenceInDays(end, start) + 1;
    case "week":
      return differenceInWeeks(end, start) + 1;
    case "month":
      return differenceInMonths(end, start) + 1;
    case "quarter":
      return differenceInQuarters(end, start) + 1;
    default:
      return 1;
  }
}

/**
 * Enumerate all included dates (excluding specified weekdays)
 */
export function enumerateIncludedDates(
  startDateUtc: string,
  endDateUtc: string,
  excludedWeekdays: number[]
): string[] {
  const start = parseUtc(startDateUtc);
  const end = parseUtc(endDateUtc);

  if (start > end) return [];

  const allDays = eachDayOfInterval({ start, end });

  if (excludedWeekdays.length === 0) {
    return allDays.map(formatUtc);
  }

  return allDays
    .filter((day) => !excludedWeekdays.includes(day.getDay()))
    .map(formatUtc);
}

/**
 * Create a complete DateRangeSelection from start and end dates
 */
export function createSelection(
  startDateUtc: string,
  endDateUtc: string,
  unit: DateRangeUnit = "day",
  excludedWeekdays: number[] = []
): DateRangeSelection {
  const duration = calcDurationFromRange(
    startDateUtc,
    endDateUtc,
    unit,
    excludedWeekdays
  );
  const includedDatesUtc = enumerateIncludedDates(
    startDateUtc,
    endDateUtc,
    excludedWeekdays
  );

  return {
    startDateUtc,
    endDateUtc,
    unit,
    duration,
    excludedWeekdays,
    includedDatesUtc,
  };
}

/**
 * Convert YYYY-MM-DD to MM/DD/YYYY
 */
export function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${month}/${day}/${year}`;
}

/**
 * Convert MM/DD/YYYY to YYYY-MM-DD
 */
export function parseDisplayDate(displayStr: string): string | null {
  const parts = displayStr.split("/");
  if (parts.length !== 3) return null;

  const [month, day, year] = parts;
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  const yearNum = parseInt(year, 10);

  if (
    isNaN(monthNum) ||
    isNaN(dayNum) ||
    isNaN(yearNum) ||
    monthNum < 1 ||
    monthNum > 12 ||
    dayNum < 1 ||
    dayNum > 31 ||
    yearNum < 1900 ||
    yearNum > 2100
  ) {
    return null;
  }

  const monthStr = monthNum.toString().padStart(2, "0");
  const dayStr = dayNum.toString().padStart(2, "0");
  return `${yearNum}-${monthStr}-${dayStr}`;
}

/**
 * Get unit abbreviation
 */
export function getUnitAbbreviation(unit: DateRangeUnit): string {
  switch (unit) {
    case "day":
      return "d";
    case "week":
      return "w";
    case "month":
      return "m";
    case "quarter":
      return "q";
    default:
      return "";
  }
}

/**
 * Get preset date ranges
 */
export function getPresets() {
  const today = getTodayUtc();
  const todayDate = parseUtc(today);

  return {
    today: {
      label: "Today",
      getValue: () => ({
        startDateUtc: today,
        endDateUtc: today,
      }),
    },
    yesterday: {
      label: "Yesterday",
      getValue: () => {
        const yesterday = formatUtc(addDays(todayDate, -1));
        return {
          startDateUtc: yesterday,
          endDateUtc: yesterday,
        };
      },
    },
    thisWeek: {
      label: "This Week",
      getValue: () => {
        const weekStart = startOfWeek(todayDate);
        const weekEnd = endOfWeek(todayDate);
        return {
          startDateUtc: formatUtc(weekStart),
          endDateUtc: formatUtc(weekEnd),
        };
      },
    },
    monthToDate: {
      label: "Month to Date",
      getValue: () => {
        const monthStart = startOfMonth(todayDate);
        return {
          startDateUtc: formatUtc(monthStart),
          endDateUtc: today,
        };
      },
    },
    yearToDate: {
      label: "Year to Date",
      getValue: () => {
        const yearStart = startOfYear(todayDate);
        return {
          startDateUtc: formatUtc(yearStart),
          endDateUtc: today,
        };
      },
    },
    thisQuarter: {
      label: "This Quarter",
      getValue: () => {
        const quarterStart = startOfQuarter(todayDate);
        return {
          startDateUtc: formatUtc(quarterStart),
          endDateUtc: today,
        };
      },
    },
  };
}
