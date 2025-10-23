import React from "react";

interface Country {
  name: string;
  flag: string;
  code: string;
}

interface CountryFilterProps {
  availableCountries: Country[];
  selectedCountries: string[];
  handleCountryClick: (countryName: string) => void;
}

const CountryFilter: React.FC<CountryFilterProps> = ({
  availableCountries,
  selectedCountries,
  handleCountryClick,
}) => {
  const organizationId = 3;
  const baseURL = import.meta.env.VITE_BASE_URL;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {availableCountries?.map((country) => {
        return (
          <button
            key={country.code}
            onClick={() => handleCountryClick(country.name)}
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-all h-6 ${
              selectedCountries.includes(country?.name)
                ? "border border-blue-200 bg-blue-50 text-blue-600"
                : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {/* <span className="text-lg">{country?.flag}</span> */}
            <img
              src={`${baseURL}/clients/${organizationId}/${encodeURIComponent(
                country?.flag
              )}`}
              alt={country?.flag}
              className="object-cover h-4"
            />
            <span>{country?.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CountryFilter;
