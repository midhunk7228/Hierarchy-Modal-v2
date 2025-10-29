import { useEffect, useRef, useState } from "react";

interface DateInputProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function DateInput({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  className = "",
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState("");

  // Convert YYYY-MM-DD to DD/MM/YYYY
  const formatToDisplay = (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 10) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD
  const formatToInternal = (displayStr: string): string | null => {
    const cleaned = displayStr.replace(/\D/g, "");
    if (cleaned.length !== 8) return null;

    const day = cleaned.substring(0, 2);
    const month = cleaned.substring(2, 4);
    const year = cleaned.substring(4, 8);

    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);

    if (
      monthNum < 1 ||
      monthNum > 12 ||
      dayNum < 1 ||
      dayNum > 31 ||
      yearNum < 1900 ||
      yearNum > 2100
    ) {
      return null;
    }

    return `${year}-${month}-${day}`;
  };

  // Initialize display value from prop
  useEffect(() => {
    setDisplayValue(formatToDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, "");

    // Format as user types
    let formatted = "";
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2);
      if (cleaned.length >= 3) {
        formatted += "/" + cleaned.substring(2, 4);
      }
      if (cleaned.length >= 5) {
        formatted += "/" + cleaned.substring(4, 8);
      }
    }

    setDisplayValue(formatted);

    // Only trigger onChange when we have a complete date
    if (cleaned.length === 8) {
      const internalFormat = formatToInternal(formatted);
      if (internalFormat) {
        onChange(internalFormat);
      }
    }
  };

  const handleBlur = () => {
    // On blur, validate and reset if invalid
    if (displayValue) {
      const internalFormat = formatToInternal(displayValue);
      if (internalFormat) {
        onChange(internalFormat);
        setDisplayValue(formatToDisplay(internalFormat));
      } else {
        // Reset to valid value if invalid
        setDisplayValue(formatToDisplay(value));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter, and arrow keys
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "Escape" ||
      e.key === "Enter" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      return;
    }

    // Only allow numbers
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      maxLength={10}
      className={className}
    />
  );
}
