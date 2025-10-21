import React, { useState } from "react";
import { ChevronDown, Search, Store } from "lucide-react";

export default function OutletSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOutlets, setSelectedOutlets] = useState({
    active: {
      zero6: true,
      gate: true,
      ardiya: true,
      milk360: true,
      alkhobar: true,
      cocoa: true,
      slider: true,
    },
    closed: {},
  });

  const activeOutlets = [
    { id: "zero6", name: "Burger Boutique - Zero 6 Mall" },
    { id: "gate", name: "Burger Boutique - Gate Mall" },
    { id: "ardiya", name: "Burger Boutique - Ardiya" },
    { id: "milk360", name: "Milk Bun - 360 Mall" },
    { id: "alkhobar", name: "Burger Boutique - Al Khobar" },
    { id: "cocoa", name: "Cocoa Room - Ardiya" },
    { id: "slider", name: "Slider Station - Ardiya" },
  ];

  const closedOutlets = [
    { id: "jahra", name: "Burger Boutique Jahra" },
    { id: "brw360", name: "BRW - 360 Mall" },
  ];

  const toggleOutlet = (type, id) => {
    setSelectedOutlets((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id],
      },
    }));
  };

  const toggleAllActive = () => {
    const allSelected = activeOutlets.every(
      (o) => selectedOutlets.active[o.id]
    );
    const newState = {};
    activeOutlets.forEach((o) => {
      newState[o.id] = !allSelected;
    });
    setSelectedOutlets((prev) => ({
      ...prev,
      active: newState,
    }));
  };

  const toggleAllClosed = () => {
    const allSelected = closedOutlets.every(
      (o) => selectedOutlets.closed[o.id]
    );
    const newState = {};
    closedOutlets.forEach((o) => {
      newState[o.id] = !allSelected;
    });
    setSelectedOutlets((prev) => ({
      ...prev,
      closed: newState,
    }));
  };

  const getSelectedCount = () => {
    const activeCount = Object.values(selectedOutlets.active).filter(
      Boolean
    ).length;
    const closedCount = Object.values(selectedOutlets.closed).filter(
      Boolean
    ).length;
    return activeCount + closedCount;
  };

  const filterOutlets = (outlets) => {
    return outlets.filter((o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const allActiveSelected = activeOutlets.every(
    (o) => selectedOutlets.active[o.id]
  );
  const allClosedSelected = closedOutlets.every(
    (o) => selectedOutlets.closed[o.id]
  );

  return (
    <div className="w-full">
      <div className="relative inline-block">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Store className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-700">
            {getSelectedCount()} Outlets
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute top-full mt-2 right-0 w-96 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-[500px] overflow-hidden flex flex-col">
            {/* Search Bar */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Outlets"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto">
              {/* All Active Outlets */}
              <div className="p-3">
                <label className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded cursor-pointer group">
                  <span className="font-semibold text-gray-700">
                    All Active Outlets
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={allActiveSelected}
                      onChange={toggleAllActive}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </label>
              </div>

              {/* Active Outlets List */}
              <div className="px-3 pb-3 space-y-1">
                {filterOutlets(activeOutlets).map((outlet) => (
                  <label
                    key={outlet.id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{outlet.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedOutlets.active[outlet.id] || false}
                      onChange={() => toggleOutlet("active", outlet.id)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* All Closed Outlets */}
              <div className="p-3">
                <label className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded cursor-pointer group">
                  <span className="font-semibold text-gray-400">
                    All Closed Outlets
                  </span>
                  <input
                    type="checkbox"
                    checked={allClosedSelected}
                    onChange={toggleAllClosed}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* Closed Outlets List */}
              <div className="px-3 pb-3 space-y-1">
                {filterOutlets(closedOutlets).map((outlet) => (
                  <label
                    key={outlet.id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">{outlet.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedOutlets.closed[outlet.id] || false}
                      onChange={() => toggleOutlet("closed", outlet.id)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
