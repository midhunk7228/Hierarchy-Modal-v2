import React, { useState } from "react";
import { Globe, Ellipsis, X } from "lucide-react";
import DateRangeFilter from "../UI/DateRangeFilter";
import OutletSelector from "../UI/OutletSelector";

interface Country {
  name: string;
  flag: string;
  code: string;
  currencyCode: string;
}

interface HeaderActionsProps {
  selectedCurrencies: string[];
  availableCountries: Country[];
  selectedCountries: string[];
  handleCurrencyToggle: (country: Country) => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  selectedCurrencies,
  availableCountries,
  selectedCountries,
  handleCurrencyToggle,
}) => {
  const [openDatePopup, setOpenDatePopup] = useState<number | null>(null);
  const [openCurrencyPopup, setOpenCurrencyPopup] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-03-01",
    endDate: "2025-03-31",
  });
  const baseURL = import.meta.env.VITE_BASE_URL;
  return (
    <div className="flex justify-end items-center gap-3 self-end md:self-center">
      <button
        onClick={() => setOpenDatePopup(openDatePopup === 0 ? null : 0)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Ellipsis className="w-5 h-5" />
      </button>
      {openDatePopup === 0 && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 w-80">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-800">Select Date Range</h4>
            <button
              onClick={() => setOpenDatePopup(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
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
            <button className=" px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save
            </button>
          </div>
        </div>
      )}

      <div className="relative ">
        <button
          onClick={() => setOpenCurrencyPopup(!openCurrencyPopup)}
          className="flex cursor-pointer items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Globe className="h-5 w-5 text-gray-600" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              {selectedCurrencies.length > 0
                ? selectedCurrencies.length === 1
                  ? selectedCurrencies[0]
                  : `${selectedCurrencies.length} Countries`
                : "Select Country"}
            </span>
            {selectedCurrencies.length === 1 && (
              <img
                src={(() => {
                  const country = availableCountries.find(
                    (c) => c.currencyCode === selectedCurrencies[0]
                  );
                  return country && country.flag
                    ? `${baseURL}/clients/3/${encodeURIComponent(
                        country.flag.replace(/^\//, "")
                      )}`
                    : "";
                })()}
                alt={
                  availableCountries.find(
                    (c) => c.currencyCode === selectedCurrencies[0]
                  )?.flag || "flag"
                }
                className="h-4 w-auto object-contain"
              />
            )}
          </div>
        </button>

        {openCurrencyPopup && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpenCurrencyPopup(false)}
            />
            <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="p-2">
                {availableCountries
                  .filter((country) => country.name !== "All")
                  .map((country) => {
                    const isSelected = selectedCountries.includes(country.name);
                    return (
                      <label
                        key={country.code}
                        className="flex cursor-pointer items-center justify-between px-3 py-2.5 transition-all hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`${baseURL}/clients/3/${encodeURIComponent(
                              country?.flag.replace(/^\//, "")
                            )}`}
                            alt={country?.flag}
                            className="object-cover h-4"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {country.currencyCode}
                          </span>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type="radio"
                            name="currency"
                            checked={isSelected}
                            onChange={() => handleCurrencyToggle(country)}
                            className="h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-gray-300 transition-all checked:border-blue-600 checked:bg-white"
                          />
                          {isSelected && (
                            <div className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600"></div>
                          )}
                        </div>
                      </label>
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </div>
      <OutletSelector />
    </div>
  );
};

export default HeaderActions;
