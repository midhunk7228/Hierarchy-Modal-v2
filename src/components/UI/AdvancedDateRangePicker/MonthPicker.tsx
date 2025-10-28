import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseUtc, formatUtc } from "../../../utils/dateRange";
import { getMonth, getYear, setMonth, setYear } from "date-fns";

interface MonthPickerProps {
  selectedRange: { from: Date; to: Date };
  onSelect: (range: { from?: Date; to?: Date } | undefined) => void;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function MonthPicker({
  selectedRange,
  onSelect,
}: MonthPickerProps) {
  // Get the starting year from selected range or current year
  const selectedStartYear = getYear(selectedRange.from);
  const [displayYear, setDisplayYear] = useState(selectedStartYear);

  const handleMonthClick = (year: number, monthIndex: number) => {
    const clickedDate = setMonth(setYear(new Date(), year), monthIndex);

    // If no selection exists, start a new range
    if (!selectedRange.from) {
      onSelect({ from: clickedDate, to: clickedDate });
      return;
    }

    // If we have a from but no to (or from === to), set the to
    if (
      !selectedRange.to ||
      selectedRange.from.getTime() === selectedRange.to.getTime()
    ) {
      if (clickedDate < selectedRange.from) {
        onSelect({ from: clickedDate, to: selectedRange.from });
      } else {
        onSelect({ from: selectedRange.from, to: clickedDate });
      }
      return;
    }

    // If we already have a range, start a new selection
    onSelect({ from: clickedDate, to: clickedDate });
  };

  const isMonthInRange = (year: number, monthIndex: number): boolean => {
    if (!selectedRange.from || !selectedRange.to) return false;

    const monthDate = setMonth(setYear(new Date(), year), monthIndex);
    const fromMonth = getMonth(selectedRange.from);
    const fromYear = getYear(selectedRange.from);
    const toMonth = getMonth(selectedRange.to);
    const toYear = getYear(selectedRange.to);

    const currentYearMonth = year * 12 + monthIndex;
    const fromYearMonth = fromYear * 12 + fromMonth;
    const toYearMonth = toYear * 12 + toMonth;

    return currentYearMonth >= fromYearMonth && currentYearMonth <= toYearMonth;
  };

  const isMonthStart = (year: number, monthIndex: number): boolean => {
    if (!selectedRange.from) return false;
    const fromMonth = getMonth(selectedRange.from);
    const fromYear = getYear(selectedRange.from);
    return year === fromYear && monthIndex === fromMonth;
  };

  const isMonthEnd = (year: number, monthIndex: number): boolean => {
    if (!selectedRange.to) return false;
    const toMonth = getMonth(selectedRange.to);
    const toYear = getYear(selectedRange.to);
    return year === toYear && monthIndex === toMonth;
  };

  const renderYear = (year: number) => {
    return (
      <div key={year} className="flex-1">
        <div className="text-center font-semibold text-lg mb-4">{year}</div>
        <div className="grid grid-cols-4 gap-2">
          {MONTHS.map((month, index) => {
            const inRange = isMonthInRange(year, index);
            const isStart = isMonthStart(year, index);
            const isEnd = isMonthEnd(year, index);
            const isSelected = isStart || isEnd;

            return (
              <button
                key={month}
                onClick={() => handleMonthClick(year, index)}
                className={`
                  px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${
                    isSelected
                      ? "bg-[#003DB8] text-white"
                      : inRange
                      ? "bg-[#CEDBF5] text-[#1F1F1F]"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {month}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setDisplayYear(displayYear - 1)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-lg font-semibold">
          {displayYear} - {displayYear + 1}
        </div>
        <button
          onClick={() => setDisplayYear(displayYear + 1)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Two Year Grids */}
      <div className="flex gap-8">
        {renderYear(displayYear)}
        {renderYear(displayYear + 1)}
      </div>
    </div>
  );
}
