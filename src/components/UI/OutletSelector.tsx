import { useState } from "react";

import { ChevronDown, Search, Store } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../redux/store";

import { setSelectedSubBrands } from "../../redux/brandSelectionSlice";

export default function OutletSelector() {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const { selectedSubBrands, selectedAllBrandWiseOutlets } = useSelector(
    (state: RootState) => state.brandSelection
  );

  const allOutlets = selectedAllBrandWiseOutlets.flatMap(
    (data) => data.outlets
  );

  const toggleOutlet = (outletName: string) => {
    const newSelection = selectedSubBrands.includes(outletName)
      ? selectedSubBrands.filter((c) => c !== outletName)
      : [...selectedSubBrands, outletName];

    dispatch(setSelectedSubBrands(newSelection));
  };

  const filterOutlets = (outlets: string[]) =>
    outlets.filter((o) => o.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50"
      >
        <Store className="w-4 h-4 text-gray-600" />
        <span className="text-xs font-medium text-gray-600">
          {selectedSubBrands?.length} Outlets
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 w-96 bg-white border border-gray-200 rounded shadow-lg z-20 max-h-[500px] overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Outlets"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300"
                />
              </div>
            </div>

            <div className="overflow-y-auto">
              <div className="p-3 pb-0">
                <div className="px-3 py-2 font-semibold text-sm text-gray-700">
                  All Active Outlets
                </div>
              </div>

              <div className="px-3 pb-3 space-y-1">
                {filterOutlets(allOutlets).map((outlet, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{outlet}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedSubBrands.includes(outlet)}
                      onChange={() => toggleOutlet(outlet)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-0"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
