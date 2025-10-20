import { useState, useRef, useEffect } from "react";
import {
  Globe,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  X,
  Calendar,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { setLocalAppliedFilters } from "../redux/filtersSlice";
import {
  setSelectedBrand,
  setSelectedSubBrands,
  setBrandSelection,
} from "../redux/brandSelectionSlice";
import {
  saveBrandSelection,
  loadBrandSelection,
} from "../utils/brandSelectionStorage";
import { getAvailableCountries } from "../utils/countryUtils";

export default function BrandDashboardHeader() {
  const dispatch = useDispatch();
  const localAppliedFilters = useSelector(
    (state: RootState) => state.filters.localAppliedFilters
  );
  const { selectedBrand, selectedSubBrands } = useSelector(
    (state: RootState) => state.brandSelection
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["All"]);
  const [showBrandArrows, setShowBrandArrows] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openDatePopup, setOpenDatePopup] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-03-01",
    endDate: "2025-03-31",
  });
  const [openCurrencyPopup, setOpenCurrencyPopup] = useState(false);
  const [selectedCurrencies] = useState<string[]>(["KWD"]);
  const brandScrollRef = useRef<HTMLDivElement>(null);

  console.log(
    "selectedBrand, selectedSubBrands",
    selectedBrand,
    selectedSubBrands
  );
  useEffect(() => {
    const loadState = async () => {
      const savedSelection = await loadBrandSelection();
      if (savedSelection) {
        dispatch(setBrandSelection(savedSelection));
      }
    };
    loadState();
  }, [dispatch]);

  useEffect(() => {
    if (selectedBrand) {
      saveBrandSelection({ selectedBrand, selectedSubBrands });
    }
  }, [selectedBrand, selectedSubBrands]);

  useEffect(() => {
    const existFilter = localAppliedFilters.find(
      (f) => f.filterId === "region-filter"
    );
    if (existFilter) {
      setSelectedCountries(
        Array.isArray(existFilter.value) &&
          existFilter.value.length > 1 &&
          existFilter.value.includes("All")
          ? ["All"]
          : (existFilter?.value as string[])
      );
    }
    if (existFilter === undefined && localAppliedFilters?.length === 0) {
      setSelectedCountries(["All"]);
    }
  }, [localAppliedFilters]);

  const validRegionFilter = () => {
    const availabelCountries = getAvailableCountries(
      selectedSubBrands,
      brands,
      clickedBrandIndex
    );
    countryFilterApply(
      availabelCountries.map(
        (val: { name: string; flag: string; code: string }) => val.name
      )
    );
  };

  useEffect(() => {
    validRegionFilter();
  }, [selectedSubBrands, selectedBrand]);

  const brands = [
    { name: "All", logo: "/all.png" },
    { name: "Burger-Boutique", logo: "/Burger_Boutique.png" },
    { name: "Brw", logo: "/BRW.png" },
    { name: "Roadside_Diner", logo: "/Roadside_Diner.png" },
    { name: "Cocoa_Room", logo: "/Cocoa_Room.png" },
    { name: "Midar", logo: "/Midar.png" },
    { name: "Meta", logo: "/Nomad_Fatpie.png" },
    { name: "Nestle", logo: "/Nestle.png" },
    { name: "White_Robata", logo: "/White_Robata.png" },
    { name: "Slider_Station", logo: "/Slider_Station.png" },
  ];
  const clickedBrandIndex = brands.findIndex((b) => b.name === selectedBrand);

  // Define different additional brands for each main brand (name only)
  const brandSpecificAdditionals = {
    All: ["🏢 NVIDIA", "🏢 Pepsi", "🏢 P&G", "🏢 Samsung"],
    "Burger-Boutique": [
      "🏢 McDonald's",
      "🏢 Wendy's",
      "🏢 Five Guys",
      "🏢 Shake Shack",
    ],
    Brw: ["🏢 Starbucks", "🏢 Dunkin", "🏢 Costa", "🏢 Tim Hortons"],
    Roadside_Diner: [
      "🏢 Denny's",
      "🏢 IHOP",
      "🏢 Waffle House",
      "🏢 Cracker Barrel",
    ],
    Cocoa_Room: ["🏢 Godiva", "🏢 Lindt", "🏢 Hershey's", "🏢 Ferrero"],
    Midar: ["🏢 Tesla", "🏢 BMW", "🏢 Mercedes", "🏢 Audi"],
    Meta: ["🏢 Google", "🏢 Apple", "🏢 Microsoft", "🏢 Amazon"],
    Nestle: ["🏢 Unilever", "🏢 P&G", "🏢 Kraft", "🏢 General Mills"],
    White_Robata: ["🏢 Nobu", "🏢 Zuma", "🏢 Sushi Samba", "🏢 Roka"],
    Slider_Station: [
      "🏢 White Castle",
      "🏢 Krystal",
      "🏢 Sonic",
      "🏢 Culver's",
    ],
  };
  const currencyMapping = {
    Kuwait: { code: "KWD", flag: "🇰🇼" },
    Qatar: { code: "QAR", flag: "🇶🇦" },
    Oman: { code: "OMR", flag: "🇴🇲" },
    Saudi: { code: "SAR", flag: "🇸🇦" },
    UAE: { code: "AED", flag: "🇦🇪" },
    Bahrain: { code: "BHD", flag: "🇧🇭" },
  };

  const DateRangeFilter: React.FC<{
    onDateChange: (startDate: string, endDate: string) => void;
    startDate?: string;
    endDate?: string;
  }> = ({ onDateChange, startDate = "", endDate = "" }) => {
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

  const handleBrandDoubleClick = (
    index: number,
    e: React.MouseEvent,
    truth: boolean = false
  ) => {
    e.stopPropagation();
    const brandName = brands[truth ? 0 : index].name;
    dispatch(setSelectedBrand(brandName));
    setIsExpanded(!isExpanded);
    setShowBrandArrows(!showBrandArrows);

    // Reset country selection and additional brand selection
    setSelectedCountries(["All"]);
  };

  const handleAdditionalBrandClick = (
    brandName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    let newSelection: string[];
    if (e.shiftKey) {
      newSelection = selectedSubBrands.includes(brandName)
        ? selectedSubBrands.filter((b) => b !== brandName)
        : [...selectedSubBrands, brandName];
    } else {
      newSelection =
        selectedSubBrands.includes(brandName) && selectedSubBrands.length === 1
          ? []
          : [brandName];
    }
    dispatch(setSelectedSubBrands(newSelection));
    setSelectedCountries(["All"]);
  };

  // Handle country selection with multi-select logic
  const handleCountryClick = (countryName: string) => {
    if (countryName === "All") {
      // If "All" is clicked, select only "All"
      setSelectedCountries(["All"]);
      //   countryFilterApply([], true);
      validRegionFilter();
    } else {
      // If a specific country is clicked
      if (selectedCountries.includes("All")) {
        countryFilterApply([countryName]);
        // If "All" was selected, replace it with the new country
        setSelectedCountries([countryName]);
        // dispatch(setLocalAppliedFilters(newFilters));
      } else if (selectedCountries.includes(countryName)) {
        // If country is already selected, deselect it
        const newSelection = selectedCountries.filter((c) => c !== countryName);
        if (newSelection.length > 0) {
          countryFilterApply(newSelection);
        } else {
          validRegionFilter();
        }

        // If no countries left, default to "All"
        setSelectedCountries(newSelection.length > 0 ? newSelection : ["All"]);
      } else {
        countryFilterApply([...selectedCountries, countryName]);
        // Add the country to selection
        setSelectedCountries([...selectedCountries, countryName]);
      }
    }
  };

  const countryFilterApply = (country: string[]) => {
    let existingFilter = localAppliedFilters;
    // if (localAppliedFilters?.length === 0) {
    //   const regionFilter = {
    //     filterId: "region-filter",
    //     value: country,
    //   };
    //   dispatch(setLocalAppliedFilters([regionFilter]));
    //   return;
    // }
    // const finalFilter = [];
    const existing = existingFilter.find((f) => f.filterId === "region-filter");
    if (existing) {
      existingFilter = existingFilter.map((f) =>
        f.filterId === "region-filter" ? { ...f, value: country } : f
      );
    } else {
      existingFilter = [
        ...existingFilter,
        {
          filterId: "region-filter",
          value: country,
        },
      ];
    }
    dispatch(setLocalAppliedFilters(existingFilter));
  };
  // Get countries for the currently selected brand or additional brand

  const scrollBrands = (direction: "left" | "right") => {
    if (brandScrollRef.current) {
      const scrollAmount = 300;
      brandScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  console.log("isExpanded", isExpanded);
  const renderBrandLogos = () => {
    if (!isExpanded) {
      return brands.map((brand, index) => (
        <div
          key={`brand-${index}`}
          className={`flex-shrink-0 cursor-pointer transition-all ${
            index === clickedBrandIndex
              ? "grayscale-0 opacity-100"
              : "grayscale opacity-70 hover:opacity-100 hover:grayscale-0"
          }`}
          onDoubleClick={(e) => {
            if (index === 0) return;
            handleBrandDoubleClick(index, e);
          }}
        >
          <img
            src={brand.logo}
            alt={brand.name}
            className="h-6 object-contain"
          />
        </div>
      ));
    }

    // Get the additional brands specific to the clicked brand
    const clickedBrand = brands[clickedBrandIndex];
    const additionalBrandNames =
      (brandSpecificAdditionals as Record<string, string[]>)[
        clickedBrand.name
      ] || [];

    // Convert additional brand names to objects for consistent structure
    const additionalBrands = additionalBrandNames.map((name: string) => ({
      name,
      logo: null,
    }));

    const expandedList = [
      ...brands.slice(0, clickedBrandIndex),
      brands[clickedBrandIndex],
      ...additionalBrands,
      ...brands.slice(clickedBrandIndex + 1),
    ];

    return expandedList.map((brand, index) => {
      const originalIndex = brands.findIndex((b) => b.name === brand.name);
      const isClicked = originalIndex === clickedBrandIndex;
      const isAdditionalBrand = brand.logo === null;
      const isSelectedAdditional = selectedSubBrands.includes(brand.name);
      return (
        <div
          key={`expanded-brand-${index}`}
          className={`flex-shrink-0 cursor-pointer ${
            isClicked
              ? "rounded-lg p-1 grayscale-0 opacity-100 py-1 px-3 rounded-4xl"
              : "grayscale transition-all opacity-70 hover:opacity-100 hover:grayscale-0"
          } ${isSelectedAdditional ? " grayscale-0" : ""}`}
          onDoubleClick={(e) => {
            if (originalIndex !== -1) {
              handleBrandDoubleClick(originalIndex, e, true);
            }
          }}
          onClick={(e) => {
            if (isAdditionalBrand) {
              handleAdditionalBrandClick(brand.name, e);
            }
          }}
        >
          {isAdditionalBrand ? (
            <div className="h-8 px-4 flex items-center justify-center">
              <span
                className={`text-sm font-medium ${
                  isSelectedAdditional
                    ? "opacity-100 border border-gray-300 rounded-4xl py-1 px-3 "
                    : "opacity-30"
                }`}
              >
                {brand.name}
              </span>
            </div>
          ) : (
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-6 object-contain"
            />
          )}
        </div>
      );
    });
  };

  const handleCurrencyToggle = (currency: { code: string; name: string }) => {
    handleCountryClick(currency.name);
  };

  return (
    <div className="w-full bg-white">
      {/* Top Brand Bar */}
      <div className="border-b border-gray-200 px-4 py-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Brand Logos with Navigation */}
          <div className="relative flex flex-1 items-center md:w-auto md:mx-6">
            {/* Left Arrow */}
            {showBrandArrows && (
              <button
                onClick={() => scrollBrands("left")}
                className="absolute left-0 z-10 -ml-4 p-2 transition-all"
                style={{ transform: "translateX(-50%)" }}
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 cursor-pointer" />
              </button>
            )}

            {/* Scrollable Brand Container */}
            <div
              ref={brandScrollRef}
              className="scrollbar-hide flex items-center gap-8 overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {renderBrandLogos()}
            </div>

            {/* Right Arrow */}
            {showBrandArrows && (
              <button
                onClick={() => scrollBrands("right")}
                className="absolute right-0 z-10 -mr-4 p-2 transition-all"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 cursor-pointer" />
              </button>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="relative flex items-center gap-4 self-end md:self-center">
            {/* <User className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" /> */}
            <button
              onClick={() => setOpenDatePopup(openDatePopup === 0 ? null : 0)}
              className="flex items-center gap-2 rounded-lg bg-white text-gray-600 transition-colors"
            >
              <Ellipsis className="h-6 w-6 cursor-pointer" />
            </button>
            {openDatePopup === 0 && (
              <div className="absolute top-full right-0 z-10 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">
                    Select Date Range
                  </h4>
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
        </div>
      </div>

      {/* Country Filter Bar */}
      <div className="border-b border-gray-200 px-4 py-3 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          {/* Country Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {getAvailableCountries(
              selectedSubBrands,
              brands,
              clickedBrandIndex
            ).map((country: { name: string; flag: string; code: string }) => (
              <button
                key={country.code}
                onClick={() => handleCountryClick(country.name)}
                className={`flex items-center gap-2 rounded-full px-3 text-sm font-medium transition-all ${
                  selectedCountries.includes(country.name)
                    ? "border border-blue-200 bg-blue-50 text-blue-600"
                    : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{country.flag}</span>
                <span>{country.name}</span>
              </button>
            ))}
          </div>
          {/* Right Side Info */}
          <div className="flex items-center gap-4 self-end md:self-center">
            <button
              onClick={() => setOpenDatePopup(openDatePopup === 0 ? null : 0)}
              className="flex items-center gap-2 bg-white  text-gray-600 rounded-lg transition-colors"
            >
              <Ellipsis className="w-6 h-6 cursor-pointer" />
            </button>
            {openDatePopup === 0 && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 w-80">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-800">
                    Select Date Range
                  </h4>
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

            <div className="relative">
              <button
                onClick={() => setOpenCurrencyPopup(!openCurrencyPopup)}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-colors hover:bg-gray-100"
              >
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {selectedCurrencies.length > 0
                    ? selectedCurrencies.length === 1
                      ? `${selectedCurrencies[0]} ${
                          Object.values(currencyMapping).find(
                            (c) => c.code === selectedCurrencies[0]
                          )?.flag || ""
                        }`
                      : `${selectedCurrencies.length} Countries`
                    : "Select Country"}
                </span>
              </button>

              {openCurrencyPopup && (
                <div className="absolute top-full right-0 z-10 mt-2 min-w-54 rounded-lg border border-gray-200 bg-white p-4 shadow-xl  ">
                  <div className="mb-3 flex items-center justify-end">
                    <button
                      onClick={() => setOpenCurrencyPopup(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {getAvailableCountries(
                      selectedSubBrands,
                      brands,
                      clickedBrandIndex
                    )
                      .filter(
                        (country: { name: string }) => country.name !== "All"
                      )
                      .map(
                        (country: {
                          name: string;
                          flag: string;
                          code: string;
                        }) => {
                          const currency =
                            currencyMapping[
                              country.name as keyof typeof currencyMapping
                            ];
                          if (!currency) return null;
                          return (
                            <label
                              key={country.code}
                              className="flex cursor-pointer items-center justify-between rounded-lg py-1 px-1 hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-1">
                                <span className="text-lg">{currency.flag}</span>
                                <span className="text-sm font-medium text-gray-700">
                                  {country.name} - {currency.code}
                                </span>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedCountries.includes(
                                  country.name
                                )}
                                onChange={() => handleCurrencyToggle(country)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </label>
                          );
                        }
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
