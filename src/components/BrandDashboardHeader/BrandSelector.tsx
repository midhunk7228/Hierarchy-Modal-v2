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
  multiSelectedBrands: string[];
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
  reset: () => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({
  brands,
  outlets,
  clickedBrandIndex,
  isExpanded,
  showBrandArrows,
  selectedSubBrands,
  multiSelectedBrands,
  handleBrandClick,
  handleBrandDoubleClick,
  handleAdditionalBrandClick,
  handleBackButtonClick,
  reset,
}) => {
  const brandScrollRef = useRef<HTMLDivElement>(null);
  const organizationId = 3;
  const baseURL = import.meta.env.VITE_BASE_URL;

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
        <div className="flex items-center gap-4 expanded-container">
          {/* Main expanded brand - matching inactive style */}
          <div
            key={`expanded-brand-${clickedBrandIndex}`}
            className="flex-shrink-0 cursor-pointer select-none group brand-item"
            style={{ opacity: 0.3 }}
            onDoubleClick={(e) =>
              handleBrandDoubleClick(clickedBrandIndex, e, true)
            }
          >
            <img
              src={`${baseURL}/clients/${organizationId}/${encodeURIComponent(
                clickedBrand.logo.replace(/^\//, "")
              )}`}
              alt={clickedBrand.name}
              className="h-7 object-contain pointer-events-none brand-logo"
              draggable="false"
              style={{
                filter: "grayscale(100%)",
              }}
            />
          </div>

          {/* Vertical divider */}
          <div
            className="h-5 w-px flex-shrink-0"
            style={{ backgroundColor: "#E0E0E0" }}
          />

          {/* Sub-brands/Outlets */}
          <div className="flex items-center gap-3">
            {additionalBrands.map((brand, index) => {
              const isSelectedAdditional = selectedSubBrands.includes(
                brand.name
              );
              return (
                <div
                  key={`additional-brand-${index}`}
                  className="flex-shrink-0 cursor-pointer select-none outlet-item"
                  style={{
                    opacity: isSelectedAdditional ? 1 : 0.35,
                  }}
                  onClick={(e) => handleAdditionalBrandClick(brand.name, e)}
                >
                  <div
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md outlet-bg"
                    style={{
                      backgroundColor: isSelectedAdditional
                        ? "#F5F5F5"
                        : "transparent",
                    }}
                  >
                    <span
                      className="outlet-icon"
                      style={{
                        fontSize: "0.75rem",
                        opacity: isSelectedAdditional ? 0.6 : 0.4,
                      }}
                    >
                      🏢
                    </span>
                    <span
                      className="text-xs font-medium whitespace-nowrap outlet-text"
                      style={{
                        color: isSelectedAdditional ? "#212121" : "#9E9E9E",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {brand.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return brands.map((brand, index) => {
      const isSelected =
        multiSelectedBrands.length === 0
          ? brand.name === "All"
            ? true
            : false
          : multiSelectedBrands.includes(brand.name);

      return (
        <div
          key={`brand-${index}`}
          className="flex-shrink-0 cursor-pointer select-none group brand-item"
          style={{
            opacity: isSelected ? 1 : 0.3,
          }}
          onClick={(e) => {
            if (index === 0) {
              reset();
              return;
            }
            handleBrandClick(index, e);
          }}
          onDoubleClick={(e) => {
            if (index === 0) return;
            handleBrandDoubleClick(index, e);
          }}
        >
          <img
            src={`${baseURL}/clients/${organizationId}/${encodeURIComponent(
              brand.logo.replace(/^\//, "")
            )}`}
            alt={brand.name}
            className="h-7 object-contain pointer-events-none brand-logo"
            draggable="false"
            style={{
              filter: isSelected ? "none" : "grayscale(100%)",
            }}
          />
        </div>
      );
    });
  };

  return (
    <div
      className="relative flex w-full items-center gap-4 py-2 select-none h-6"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {showBrandArrows && (
        <button
          onClick={handleBackButtonClick}
          className="flex-shrink-0 select-none opacity-40 back-button-animate back-button"
          style={{
            color: "#9E9E9E",
          }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <div
        ref={brandScrollRef}
        className="scrollbar-hide flex items-center gap-6 overflow-x-auto flex-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {renderBrandLogos()}
      </div>
      <style>{`
        /* Hardware acceleration for smooth animations */
        .brand-item,
        .outlet-item,
        .back-button,
        .brand-logo,
        .outlet-bg,
        .expanded-container {
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-font-smoothing: subpixel-antialiased;
        }

        /* Ultra-smooth transitions with refined easing */
        .brand-item {
          transition: opacity 0.25s cubic-bezier(0.4, 0.0, 0.2, 1),
                      transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .brand-logo {
          transition: filter 0.3s cubic-bezier(0.4, 0.0, 0.2, 1),
                      transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .outlet-item {
          transition: opacity 0.25s cubic-bezier(0.4, 0.0, 0.2, 1),
                      transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .outlet-bg {
          transition: background-color 0.2s cubic-bezier(0.4, 0.0, 0.2, 1),
                      transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .outlet-icon,
        .outlet-text {
          transition: opacity 0.2s cubic-bezier(0.4, 0.0, 0.2, 1),
                      color 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .back-button {
          transition: opacity 0.25s cubic-bezier(0.4, 0.0, 0.2, 1),
                      transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1),
                      color 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        /* Smooth hover effects */
        .group:hover {
          opacity: 0.7 !important;
          transform: translateY(-1px);
        }

        .group:active {
          transform: translateY(0) scale(0.98);
          transition: transform 0.1s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .outlet-item:hover {
          opacity: 0.7 !important;
          transform: translateY(-1px);
        }

        .outlet-item:active {
          transform: translateY(0) scale(0.98);
          transition: transform 0.1s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .outlet-item:hover .outlet-bg {
          background-color: #FAFAFA !important;
          transform: scale(1.02);
        }

        .back-button:hover {
          opacity: 1 !important;
          transform: translateX(-2px);
        }

        .back-button:active {
          transform: translateX(0) scale(0.95);
          transition: transform 0.1s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        /* Hide scrollbar */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Unified, continuous container animation */
        @keyframes expandContainerIn {
          0% {
            opacity: 0;
            transform: translateX(-8px) scale(0.98) translateZ(0);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1) translateZ(0);
          }
        }

        @keyframes backButtonIn {
          0% {
            opacity: 0;
            transform: translateX(8px) translateZ(0);
          }
          100% {
            opacity: 0.4;
            transform: translateX(0) translateZ(0);
          }
        }

        /* Apply animation to entire container as one solid unit */
        .expanded-container {
          animation: expandContainerIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .back-button-animate {
          animation: backButtonIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Prevent flash of unstyled content */
        @media (prefers-reduced-motion: reduce) {
          .brand-item,
          .outlet-item,
          .back-button,
          .brand-logo,
          .outlet-bg,
          .expanded-container {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BrandSelector;
