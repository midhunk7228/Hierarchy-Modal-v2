import { useState } from "react";
import { Calendar } from "lucide-react";

interface DateRangeFilterProps {
  onDateChange: (startDate: string, endDate: string) => void;
  startDate?: string;
  endDate?: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateChange,
  startDate = "",
  endDate = "",
}) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  const handleStartDateChange = (date: string) => {
    setLocalStartDate(date);
    onDateChange(date, localEndDate);
  };

  const handleEndDateChange = (date: string) => {
    setLocalEndDate(date);
    onDateChange(localStartDate, date);
  };

  return (
    <div className="flex items-center space-x-2 bg-slate-100 rounded-md p-2">
      <Calendar className="w-4 h-4 text-slate-500" />
      <input
        type="date"
        value={localStartDate}
        onChange={(e) => handleStartDateChange(e.target.value)}
        className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none w-32"
        placeholder="Start Date"
      />
      <span className="text-slate-400">-</span>
      <input
        type="date"
        value={localEndDate}
        onChange={(e) => handleEndDateChange(e.target.value)}
        className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none w-32"
        placeholder="End Date"
      />
    </div>
  );
};

export default DateRangeFilter;
