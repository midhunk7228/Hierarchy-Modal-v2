import { useState, useRef, use, useEffect } from "react";
import {
  MapPin,
  Globe,
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
  Ellipsis,
  X,
  Calendar,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { setLocalAppliedFilters } from "../redux/filtersSlice";

export default function BrandDashboardHeader() {
  const dispatch = useDispatch();
  const localAppliedFilters = useSelector(
    (state: RootState) => state.filters.localAppliedFilters
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["All"]);
  const [showBrandArrows, setShowBrandArrows] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [clickedBrandIndex, setClickedBrandIndex] = useState(0);
  const [selectedAdditionalBrand, setSelectedAdditionalBrand] = useState<
    string | null
  >(null);
  const [openDatePopup, setOpenDatePopup] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-03-01",
    endDate: "2025-03-31",
  });
  const [openCurrencyPopup, setOpenCurrencyPopup] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([
    "KWD",
  ]);
  const brandScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existFilter = localAppliedFilters.find(
      (f) => f.filterId === "region-filter"
    );
    if (existFilter) {
      //   debugger;
      setSelectedCountries(existFilter?.value);
    }
    if (existFilter === undefined && localAppliedFilters?.length === 0) {
      setSelectedCountries(["All"]);
    }
  }, [localAppliedFilters]);

  console.log("localAppliedFiltersKKJ", localAppliedFilters, selectedCountries);
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

  // Define countries available for each brand
  const brandCountries = {
    All: [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "Qatar", flag: "🇶🇦", code: "qa" },
      { name: "Oman", flag: "🇴🇲", code: "om" },
      { name: "Saudi", flag: "🇸🇦", code: "sa" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
      { name: "Bahrain", flag: "🇧🇭", code: "bh" },
      { name: "UK", flag: "🇬🇧", code: "uk" },
      { name: "Germany", flag: "🇩🇪", code: "de" },
    ],
    "Burger-Boutique": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "Qatar", flag: "🇶🇦", code: "qa" },
      { name: "Oman", flag: "🇴🇲", code: "om" },
      { name: "Saudi", flag: "🇸🇦", code: "sa" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
      { name: "Bahrain", flag: "🇧🇭", code: "bh" },
    ],
    Brw: [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "Qatar", flag: "🇶🇦", code: "qa" },
      { name: "Oman", flag: "🇴🇲", code: "om" },
      { name: "Saudi", flag: "🇸🇦", code: "sa" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
      { name: "Bahrain", flag: "🇧🇭", code: "bh" },
    ],
    Roadside_Diner: [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "Saudi", flag: "🇸🇦", code: "sa" },
    ],
    Cocoa_Room: [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "Qatar", flag: "🇶🇦", code: "qa" },
      { name: "Oman", flag: "🇴🇲", code: "om" },
      { name: "Saudi", flag: "🇸🇦", code: "sa" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
      { name: "Bahrain", flag: "🇧🇭", code: "bh" },
    ],
    Midar: [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "Qatar", flag: "🇶🇦", code: "qa" },
      { name: "Oman", flag: "🇴🇲", code: "om" },
      { name: "Saudi", flag: "🇸🇦", code: "sa" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
      { name: "Bahrain", flag: "🇧🇭", code: "bh" },
    ],
    Meta: [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "Qatar", flag: "🇶🇦", code: "qa" },
      { name: "Oman", flag: "🇴🇲", code: "om" },
      { name: "Saudi", flag: "🇸🇦", code: "sa" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
      { name: "Bahrain", flag: "🇧🇭", code: "bh" },
    ],
    Nestle: [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "Qatar", flag: "🇶🇦", code: "qa" },
      { name: "Oman", flag: "🇴🇲", code: "om" },
      { name: "Bahrain", flag: "🇧🇭", code: "bh" },
    ],
    White_Robata: [
      { name: "All", flag: "🌍", code: "all" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
      { name: "Qatar", flag: "🇶🇦", code: "qa" },
    ],
    Slider_Station: [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Oman", flag: "🇴🇲", code: "om" },
      { name: "Saudi", flag: "🇸🇦", code: "sa" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
      { name: "Bahrain", flag: "🇧🇭", code: "bh" },
    ],
    // Additional brands countries
    "🏢 NVIDIA": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
    ],
    "🏢 Pepsi": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "Saudi", flag: "🇸🇦", code: "sa" },
    ],
    "🏢 P&G": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
      { name: "Qatar", flag: "🇶🇦", code: "qa" },
    ],
    "🏢 Samsung": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
    ],
    "🏢 McDonald's": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
    ],
    "🏢 Wendy's": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
    ],
    "🏢 Five Guys": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Saudi", flag: "🇸🇦", code: "sa" },
    ],
    "🏢 Shake Shack": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Kuwait", flag: "🇰🇼", code: "kw" },
      { name: "UAE", flag: "🇦🇪", code: "ae" },
      { name: "Saudi", flag: "🇸🇦", code: "sa" },
    ],
    "🏢 Starbucks": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Qatar", flag: "🇶🇦", code: "qa" },
      { name: "Bahrain", flag: "🇧🇭", code: "bh" },
    ],
    "🏢 Dunkin": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Qatar", flag: "🇶🇦", code: "qa" },
    ],
    "🏢 Costa": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Oman", flag: "🇴🇲", code: "om" },
    ],
    "🏢 Tim Hortons": [
      { name: "All", flag: "🌍", code: "all" },
      { name: "Bahrain", flag: "🇧🇭", code: "bh" },
      { name: "Oman", flag: "🇴🇲", code: "om" },
    ],
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
    setClickedBrandIndex(truth ? 0 : index);
    setIsExpanded(!isExpanded);
    setShowBrandArrows(!showBrandArrows);

    // Reset country selection and additional brand selection
    setSelectedCountries(["All"]);
    countryFilterApply([], true);
    setSelectedAdditionalBrand(null);
  };

  const handleAdditionalBrandClick = (
    brandName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedAdditionalBrand(brandName);
    setSelectedCountries(["All"]);
    countryFilterApply([], true);
  };

  // Handle country selection with multi-select logic
  const handleCountryClick = (countryName: string) => {
    if (countryName === "All") {
      // If "All" is clicked, select only "All"
      setSelectedCountries(["All"]);
      countryFilterApply([], true);
    } else {
      // If a specific country is clicked
      if (selectedCountries.includes("All")) {
        countryFilterApply([countryName], true);
        // If "All" was selected, replace it with the new country
        setSelectedCountries([countryName]);
        // dispatch(setLocalAppliedFilters(newFilters));
      } else if (selectedCountries.includes(countryName)) {
        // If country is already selected, deselect it
        const newSelection = selectedCountries.filter((c) => c !== countryName);
        countryFilterApply(newSelection.length > 0 ? newSelection : [], true);

        // If no countries left, default to "All"
        setSelectedCountries(newSelection.length > 0 ? newSelection : ["All"]);
      } else {
        countryFilterApply([...selectedCountries, countryName], true);

        // Add the country to selection
        setSelectedCountries([...selectedCountries, countryName]);
      }
    }
  };

  const countryFilterApply = (country: string[], add: boolean) => {
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
  const getAvailableCountries = () => {
    // If an additional brand is selected, show its countries
    if (selectedAdditionalBrand) {
      return brandCountries[selectedAdditionalBrand] || brandCountries.All;
    }

    // Otherwise, show the main brand's countries
    const currentBrand = brands[clickedBrandIndex]?.name || "All";
    return brandCountries[currentBrand] || brandCountries.All;
  };

  const scrollBrands = (direction: "left" | "right") => {
    if (brandScrollRef.current) {
      const scrollAmount = 300;
      brandScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const renderBrandLogos = () => {
    if (!isExpanded) {
      return brands.map((brand, index) => (
        <div
          key={`brand-${index}`}
          className="flex-shrink-0 cursor-pointer transition-opacity hover:opacity-70"
          onDoubleClick={(e) => {
            if (index === 0) return;
            handleBrandDoubleClick(index, e);
          }}
        >
          <img
            src={brand.logo}
            alt={brand.name}
            className="h-8 object-contain grayscale-0"
          />
        </div>
      ));
    }

    // Get the additional brands specific to the clicked brand
    const clickedBrand = brands[clickedBrandIndex];
    const additionalBrandNames =
      brandSpecificAdditionals[clickedBrand.name] || [];

    // Convert additional brand names to objects for consistent structure
    const additionalBrands = additionalBrandNames.map((name) => ({
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
      const originalIndex = brands.indexOf(brand);
      const isClicked = originalIndex === clickedBrandIndex;
      const isAdditionalBrand = brand.logo === null;
      const isSelectedAdditional = selectedAdditionalBrand === brand.name;

      return (
        <div
          key={`expanded-brand-${index}`}
          className={`flex-shrink-0 cursor-pointer ${
            isClicked
              ? "border-2 border-blue-400 rounded-lg p-1"
              : "grayscale-0 transition-opacity opacity-70 hover:opacity-100"
          } ${
            isSelectedAdditional
              ? "border-1 border-gray-300 rounded-4xl"
              : "grayscale-0 transition-opacity opacity-70 hover:opacity-100"
          }`}
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
                  isSelectedAdditional ? "opacity-100" : "opacity-30"
                }`}
              >
                {brand.name}
              </span>
            </div>
          ) : (
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-8 object-contain"
            />
          )}
        </div>
      );
    });
  };

  const handleCurrencyToggle = (currencyCode: string) => {
    setSelectedCurrencies((prev) => {
      if (prev.includes(currencyCode)) {
        return prev.filter((c) => c !== currencyCode);
      } else {
        return [...prev, currencyCode];
      }
    });
  };


  return (
    <div className="w-full bg-white">
      {/* Top Brand Bar */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand Logos with Navigation */}
          <div className="relative flex items-center flex-1 mx-6">
            {/* Left Arrow */}
            {showBrandArrows && (
              <button
                onClick={() => scrollBrands("left")}
                className="absolute left-0 z-10 -ml-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all"
                style={{ transform: "translateX(-50%)" }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {/* Scrollable Brand Container */}
            <div
              ref={brandScrollRef}
              className="flex items-center gap-8 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {renderBrandLogos()}
            </div>

            {/* Right Arrow */}
            {showBrandArrows && (
              <button
                onClick={() => scrollBrands("right")}
                className="absolute right-0 z-10 -mr-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all"
                style={{ transform: "translateX(50%)" }}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 relative">
            {/* <User className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" /> */}
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
          </div>
        </div>
      </div>

      {/* Country Filter Bar */}
      <div className="border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Country Filters */}
          <div className="flex items-center gap-3">
            {getAvailableCountries().map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountryClick(country.name)}
                className={`flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedCountries.includes(country.name)
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{country.flag}</span>
                <span>{country.name}</span>
              </button>
            ))}
          </div>

          {/* Right Side Info */}
          <div className="flex items-center gap-6">
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
            {/* <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">KWD 🇰🇼</span>
            </div> */}
            <div className="relative">
              <button
                onClick={() => setOpenCurrencyPopup(!openCurrencyPopup)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4 text-gray-600" />
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
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 min-w-54  ">
                  <div className="flex justify-end items-center mb-3">
                    <button
                      onClick={() => setOpenCurrencyPopup(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {getAvailableCountries()
                      .filter((country) => country.name !== "All")
                      .map((country) => {
                        const currency = currencyMapping[country.name];
                        if (!currency) return null;

                        return (
                          <label
                            key={country.code}
                            className="flex items-center justify-between py-1 px-1 hover:bg-gray-50 rounded-lg cursor-pointer"
                          >
                            <div className="flex items-center gap-1">
                              <span className="text-lg">{currency.flag}</span>
                              <span className="text-sm font-medium text-gray-700">
                                {country.name} - {currency.code}
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedCurrencies.includes(
                                currency.code
                              )}
                              onChange={() =>
                                handleCurrencyToggle(currency.code)
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </label>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
            {/* <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                29 Outlets
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
