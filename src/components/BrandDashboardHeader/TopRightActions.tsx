import { useState } from "react";
import { Ellipsis, X } from "lucide-react";
import DateRangeFilter from "../UI/DateRangeFilter";

export default function TopRightActions() {
  const [openDatePopup, setOpenDatePopup] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-03-01",
    endDate: "2025-03-31",
  });

  return (
    <div className="relative flex items-center gap-4 self-end md:self-center">
      <button
        onClick={() => setOpenDatePopup(openDatePopup === 0 ? null : 0)}
        className="flex items-center gap-2 rounded-lg bg-white text-gray-600 transition-colors"
      >
        <Ellipsis className="h-6 w-6 cursor-pointer" />
      </button>
      {openDatePopup === 0 && (
        <div className="absolute top-full right-0 z-10 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">Select Date Range</h4>
            <button
              onClick={() => setOpenDatePopup(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <DateRangeFilter
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={(startDate, endDate) =>
              setDateRange({ startDate, endDate })
            }
          />
          <div className="mt-2 flex justify-end">
            <button
              className=" rounded-lg bg-blue-600 px-4 py-1 text-white transition-colors hover:bg-blue-700"
              onClick={() => setOpenDatePopup(null)}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
