import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getQuarter,
  getYear,
  setQuarter,
  setYear,
  startOfQuarter,
} from "date-fns";

interface QuarterPickerProps {
  selectedRange: { from: Date; to: Date };
  onSelect: (range: { from?: Date; to?: Date } | undefined) => void;
}

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

export default function QuarterPicker({
  selectedRange,
  onSelect,
}: QuarterPickerProps) {
  // Get the starting year from selected range or current year
  const selectedStartYear = getYear(selectedRange.from);
  const [displayYear, setDisplayYear] = useState(selectedStartYear);

  const handleQuarterClick = (year: number, quarterIndex: number) => {
    // quarterIndex is 0-3, but date-fns expects 1-4
    const clickedDate = startOfQuarter(
      setQuarter(setYear(new Date(), year), quarterIndex + 1)
    );

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

  const isQuarterInRange = (year: number, quarterIndex: number): boolean => {
    if (!selectedRange.from || !selectedRange.to) return false;

    const fromQuarter = getQuarter(selectedRange.from) - 1; // Convert to 0-3
    const fromYear = getYear(selectedRange.from);
    const toQuarter = getQuarter(selectedRange.to) - 1; // Convert to 0-3
    const toYear = getYear(selectedRange.to);

    const currentYearQuarter = year * 4 + quarterIndex;
    const fromYearQuarter = fromYear * 4 + fromQuarter;
    const toYearQuarter = toYear * 4 + toQuarter;

    return (
      currentYearQuarter >= fromYearQuarter &&
      currentYearQuarter <= toYearQuarter
    );
  };

  const isQuarterStart = (year: number, quarterIndex: number): boolean => {
    if (!selectedRange.from) return false;
    const fromQuarter = getQuarter(selectedRange.from) - 1;
    const fromYear = getYear(selectedRange.from);
    return year === fromYear && quarterIndex === fromQuarter;
  };

  const isQuarterEnd = (year: number, quarterIndex: number): boolean => {
    if (!selectedRange.to) return false;
    const toQuarter = getQuarter(selectedRange.to) - 1;
    const toYear = getYear(selectedRange.to);
    return year === toYear && quarterIndex === toQuarter;
  };

  const renderYear = (year: number) => {
    return (
      <div key={year} className="flex-1">
        <div className="text-center font-semibold text-lg mb-4">{year}</div>
        <div className="grid grid-cols-2 gap-3">
          {QUARTERS.map((quarter, index) => {
            const inRange = isQuarterInRange(year, index);
            const isStart = isQuarterStart(year, index);
            const isEnd = isQuarterEnd(year, index);
            const isSelected = isStart || isEnd;

            return (
              <button
                key={quarter}
                onClick={() => handleQuarterClick(year, index)}
                className={`
                  px-4 py-6 text-base font-medium rounded-md transition-colors
                  ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : inRange
                      ? "bg-blue-100 text-blue-900"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {quarter}
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
