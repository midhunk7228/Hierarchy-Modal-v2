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
  const cursorPositionRef = useRef<number>(0);

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
    const cursorPos = e.target.selectionStart || 0;
    const oldValue = displayValue;

    // If user is deleting, handle it more gracefully
    if (input.length < oldValue.length) {
      // Preserve the value structure, just remove the deleted character
      // If a slash was deleted, we might need to adjust
      if (
        input.replace(/\D/g, "").length < oldValue.replace(/\D/g, "").length
      ) {
        // A digit was deleted, rebuild maintaining structure
        const digitsOnly = input.replace(/\D/g, "");
        let formatted = "";
        if (digitsOnly.length > 0) {
          formatted = digitsOnly.substring(0, 2);
          if (digitsOnly.length > 2) {
            formatted += "/" + digitsOnly.substring(2, 4);
          }
          if (digitsOnly.length > 4) {
            formatted += "/" + digitsOnly.substring(4, 8);
          }
        }
        setDisplayValue(formatted);

        // Restore cursor position
        setTimeout(() => {
          if (inputRef.current) {
            const newCursorPos = Math.min(cursorPos, formatted.length);
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);

        // Update internal value if complete
        if (digitsOnly.length === 8) {
          const internalFormat = formatToInternal(formatted);
          if (internalFormat) {
            onChange(internalFormat);
          }
        }
      } else {
        // Just a slash was deleted, restore it
        setDisplayValue(oldValue);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(cursorPos, cursorPos);
          }
        }, 0);
      }
      return;
    }

    // Extract only digits from input
    const cleaned = input.replace(/\D/g, "");

    // Format as user types, preserving partial input with validation
    let formatted = "";
    if (cleaned.length > 0) {
      // Day (first 2 digits): 01-31
      let day = cleaned.substring(0, 2);
      if (day.length === 2) {
        const dayNum = parseInt(day, 10);
        if (dayNum > 31) {
          day = "31";
        } else if (dayNum < 1 && day.length === 2) {
          day = "01";
        }
      }
      formatted = day;

      // Month (digits 3-4): 01-12
      if (cleaned.length > 2) {
        let month = cleaned.substring(2, 4);
        if (month.length === 2) {
          const monthNum = parseInt(month, 10);
          if (monthNum > 12) {
            month = "12";
          } else if (monthNum < 1 && month.length === 2) {
            month = "01";
          }
        }
        formatted += "/" + month;
      }

      // Year (digits 5-8): 1900-2100
      if (cleaned.length > 4) {
        let year = cleaned.substring(4, 8);
        if (year.length === 4) {
          const yearNum = parseInt(year, 10);
          if (yearNum > 2100) {
            year = "2100";
          } else if (yearNum < 1900) {
            year = "1900";
          }
        }
        formatted += "/" + year;
      }
    }

    setDisplayValue(formatted);

    // Calculate new cursor position
    let newCursorPos = cursorPos;
    if (formatted.length > oldValue.length) {
      // Character was added
      const addedChars = formatted.length - oldValue.length;
      newCursorPos = cursorPos + addedChars;
    }

    // Adjust cursor position to skip over slashes if needed
    if (formatted[newCursorPos] === "/") {
      newCursorPos++;
    }

    // Restore cursor position after state update
    setTimeout(() => {
      if (inputRef.current) {
        const pos = Math.min(newCursorPos, formatted.length);
        inputRef.current.setSelectionRange(pos, pos);
      }
    }, 0);

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
    const input = inputRef.current;
    if (!input) return;

    const cursorPos = input.selectionStart || 0;
    cursorPositionRef.current = cursorPos;

    // Handle arrow keys to jump between date parts
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      // Let default behavior happen first, then adjust
      setTimeout(() => {
        const newPos = input.selectionStart || 0;
        // If cursor is right after a slash, move past it
        if (displayValue[newPos] === "/") {
          const direction = e.key === "ArrowLeft" ? -1 : 1;
          input.setSelectionRange(newPos + direction, newPos + direction);
        }
      }, 0);
      return;
    }

    // Allow backspace, delete, tab, escape, enter
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "Escape" ||
      e.key === "Enter"
    ) {
      return;
    }

    // Only allow numbers
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    // If typing over a slash, skip it
    if (displayValue[cursorPos] === "/") {
      e.preventDefault();
      const newValue =
        displayValue.substring(0, cursorPos) +
        e.key +
        displayValue.substring(cursorPos + 1);
      setDisplayValue(newValue);

      setTimeout(() => {
        if (inputRef.current) {
          const newPos = cursorPos + 1;
          inputRef.current.setSelectionRange(newPos, newPos);
        }
      }, 0);
      return;
    }

    // Validate month input (positions 3-4, after first slash)
    if (cursorPos >= 3 && cursorPos <= 5) {
      const digitsOnly = displayValue.replace(/\D/g, "");
      const monthStr = digitsOnly.substring(2, 4);
      const currentMonthDigit = monthStr.length === 1 ? monthStr : "";
      const newDigit = e.key;

      // If we're typing the second digit of month
      if (monthStr.length === 1 && cursorPos === 5) {
        const newMonth = parseInt(currentMonthDigit + newDigit, 10);
        // Prevent invalid months (00 or > 12)
        if (newMonth === 0 || newMonth > 12) {
          e.preventDefault();
          // If month is > 12, clamp to 12
          if (newMonth > 12) {
            const newValue =
              displayValue.substring(0, 3) +
              currentMonthDigit +
              "2" +
              displayValue.substring(5);
            setDisplayValue(newValue);
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.setSelectionRange(6, 6);
              }
            }, 0);
          }
        }
      }
    }

    // Validate day input (positions 0-1)
    if (cursorPos >= 0 && cursorPos <= 2) {
      const digitsOnly = displayValue.replace(/\D/g, "");
      const dayStr = digitsOnly.substring(0, 2);
      const currentDayDigit = dayStr.length === 1 ? dayStr : "";
      const newDigit = e.key;

      // If we're typing the second digit of day
      if (dayStr.length === 1 && cursorPos === 1) {
        const newDay = parseInt(currentDayDigit + newDigit, 10);
        // Prevent invalid days (00 or > 31)
        if (newDay === 0 || newDay > 31) {
          e.preventDefault();
          // If day is > 31, clamp to 31
          if (newDay > 31) {
            const newValue = currentDayDigit + "1" + displayValue.substring(2);
            setDisplayValue(newValue);
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.setSelectionRange(2, 2);
              }
            }, 0);
          }
        }
      }
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
