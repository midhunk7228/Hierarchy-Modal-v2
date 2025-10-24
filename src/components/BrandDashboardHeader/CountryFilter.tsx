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

  const getFlagUrl = (flag: string) =>
    `${baseURL}/clients/${organizationId}/${encodeURIComponent(
      flag.replace(/^\//, "")
    )}`;

  return (
    <div className="flex flex-wrap gap-1.5">
      {availableCountries?.map(({ code, name, flag }) => (
        <button
          key={code}
          onClick={() => handleCountryClick(name)}
          className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium ${
            selectedCountries.includes(name)
              ? "bg-gray-700 text-white"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <img src={getFlagUrl(flag)} alt={name} className="h-3 w-auto" />
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
};

export default CountryFilter;
