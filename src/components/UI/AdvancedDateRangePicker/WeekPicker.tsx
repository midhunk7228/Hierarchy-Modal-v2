import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfWeek,
  addWeeks,
  startOfMonth,
  endOfMonth,
  format,
  addDays,
  addMonths,
  subMonths,
} from "date-fns";
import { parseUtc, getTodayUtc, formatUtc } from "../../../utils/dateRange";
import { ALLOW_FUTURE_DATES, WEEK_STARTS_ON } from "../../../config/dateConfig";

interface WeekPickerProps {
  selectedRange: { from: Date; to: Date };
  onSelect: (range: { from?: Date; to?: Date } | undefined) => void;
}

export default function WeekPicker({
  selectedRange,
  onSelect,
}: WeekPickerProps) {
  // Get the starting month/year from selected range or current month
  const todayDate = parseUtc(getTodayUtc());
  const initialDisplayMonth = selectedRange.from
    ? startOfMonth(selectedRange.from)
    : startOfMonth(todayDate);
  const [displayMonth, setDisplayMonth] = useState(initialDisplayMonth);
  const today = parseUtc(getTodayUtc());

  // Get all weeks that intersect with the displayed month
  const getWeeksInMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    // Find the first week that contains or starts at the month start
    const firstWeekStart = startOfWeek(monthStart, {
      weekStartsOn: WEEK_STARTS_ON,
    });

    // If the first week start is before month start, use the next week
    let currentWeek =
      firstWeekStart < monthStart
        ? addWeeks(firstWeekStart, 1)
        : firstWeekStart;

    const weeks: Date[] = [];

    // Collect all weeks that intersect with the month
    while (currentWeek <= monthEnd) {
      weeks.push(currentWeek);
      currentWeek = addWeeks(currentWeek, 1);
    }

    return weeks;
  };

  const handleWeekClick = (weekStart: Date) => {
    const weekEnd = addDays(weekStart, 6);

    // If no selection exists, start a new range
    if (!selectedRange.from) {
      onSelect({ from: weekStart, to: weekEnd });
      return;
    }

    // If we have a from but no to (or from === to), set the to
    if (
      !selectedRange.to ||
      selectedRange.from.getTime() === selectedRange.to.getTime()
    ) {
      if (weekStart < selectedRange.from) {
        onSelect({
          from: weekStart,
          to: selectedRange.to || selectedRange.from,
        });
      } else {
        onSelect({ from: selectedRange.from, to: weekEnd });
      }
      return;
    }

    // If we already have a range, start a new selection
    onSelect({ from: weekStart, to: weekEnd });
  };

  const isWeekInRange = (weekStart: Date): boolean => {
    if (!selectedRange.from || !selectedRange.to) return false;
    const weekEnd = addDays(weekStart, 6);
    // Check if week overlaps with the selected range
    return weekStart <= selectedRange.to && weekEnd >= selectedRange.from;
  };

  const isWeekStart = (weekStart: Date): boolean => {
    if (!selectedRange.from) return false;
    const weekStartOfSelected = startOfWeek(selectedRange.from, {
      weekStartsOn: WEEK_STARTS_ON,
    });
    return weekStart.getTime() === weekStartOfSelected.getTime();
  };

  const isWeekEnd = (weekStart: Date): boolean => {
    if (!selectedRange.to) return false;
    const weekStartOfSelected = startOfWeek(selectedRange.to, {
      weekStartsOn: WEEK_STARTS_ON,
    });
    return weekStart.getTime() === weekStartOfSelected.getTime();
  };

  const isFutureWeek = (weekStart: Date): boolean => {
    if (ALLOW_FUTURE_DATES) return false;
    const weekEnd = addDays(weekStart, 6);
    const weekEndStr = formatUtc(weekEnd);
    return weekEndStr > formatUtc(today);
  };

  const handlePreviousMonth = () => {
    setDisplayMonth(subMonths(displayMonth, 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(addMonths(displayMonth, 1));
  };

  const weeks = getWeeksInMonth(displayMonth);
  const monthYearLabel = format(displayMonth, "MMMM yyyy");

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-base font-semibold text-gray-900">
          {monthYearLabel}
        </div>
        <button
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Week List */}
      <div className="space-y-2">
        {weeks.map((weekStart, index) => {
          const weekEnd = addDays(weekStart, 6);
          const inRange = isWeekInRange(weekStart);
          const isStart = isWeekStart(weekStart);
          const isEnd = isWeekEnd(weekStart);
          const isSelected = isStart || isEnd;
          const futureWeek = isFutureWeek(weekStart);

          const weekLabel = `${format(weekStart, "MMM d")} - ${format(
            weekEnd,
            "MMM d"
          )}`;

          return (
            <button
              key={`week-${index}`}
              onClick={() => !futureWeek && handleWeekClick(weekStart)}
              disabled={futureWeek}
              className={`
                w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors text-center
                ${
                  futureWeek
                    ? "opacity-30 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isSelected
                    ? "bg-[#003DB8] text-white"
                    : inRange
                    ? "bg-[#EBF0F9] text-[#003DB8]"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }
              `}
            >
              {weekLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
