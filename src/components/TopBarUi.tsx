import React, { useState } from "react";
import {
  //   ChevronRight,
  Package,
  Flag,
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
  Headphones,
  Gamepad2,
  Video,
  //   Zap,
  Smartphone,
  Phone,
  Tablet,
  Globe,
  MoreHorizontal,
  //   Repeat,
  Coins,
} from "lucide-react";
import { IoLogoAmazon } from "react-icons/io5";

import type {
  DimensionItem,
  //   Modifier,
  ModifierValues,
  SelectedItems,
} from "../types";

interface DimensionProps {
  data?: DimensionItem[];
}

const TopBar: React.FC<DimensionProps> = ({ data: propData }) => {
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
          ],
        },
      ],
    },
  ];

  const data = propData || defaultData;
  const [navigationPath, setNavigationPath] = useState<DimensionItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [modifierValues, setModifierValues] = useState<ModifierValues>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate] = useState("Mar, 2025");
  const [comparisonDate] = useState("Feb, 2025");

  const getIcon = (iconName?: string): React.ReactNode => {
    if (iconName) {
      const iconMap: { [key: string]: React.ReactNode } = {
        apple: "🌏",
        // apple: <Zap className="w-4 h-4" />,
        microsoft: "🖥️",
        // microsoft: <Zap className="w-4 h-4" />,
        // amazon: "🛒",
        amazon: <IoLogoAmazon className="w-4 h-4 text-yellow-300" />,
        google: "🕵",
        // google: <Zap className="w-4 h-4" />,
        "flag-us": <Flag className="w-4 h-4" />,
        "flag-cn": <Flag className="w-4 h-4" />,
        "flag-eu": <Flag className="w-4 h-4" />,
        store: <Store className="w-4 h-4 b" />,
        "shopping-cart": <ShoppingCart className="w-4 h-4" />,
        "building-2": <Building2 className="w-4 h-4" />,
        "graduation-cap": <GraduationCap className="w-4 h-4" />,
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

    return <Package className="w-4 h-4" />;
  };

  const handleItemSelect = (item: DimensionItem, level: number): void => {
    const newPath = navigationPath.slice(0, level + 1);
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
  };

  const getItemsForLevel = (level: number): DimensionItem[] => {
    if (level === 0) {
      return data;
    }

    const parentItem = navigationPath[level - 1];
    return parentItem?.children || [];
  };

  const maxLevel = Math.min(navigationPath.length + 1, 5);
  console.log("maxLevelnavigationPath", navigationPath);
  console.log("maxLevel", maxLevel);
  return (
    <div className="w-full bg-white border-b border-gray- mt-1">
      {/* Navigation Pills */}
      <div className="px-6 py-3">
        {Array.from({ length: maxLevel }, (_, level) => {
          const items = getItemsForLevel(level);
          if (items.length === 0) return null;

          return (
            <div key={level} className="flex items-center gap-2 mb-3">
              {items.map((item: DimensionItem, index: number) => {
                const isSelected = selectedItems[level] === item.code;
                const isFirstInLevel = index === 0 && level === 0;

                return (
                  <button
                    key={item.code}
                    onClick={() => handleItemSelect(item, level)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${
                        isSelected
                          ? "bg-gray-200 text-gray-600 shadow-sm border border-gray-300"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                      }
                    `}
                  >
                    {isFirstInLevel && level === 0 && (
                      //   <Globe className="w-5 h-5" />
                      <span className="text-[20px] leading-none">🌏</span>
                    )}
                    {!isFirstInLevel && (
                      <span className="text-[20px] leading-none">
                        {getIcon(item.icon)}
                      </span>
                    )}
                    <span>{item.name}</span>
                  </button>
                );
              })}
              {/* {level === 0 && JSON.stringify(`jjj${items.length}`)} */}
              {level === 0 && items.length > 6 && (
                <button className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-white text-gray-400 hover:bg-gray-50 border border-gray-200">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Dashboard Title and Controls */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">
          Finance Dashboard
        </h1>

        <div className="flex items-center gap-3">
          {/* Filter Icon */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>

          {/* Date Picker */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{selectedDate}</span>
          </button>

          {/* Comparison */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Comparison:</span>
            <span className="font-medium">{comparisonDate}</span>
          </div>

          {/* Currency/Unit Selector */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Coins className="w-4 h-4" />
            <span className="font-medium">Thousands</span>
          </button>

          {/* Additional Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
            <span>+</span>
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Filter Panel (collapsible) */}
      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Active Filters
            </h3>
            {navigationPath.length > 0 ? (
              <div className="flex items-center flex-wrap gap-2">
                {navigationPath.map((item: DimensionItem, index: number) => (
                  <div
                    key={item.code}
                    className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200"
                  >
                    {getIcon(item.icon)}
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <button
                      onClick={() => {
                        const newPath = navigationPath.slice(0, index);
                        setNavigationPath(newPath);
                        const newSelected = { ...selectedItems };
                        for (let i = index; i < 10; i++) {
                          delete newSelected[i];
                        }
                        setSelectedItems(newSelected);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No filters applied</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
