import { useDateRangeFilter } from "../hooks/useDateRangeFilter";

/**
 * Example component showing how to display and use the selected date range
 * This can be placed anywhere in your app to show the current date selection
 */
export default function DateRangeDisplay() {
  const {
    hasDateFilter,
    dateRange,
    startDate,
    endDate,
    duration,
    unit,
    includedDates,
    excludedWeekdays,
  } = useDateRangeFilter();

  if (!hasDateFilter || !dateRange) {
    return (
      <div className="text-sm text-gray-500 italic">No date range selected</div>
    );
  }

  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const excludedDayNames = excludedWeekdays.map((d) => weekdayNames[d]);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
      <h4 className="font-semibold text-blue-900 mb-2">Selected Date Range</h4>

      <div className="space-y-1 text-blue-800">
        <div>
          <span className="font-medium">Range:</span> {startDate} to {endDate}
        </div>

        <div>
          <span className="font-medium">Duration:</span> {duration} {unit}(s)
        </div>

        <div>
          <span className="font-medium">Total included dates:</span>{" "}
          {includedDates.length}
        </div>

        {excludedWeekdays.length > 0 && (
          <div>
            <span className="font-medium">Excluded weekdays:</span>{" "}
            {excludedDayNames.join(", ")}
          </div>
        )}
      </div>

      {/* Example: Show first 5 dates */}
      {includedDates.length > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="text-xs font-medium text-blue-700 mb-1">
            First {Math.min(5, includedDates.length)} dates:
          </div>
          <div className="flex flex-wrap gap-1">
            {includedDates.slice(0, 5).map((date) => (
              <span
                key={date}
                className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded text-xs"
              >
                {date}
              </span>
            ))}
            {includedDates.length > 5 && (
              <span className="px-2 py-0.5 text-blue-600 text-xs">
                +{includedDates.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Example: API call format */}
      <div className="mt-3 pt-3 border-t border-blue-200">
        <div className="text-xs font-medium text-blue-700 mb-1">
          Example API call:
        </div>
        <pre className="text-xs bg-blue-100 text-blue-900 p-2 rounded overflow-x-auto">
          {`fetch('/api/data', {
  method: 'POST',
  body: JSON.stringify({
    dates: ${JSON.stringify(includedDates.slice(0, 3))}${
            includedDates.length > 3 ? "..." : ""
          },
    startDate: "${startDate}",
    endDate: "${endDate}"
  })
})`}
        </pre>
      </div>
    </div>
  );
}
