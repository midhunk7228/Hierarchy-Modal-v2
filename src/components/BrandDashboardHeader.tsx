import { useState, useRef } from "react";
import {
  MapPin,
  Globe,
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
} from "lucide-react";

export default function BrandDashboardHeader() {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [showBrandArrows, setShowBrandArrows] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [clickedBrandIndex, setClickedBrandIndex] = useState(0);
  const [selectedAdditionalBrand, setSelectedAdditionalBrand] = useState<
    string | null
  >(null);
  const brandScrollRef = useRef<HTMLDivElement>(null);
  console.log("clickedBrandIndex", clickedBrandIndex);
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
    setSelectedCountry("All");
    setSelectedAdditionalBrand(null);
  };

  const handleAdditionalBrandClick = (
    brandName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedAdditionalBrand(brandName);
    setSelectedCountry("All");
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
              //   debugger;
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
          <div className="flex items-center gap-4">
            <User className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
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
                onClick={() => setSelectedCountry(country.name)}
                className={`flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedCountry === country.name
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
            <button className="text-gray-400 hover:text-gray-600">
              <span className="text-xl">⋯</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">KWD 🇰🇼</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                29 Outlets
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
