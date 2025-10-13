import React, { useEffect, useState } from "react";
import {
  Package,
  Tag,
  Folder,
  Smartphone,
  Phone,
  Tablet,
  Headphones,
  Gamepad2,
  Video,
  Zap,
  Flag,
  Globe,
  Store,
  ShoppingCart,
  Building2,
  GraduationCap,
  Factory,
  Cloud,
  Monitor,
  Code,
  Users,
  Crown,
  Megaphone,
  Truck,
  Server,
  Search,
  TrendingUp,
  Map,
  Calendar,
  Filter,
  X,
  Coins,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setCurrentNavigationPath } from "../redux/layoutSlice";
import { generateNavigationPathKey } from "../utils/navigationUtils";
import { IoLogoAmazon } from "react-icons/io5";

import type {
  DimensionItem,
  Modifier,
  ModifierValues,
  SelectedItems,
} from "../types";

// Improved Date Range Filter Component (from NavigationBar)
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

// Improved Generic Filter Component (from NavigationBar)
const GenericFilter: React.FC<{
  modifier: Modifier;
  onFilterChange: (value: string) => void;
  value?: string;
}> = ({ modifier, onFilterChange, value = "" }) => {
  return (
    <div className="flex items-center space-x-2 bg-slate-100 rounded-md p-2">
      <Filter className="w-4 h-4 text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder={modifier.displayText}
        className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none w-36"
      />
    </div>
  );
};

interface DimensionProps {
  data?: DimensionItem[];
}

const TopBar: React.FC<DimensionProps> = ({ data: propData }) => {
  const dispatch = useDispatch();
  const defaultData: DimensionItem[] = [
    {
      code: "APPLE",
      name: "Apple Inc.",
      icon: "apple",
      modifiers: [
        { code: "DATE_RANGE", displayText: "Date Range" },
        { code: "REVENUE_TYPE", displayText: "Revenue Type" },
      ],
      children: [
        {
          code: "APPLE_USA",
          name: "United States",
          icon: "flag-us",
          modifiers: [
            { code: "DATE_RANGE", displayText: "Period" },
            { code: "SEGMENT", displayText: "Business Segment" },
          ],
          children: [
            {
              code: "APPLE_USA_RETAIL",
              name: "Apple Stores",
              icon: "store",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Sales Period" },
                { code: "STORE_TYPE", displayText: "Store Type" },
              ],
            },
            {
              code: "APPLE_USA_ONLINE",
              name: "Online Sales",
              icon: "shopping-cart",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Sales Period" },
                { code: "CHANNEL", displayText: "Sales Channel" },
              ],
            },
            {
              code: "APPLE_USA_ENTERPRISE",
              name: "Enterprise Solutions",
              icon: "building-2",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Contract Period" },
              ],
            },
            {
              code: "APPLE_USA_EDUCATION",
              name: "Education Services",
              icon: "graduation-cap",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Academic Year" },
                { code: "INSTITUTION_TYPE", displayText: "Institution" },
              ],
            },
          ],
        },
        {
          code: "APPLE_CHINA",
          name: "China",
          icon: "flag-cn",
          modifiers: [
            { code: "DATE_RANGE", displayText: "Period" },
            { code: "REGION", displayText: "Chinese Region" },
          ],
          children: [
            {
              code: "APPLE_CHINA_RETAIL",
              name: "Apple Stores China",
              icon: "store",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "APPLE_CHINA_MANUFACTURING",
              name: "Manufacturing Partners",
              icon: "factory",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Production Period" },
                { code: "PARTNER", displayText: "Manufacturing Partner" },
              ],
            },
            {
              code: "APPLE_CHINA_ONLINE",
              name: "Tmall & Online",
              icon: "shopping-cart",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
          ],
        },
        {
          code: "APPLE_EUROPE",
          name: "Europe",
          icon: "flag-eu",
          modifiers: [
            { code: "DATE_RANGE", displayText: "Period" },
            { code: "COUNTRY", displayText: "European Country" },
          ],
          children: [
            {
              code: "APPLE_EUROPE_RETAIL",
              name: "European Stores",
              icon: "store",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "APPLE_EUROPE_ENTERPRISE",
              name: "B2B Solutions",
              icon: "building-2",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Contract Period" },
              ],
            },
            {
              code: "APPLE_EUROPE_SERVICES",
              name: "Digital Services",
              icon: "cloud",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
          ],
        },
        {
          code: "APPLE_JAPAN",
          name: "Japan",
          icon: "flag-jp",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "APPLE_JAPAN_RETAIL",
              name: "Apple Store Japan",
              icon: "store",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "APPLE_JAPAN_CARRIER",
              name: "Carrier Partnerships",
              icon: "phone",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Partnership Period" },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "MICROSOFT",
      name: "Microsoft Corporation",
      icon: "microsoft",
      modifiers: [
        { code: "DATE_RANGE", displayText: "Date Range" },
        { code: "PRODUCT_LINE", displayText: "Product Line" },
      ],
      children: [
        {
          code: "MICROSOFT_USA",
          name: "United States",
          icon: "flag-us",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "MICROSOFT_USA_CLOUD",
              name: "Azure Cloud Services",
              icon: "cloud",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
                { code: "SERVICE_TIER", displayText: "Service Tier" },
              ],
            },
            {
              code: "MICROSOFT_USA_SOFTWARE",
              name: "Software Licensing",
              icon: "package",
              modifiers: [
                { code: "DATE_RANGE", displayText: "License Period" },
              ],
            },
            {
              code: "MICROSOFT_USA_GAMING",
              name: "Xbox Gaming",
              icon: "gamepad-2",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Gaming Period" },
                { code: "PLATFORM", displayText: "Gaming Platform" },
              ],
            },
            {
              code: "MICROSOFT_USA_HARDWARE",
              name: "Surface Devices",
              icon: "tablet",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
          ],
        },
        {
          code: "MICROSOFT_INDIA",
          name: "India",
          icon: "flag-in",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "MICROSOFT_INDIA_SERVICES",
              name: "IT Services",
              icon: "monitor",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
            {
              code: "MICROSOFT_INDIA_SUPPORT",
              name: "Customer Support",
              icon: "headphones",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Support Period" },
              ],
            },
            {
              code: "MICROSOFT_INDIA_DEVELOPMENT",
              name: "R&D Centers",
              icon: "code",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Development Period" },
              ],
            },
          ],
        },
        {
          code: "MICROSOFT_GERMANY",
          name: "Germany",
          icon: "flag-de",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "MICROSOFT_GERMANY_ENTERPRISE",
              name: "Enterprise Sales",
              icon: "building-2",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "MICROSOFT_GERMANY_CONSULTING",
              name: "Consulting Services",
              icon: "users",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Consulting Period" },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "AMAZON",
      name: "Amazon Inc.",
      icon: "amazon",
      modifiers: [
        { code: "DATE_RANGE", displayText: "Date Range" },
        { code: "BUSINESS_UNIT", displayText: "Business Unit" },
      ],
      children: [
        {
          code: "AMAZON_USA",
          name: "United States",
          icon: "flag-us",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "AMAZON_USA_ECOMMERCE",
              name: "E-commerce Platform",
              icon: "shopping-cart",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Sales Period" },
                { code: "CATEGORY", displayText: "Product Category" },
              ],
            },
            {
              code: "AMAZON_USA_AWS",
              name: "Amazon Web Services",
              icon: "cloud",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
                { code: "SERVICE_TYPE", displayText: "AWS Service" },
              ],
            },
            {
              code: "AMAZON_USA_PRIME",
              name: "Prime Membership",
              icon: "crown",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Membership Period" },
              ],
            },
            {
              code: "AMAZON_USA_ADVERTISING",
              name: "Advertising Services",
              icon: "megaphone",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Campaign Period" },
              ],
            },
            {
              code: "AMAZON_USA_LOGISTICS",
              name: "Fulfillment Centers",
              icon: "truck",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Fulfillment Period" },
              ],
            },
          ],
        },
        {
          code: "AMAZON_UK",
          name: "United Kingdom",
          icon: "flag-gb",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "AMAZON_UK_RETAIL",
              name: "Amazon.co.uk",
              icon: "shopping-cart",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "AMAZON_UK_AWS",
              name: "AWS Europe",
              icon: "cloud",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
            {
              code: "AMAZON_UK_FRESH",
              name: "Amazon Fresh",
              icon: "apple",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Delivery Period" },
              ],
            },
          ],
        },
        {
          code: "AMAZON_BRAZIL",
          name: "Brazil",
          icon: "flag-br",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "AMAZON_BRAZIL_MARKETPLACE",
              name: "Brazilian Marketplace",
              icon: "store",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "AMAZON_BRAZIL_LOGISTICS",
              name: "Local Delivery",
              icon: "truck",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Delivery Period" },
              ],
            },
          ],
        },
        {
          code: "AMAZON_AUSTRALIA",
          name: "Australia",
          icon: "flag-au",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "AMAZON_AUSTRALIA_RETAIL",
              name: "Amazon.com.au",
              icon: "shopping-cart",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
            {
              code: "AMAZON_AUSTRALIA_AWS",
              name: "AWS Australia",
              icon: "server",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
          ],
        },
      ],
    },
    {
      code: "GOOGLE",
      name: "Google (Alphabet)",
      icon: "google",
      modifiers: [
        { code: "DATE_RANGE", displayText: "Date Range" },
        { code: "REVENUE_STREAM", displayText: "Revenue Stream" },
      ],
      children: [
        {
          code: "GOOGLE_USA",
          name: "United States",
          icon: "flag-us",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "GOOGLE_USA_SEARCH",
              name: "Search & Ads",
              icon: "search",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Ad Period" },
                { code: "AD_TYPE", displayText: "Advertisement Type" },
              ],
            },
            {
              code: "GOOGLE_USA_CLOUD",
              name: "Google Cloud Platform",
              icon: "cloud",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
            {
              code: "GOOGLE_USA_YOUTUBE",
              name: "YouTube Revenue",
              icon: "video",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Content Period" },
                { code: "CONTENT_TYPE", displayText: "Content Type" },
              ],
            },
            {
              code: "GOOGLE_USA_HARDWARE",
              name: "Pixel & Nest",
              icon: "smartphone",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
          ],
        },
        {
          code: "GOOGLE_IRELAND",
          name: "Ireland",
          icon: "flag-ie",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "GOOGLE_IRELAND_EMEA",
              name: "EMEA Operations",
              icon: "globe",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Operations Period" },
              ],
            },
            {
              code: "GOOGLE_IRELAND_SALES",
              name: "International Sales",
              icon: "trending-up",
              modifiers: [{ code: "DATE_RANGE", displayText: "Sales Period" }],
            },
          ],
        },
        {
          code: "GOOGLE_SINGAPORE",
          name: "Singapore",
          icon: "flag-sg",
          modifiers: [{ code: "DATE_RANGE", displayText: "Period" }],
          children: [
            {
              code: "GOOGLE_SINGAPORE_APAC",
              name: "APAC Hub",
              icon: "map",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Regional Period" },
              ],
            },
            {
              code: "GOOGLE_SINGAPORE_CLOUD",
              name: "GCP Asia",
              icon: "server",
              modifiers: [
                { code: "DATE_RANGE", displayText: "Service Period" },
              ],
            },
          ],
        },
      ],
    },
  ];

  const data = propData || defaultData;
  const [navigationPath, setNavigationPath] = useState<DimensionItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [modifierValues, setModifierValues] = useState<ModifierValues>({});
  const [dateRange, setDateRange] = useState({
    startDate: "2025-03-01",
    endDate: "2025-03-31",
  });
  const [openDatePopup, setOpenDatePopup] = useState<number | null>(null);
  const [comparisonDate] = useState("Feb, 2025");

  const formatDateRangeForDisplay = (
    startDate: string,
    endDate: string
  ): string => {
    const format = (dateStr: string) => {
      if (!dateStr) return "?";
      const date = new Date(dateStr);
      // Adjust for timezone to avoid off-by-one day errors
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };
    return `${format(startDate)} - ${format(endDate)}`;
  };

  useEffect(() => {
    const pathKey = generateNavigationPathKey(navigationPath, modifierValues);
    dispatch(setCurrentNavigationPath(pathKey));
  }, [navigationPath, modifierValues, dispatch]);

  const getIcon = (level: number, iconName?: string): React.ReactNode => {
    if (iconName) {
      const iconMap: { [key: string]: React.ReactNode } = {
        // apple: <Zap className="w-4 h-4 text-yellow-400" />,
        apple: "🌏",
        microsoft: <Zap className="w-4 h-4 text-blue-400" />,
        amazon: <IoLogoAmazon className="w-4 h-4 text-orange-400" />,
        google: <Zap className="w-4 h-4 text-red-400" />,
        "flag-us": <Flag className="w-4 h-4 text-[#b22335]" />,
        "flag-cn": <Flag className="w-4 h-4 text-[#de2911]" />,
        "flag-eu": <Flag className="w-4 h-4 text-[#dade89]" />,
        "flag-jp": <Flag className="w-4 h-4" />,
        "flag-in": <Flag className="w-4 h-4 text-[#ff9933]" />,
        "flag-de": <Flag className="w-4 h-4 text-black" />,
        "flag-gb": <Flag className="w-4 h-4" />,
        "flag-br": <Flag className="w-4 h-4" />,
        "flag-au": <Flag className="w-4 h-4" />,
        "flag-ie": <Flag className="w-4 h-4" />,
        "flag-sg": <Flag className="w-4 h-4" />,
        store: <Store className="w-4 h-4 text-blue-500" />,
        "shopping-cart": <ShoppingCart className="w-4 h-4 text-amber-300" />,
        "building-2": <Building2 className="w-4 h-4" />,
        "graduation-cap": <GraduationCap className="w-4 h-4 text-black" />,
        factory: <Factory className="w-4 h-4" />,
        cloud: <Cloud className="w-4 h-4" />,
        monitor: <Monitor className="w-4 h-4" />,
        headphones: <Headphones className="w-4 h-4" />,
        code: <Code className="w-4 h-4" />,
        users: <Users className="w-4 h-4" />,
        package: <Package className="w-4 h-4" />,
        "gamepad-2": <Gamepad2 className="w-4 h-4" />,
        tablet: <Tablet className="w-4 h-4" />,
        crown: <Crown className="w-4 h-4" />,
        megaphone: <Megaphone className="w-4 h-4" />,
        truck: <Truck className="w-4 h-4" />,
        server: <Server className="w-4 h-4" />,
        search: <Search className="w-4 h-4" />,
        video: <Video className="w-4 h-4" />,
        smartphone: <Smartphone className="w-4 h-4" />,
        globe: <Globe className="w-4 h-4" />,
        "trending-up": <TrendingUp className="w-4 h-4" />,
        map: <Map className="w-4 h-4" />,
        phone: <Phone className="w-4 h-4" />,
      };
      return iconMap[iconName] || <Package className="w-4 h-4" />;
    }
    switch (level) {
      case 0:
        return <Package className="w-5 h-5" />;
      case 1:
        return <Tag className="w-5 h-5" />;
      case 2:
        return <Folder className="w-5 h-5" />;
      default:
        return <Folder className="w-4 h-4" />;
    }
  };

  const handleItemSelect = (item: DimensionItem, level: number): void => {
    if (navigationPath[level]?.code === item.code) {
      return;
    }
    const newPath = navigationPath.slice(0, level);
    newPath[level] = item;
    setNavigationPath(newPath);

    const newSelectedItems: SelectedItems = { ...selectedItems };
    newSelectedItems[level] = item.code;

    for (let i = level + 1; i < 10; i++) {
      delete newSelectedItems[i];
    }
    setSelectedItems(newSelectedItems);

    const newModifierValues: ModifierValues = { ...modifierValues };
    for (let i = level + 1; i < 10; i++) {
      delete newModifierValues[i];
    }
    setModifierValues(newModifierValues);

    const pathKey = generateNavigationPathKey(newPath, newModifierValues);
    dispatch(setCurrentNavigationPath(pathKey));
  };

  const handleModifierChange = (
    level: number,
    modifierCode: string,
    value: string | number | { startDate: string; endDate: string }
  ): void => {
    setModifierValues((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        [modifierCode]: value,
      },
    }));
  };

  const clearModifier = (level: number, modifierCode: string): void => {
    setModifierValues((prev) => {
      const newValues = { ...prev };
      if (newValues[level]) {
        delete newValues[level][modifierCode];
        if (Object.keys(newValues[level]).length === 0) {
          delete newValues[level];
        }
      }
      return newValues;
    });
  };

  const renderModifier = (
    modifier: Modifier,
    level: number
  ): React.ReactNode => {
    const currentValue = modifierValues[level]?.[modifier.code];

    switch (modifier.code) {
      case "DATE_RANGE":
        return (
          <DateRangeFilter
            key={modifier.code}
            onDateChange={(startDate, endDate) =>
              handleModifierChange(level, modifier.code, { startDate, endDate })
            }
            startDate={
              (currentValue as { startDate: string; endDate: string })
                ?.startDate || ""
            }
            endDate={
              (currentValue as { startDate: string; endDate: string })
                ?.endDate || ""
            }
          />
        );
      default:
        return (
          <GenericFilter
            key={modifier.code}
            modifier={modifier}
            onFilterChange={(value) =>
              handleModifierChange(level, modifier.code, value)
            }
            value={(currentValue as string) || ""}
          />
        );
    }
  };

  const getItemsForLevel = (level: number): DimensionItem[] => {
    if (level === 0) {
      return data;
    }
    const parentItem = navigationPath[level - 1];
    return parentItem?.children || [];
  };

  const maxLevel = Math.min(navigationPath.length + 1, 5);
  console.log("maxLevel", maxLevel);

  return (
    <div className="w-full bg-white mt-1">
      {/* New Navigation Area */}
      <div className=" ">
        {/* Always-visible Brand List */}
        <div className="flex items-center gap-2 py-3 px-6">
          {getItemsForLevel(0).map((brand) => {
            const isSelected = selectedItems[0] === brand.code;
            return (
              <button
                key={brand.code}
                onClick={() => handleItemSelect(brand, 0)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all font-bold 
                  ${
                    isSelected
                      ? "bg-gray-200 text-gray-600 shadow-sm border border-gray-300"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                  }
                `}
              >
                {getIcon(0, brand.icon)}
                <span>{brand.name}</span>
              </button>
            );
          })}
        </div>

        {/* Render deeper levels based on the navigation path */}
        {navigationPath.map((selectedItem, level) => {
          const children = getItemsForLevel(level + 1);

          return (
            <div key={selectedItem.code} className="">
              {/* Filters for the selected item */}
              {selectedItem.modifiers && selectedItem.modifiers.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 border-t border-gray-100 px-6 bg-[#f3f4f6] py-2 justify-between">
                  <span className="text-base font-medium text-gray-500 pr-8">
                    {selectedItem.name} Filters:
                  </span>

                  <div className="flex items-center gap-3 ">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenDatePopup(
                            openDatePopup === level ? null : level
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {formatDateRangeForDisplay(
                            dateRange.startDate,
                            dateRange.endDate
                          )}
                        </span>
                      </button>
                      {openDatePopup === level && (
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
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Comparison:</span>
                      <span className="font-medium">{comparisonDate}</span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Coins className="w-4 h-4" />
                      <span className="font-medium">Thousands</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                      <span>+</span>
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Children of the selected item */}
              {children.length > 0 && (
                <div className="flex items-center gap-2 mb-3 bg-white mt-3 px-6">
                  {children.map((childItem) => {
                    const isChildSelected =
                      selectedItems[level + 1] === childItem.code;
                    return (
                      <button
                        key={childItem.code}
                        onClick={() => handleItemSelect(childItem, level + 1)}
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all font-bold
                          ${
                            isChildSelected
                              ? "bg-gray-200 text-gray-600 shadow-sm border border-gray-300"
                              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                          }
                        `}
                      >
                        {getIcon(level + 1, childItem.icon)}
                        <span>{childItem.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dashboard Title and Controls */}
      {/* <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">
          Finance Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsDatePopupOpen(!isDatePopupOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {formatDateRangeForDisplay(
                  dateRange.startDate,
                  dateRange.endDate
                )}
              </span>
            </button>
            {isDatePopupOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 w-80">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-800">
                    Select Date Range
                  </h4>
                  <button
                    onClick={() => setIsDatePopupOpen(false)}
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
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Comparison:</span>
            <span className="font-medium">{comparisonDate}</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Coins className="w-4 h-4" />
            <span className="font-medium">Thousands</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
            <span>+</span>
            <span>Filter</span>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default TopBar;
