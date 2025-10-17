import React, { useState } from "react";
import "./BrandHeader.css";
import type { Brand, SubNavItem } from "../types";

interface BrandHeaderProps {
  brands: Brand[];
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ brands }) => {
  const [expandedBrand, setExpandedBrand] = useState<Brand | null>(null);

  const handleDoubleClick = (brand: Brand) => {
    if (expandedBrand?.name === brand.name) {
      setExpandedBrand(null);
    } else {
      setExpandedBrand(brand);
    }
  };

  return (
    <div className="brand-header">
      <div className="brand-logos">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className={`brand-logo ${
              expandedBrand?.name === brand.name ? "expanded" : ""
            }`}
            onDoubleClick={() => handleDoubleClick(brand)}
          >
            <img src={brand.logo} alt={brand.name} />
          </div>
        ))}
      </div>
      {expandedBrand && (
        <div className="sub-nav">
          {expandedBrand.subItems.map((item: SubNavItem) => (
            <a key={item.name} href={item.path} className="sub-nav-item">
              {item.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandHeader;
