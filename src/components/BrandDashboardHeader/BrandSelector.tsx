import React, { useRef } from "react";
import { ChevronLeft } from "lucide-react";

interface Brand {
  name: string;
  logo: string;
}

interface BrandSelectorProps {
  brands: Brand[];
  outlets: Record<string, string[]>;
  clickedBrandIndex: number;
  isExpanded: boolean;
  showBrandArrows: boolean;
  selectedSubBrands: string[];
  handleBrandClick: (
    index: number,
    e: React.MouseEvent,
    truth?: boolean
  ) => void;
  handleBrandDoubleClick: (
    index: number,
    e: React.MouseEvent,
    truth?: boolean
  ) => void;
  handleAdditionalBrandClick: (brandName: string, e: React.MouseEvent) => void;
  handleBackButtonClick: () => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({
  brands,
  outlets,
  clickedBrandIndex,
  isExpanded,
  showBrandArrows,
  selectedSubBrands,
  handleBrandClick,
  handleBrandDoubleClick,
  handleAdditionalBrandClick,
  handleBackButtonClick,
}) => {
  const brandScrollRef = useRef<HTMLDivElement>(null);

  const renderBrandLogos = () => {
    if (isExpanded) {
      const clickedBrand = brands[clickedBrandIndex];
      if (!clickedBrand) return null;

      const additionalBrandNames = outlets[clickedBrand.name] || [];
      const additionalBrands = additionalBrandNames.map((name) => ({
        name,
        logo: null,
      }));

      return (
        <div className="flex items-center gap-8">
          <div
            key={`expanded-brand-${clickedBrandIndex}`}
            className="flex-shrink-0 cursor-pointer rounded-lg p-1 grayscale-0 opacity-100 py-1 px-3 rounded-4xl"
            onDoubleClick={(e) =>
              handleBrandDoubleClick(clickedBrandIndex, e, true)
            }
          >
            <img
              src={clickedBrand.logo}
              alt={clickedBrand.name}
              className="h-6 object-contain"
            />
          </div>
          {additionalBrands.map((brand, index) => {
            const isSelectedAdditional = selectedSubBrands.includes(brand.name);
            return (
              <div
                key={`additional-brand-${index}`}
                className={`flex-shrink-0 cursor-pointer ${
                  isSelectedAdditional
                    ? "grayscale-0"
                    : "grayscale transition-all opacity-70 hover:opacity-100 hover:grayscale-0"
                }`}
                onClick={(e) => handleAdditionalBrandClick(brand.name, e)}
              >
                <div className="h-8 px-4 flex items-center justify-center">
                  <span
                    className={`text-sm font-medium ${
                      isSelectedAdditional
                        ? "opacity-100 border border-gray-300 rounded-4xl py-1 px-3 "
                        : "opacity-30"
                    }`}
                  >
                    🏢 {brand.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return brands.map((brand, index) => (
      <div
        key={`brand-${index}`}
        className={`flex-shrink-0 cursor-pointer transition-all ${
          index === clickedBrandIndex
            ? "grayscale-0 opacity-100"
            : "grayscale opacity-70 hover:opacity-100 hover:grayscale-0"
        }`}
        onClick={(e) => {
          if (index === 0) return;
          handleBrandClick(index, e);
        }}
        onDoubleClick={(e) => {
          if (index === 0) return;
          handleBrandDoubleClick(index, e);
        }}
      >
        <img src={brand.logo} alt={brand.name} className="h-6 object-contain" />
      </div>
    ));
  };

  return (
    <div className="relative flex flex-1 items-center md:w-auto md:mx-6">
      {showBrandArrows && (
        <button
          onClick={handleBackButtonClick}
          className="absolute left-0 z-10 -ml-4 p-2 transition-all"
          style={{ transform: "translateX(-50%)" }}
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 cursor-pointer" />
        </button>
      )}
      <div
        ref={brandScrollRef}
        className="scrollbar-hide flex items-center gap-8 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {renderBrandLogos()}
      </div>
    </div>
  );
};

export default BrandSelector;
