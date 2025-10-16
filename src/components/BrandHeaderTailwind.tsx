import React, { useState } from 'react';

const BrandHeaderTailwind: React.FC = () => {
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  // Hardcoded brand data
  const brands = [
    {
      name: 'Nike',
      logo: '/Nike.png',
      subItems: ['Products', 'Collections', 'Sustainability', 'Team Sports', 'About Us']
    },
    {
      name: 'McDonalds',
      logo: '/McDonalds.png',
      subItems: ['Menu', 'Promotions', 'Nutrition', 'Locations', 'Franchising']
    },
    {
      name: 'Starbucks',
      logo: '/Starbucks.png',
      subItems: ['Coffee', 'Menu', 'Rewards', 'Gift Cards', 'Locations']
    },
    {
      name: 'Pepsi',
      logo: '/pepsi.png',
      subItems: ['Products', 'Promotions', 'Sustainability', 'About Us', 'Contact']
    },
    {
      name: 'Intel',
      logo: '/Intel.png',
      subItems: ['Products', 'Solutions', 'Support', 'Innovation', 'Partners']
    },
    {
      name: 'Coca-Cola',
      logo: '/coca-cola.png',
      subItems: ['Products', 'Brands', 'Sustainability', 'About Us', 'Investors']
    },
    {
      name: 'Netflix',
      logo: '/Netflix.png',
      subItems: ['Shows', 'Movies', 'New & Popular', 'My List', 'Browse by Languages']
    },
    {
      name: 'P&G',
      logo: '/pg.png',
      subItems: ['Brands', 'Products', 'Sustainability', 'Innovation', 'Careers']
    },
    {
      name: 'Mastercard',
      logo: '/Mastercard.png',
      subItems: ['Personal', 'Business', 'Developers', 'Partners', 'Security']
    },
    {
      name: 'NVIDIA',
      logo: '/NVIDIA.png',
      subItems: ['Products', 'Solutions', 'Industries', 'Support', 'Developers']
    },
    {
      name: 'Samsung',
      logo: '/Samsung.png',
      subItems: ['Mobile', 'TV & Audio', 'Home Appliances', 'Computing', 'Support']
    },
    {
      name: 'Nestle',
      logo: '/Nestle.png',
      subItems: ['Brands', 'Products', 'Nutrition', 'Sustainability', 'About Us']
    },
    {
      name: 'Louis Vuitton',
      logo: '/Louis.png',
      subItems: ['Women', 'Men', 'Art of Living', 'Magazine', 'Client Services']
    },
    {
      name: 'Meta',
      logo: '/Meta.png',
      subItems: ['Products', 'Technologies', 'Responsibility', 'About', 'Careers']
    },
    {
      name: 'Amazon',
      logo: '/Amazon.png',
      subItems: ['Shop', 'Prime', 'Devices', 'Services', 'About']
    },
    {
      name: 'Chevron',
      logo: '/Chevron.png',
      subItems: ['Operations', 'Technology', 'Sustainability', 'Investors', 'About']
    },
    {
      name: 'Tesla',
      logo: '/Tesla.png',
      subItems: ['Vehicles', 'Energy', 'Charging', 'Shop', 'Support']
    },
    {
      name: 'VISA',
      logo: '/VISA.png',
      subItems: ['Personal', 'Business', 'Partners', 'Security', 'About']
    },
    {
      name: 'Walmart',
      logo: '/Walmart.png',
      subItems: ['Shop', 'Grocery', 'Pharmacy', 'Registry', 'Services']
    }
  ];

  const handleDoubleClick = (brandName: string) => {
    if (expandedBrand === brandName) {
      setExpandedBrand(null);
    } else {
      setExpandedBrand(brandName);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Brand logos section */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className={`cursor-pointer transition-all ${
                expandedBrand === brand.name ? 'bg-gray-100 rounded-md' : ''
              }`}
              onDoubleClick={() => handleDoubleClick(brand.name)}
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-10 max-w-[100px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sub-navigation section */}
      {expandedBrand && (
        <div className="border-t border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-8">
            {brands.find(brand => brand.name === expandedBrand)?.subItems.map((item, index) => (
              <a 
                key={index} 
                href="#" 
                className="text-gray-700 hover:text-gray-900 hover:underline text-sm font-medium whitespace-nowrap"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandHeaderTailwind;