import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
export interface Option {
  value: string;
  label: string;
  image?: string;
  icon?: React.ReactNode;
}
interface MultiSelectDropdownProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  trigger: React.ReactNode;
  title: string;
  className?: string;
}
export default function MultiSelectDropdown({
  options,
  selected,
  onChange,
  trigger,
  title,
  className,
}: MultiSelectDropdownProps) {
  const organizationId = 3;
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute right-0 mt-1.5 w-80 origin-top-right bg-white border border-gray-300 rounded-lg shadow-lg focus:outline-none z-10 ${className}`}
        >
          <div className="p-2.5 border-b border-gray-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5">
                <Search className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder={`Search ${title}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-200 bg-gray-100 pl-9 text-sm py-1.5 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <ul className="max-h-80 overflow-auto p-1.5">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(option.value)}
              >
                <div className="flex items-center">
                  {option.image && (
                    <img
                      src={`${baseURL}/clients/${organizationId}/${encodeURIComponent(
                        option.image.replace(/^\//, "")
                      )}`}
                      alt={option.label}
                      className="mr-2.5 h-7 w-11 object-contain"
                    />
                  )}
                  {option.icon && (
                    <span className="mr-2.5 text-gray-500">{option.icon}</span>
                  )}
                  <span className="text-sm text-gray-800">{option.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  readOnly
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
