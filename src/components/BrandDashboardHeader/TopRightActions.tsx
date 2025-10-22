import { useState } from "react";
import { Ellipsis, Store } from "lucide-react";
import MultiSelectDropdown, { Option } from "../UI/MultiSelectDropdown";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  setSelectedBrand,
  setSelectedSubBrands,
} from "../../redux/brandSelectionSlice";

// Example with images (for brands)
const brandOptions: Option[] = [
  {
    value: "burger-boutique",
    label: "Burger Boutique",
    image: "/Burger_Boutique.png",
  },
  { value: "brw", label: "BRW", image: "/BRW.png" },
  {
    value: "roadside-diner",
    label: "Roadside Diner",
    image: "/Roadside_Diner.png",
  },
  {
    value: "slider-station",
    label: "Slider Station",
    image: "/Slider_Station.png",
  },
  { value: "cocoa-room", label: "Cocoa Room", image: "/Cocoa_Room.png" },
  { value: "lazy-cat", label: "Lazy Cat", image: "/Lazy Cat.png" },
];

// Example with icons (for outlets)
const outletOptions: Option[] = [
  {
    value: "galleria-mall",
    label: "Slider Station - Galleria Mall",
    icon: <Store size={20} />,
  },
  {
    value: "ardiya",
    label: "Slider Station - Ardiya",
    icon: <Store size={20} />,
  },
  {
    value: "delivery-oman",
    label: "Slider Station - Delivery Oman",
    icon: <Store size={20} />,
  },
  {
    value: "seif-palace",
    label: "Slider Station - Seif Palace",
    icon: <Store size={20} />,
  },
];
export default function TopRightActions({
  isExpanded,
}: {
  isExpanded: boolean;
}) {
  const dispatch: AppDispatch = useDispatch();

  const {
    selectedSubBrands,
    selectedAllBrandWiseOutlets,
    selectedBrand,
    multiSelectedBrands,
    allBrands,
  } = useSelector((state: RootState) => state.brandSelection);
  console.log(
    "selectedSubBrands",
    selectedSubBrands,
    selectedAllBrandWiseOutlets,
    selectedBrand,
    multiSelectedBrands
  );
  const handleOutletSelect = (outletName: string) => {
    const newSelection = selectedSubBrands.filter((c) => c !== outletName);
    if (newSelection.length > 0) {
      dispatch(setSelectedSubBrands(outletName));
    } else {
      dispatch(setSelectedSubBrands([]));
    }
  };

  const handleBrandSelect = (newSelectionData: string[]) => {
    const newSelection =
      multiSelectedBrands?.length === 0 && newSelectionData.includes("All")
        ? newSelectionData.filter((item) => item !== "All")
        : newSelectionData;
    console.log("multiSelectedBrands", selectedAllBrandWiseOutlets);
    if (newSelection.includes("All")) {
      const initailOutlets = allBrands
        .filter((brand) => brand.name !== "All")
        .flatMap((outs) => outs.outlets)
        .flatMap((outlets) => outlets.name);

      const initailBrandWiseOutlets = allBrands
        .filter((brand) => brand.name !== "All")
        .map((brand) => ({
          brandName: brand.name,
          outlets: brand.outlets.map((outlet) => outlet.name),
        }));
      dispatch(
        setSelectedBrand({
          brandName: "All",
          outlets: initailOutlets,
          selectedAllBrandWiseOutlets: initailBrandWiseOutlets,
          multiSelectedBrands: [],
        })
      );
      return;
    }
    const selectedOutlets = newSelection?.map((out) => {
      const isExist = allBrands.find((aa) => aa.name === out);
      if (isExist) {
        return isExist.outlets.flatMap((a) => a.name);
      }
    });
    const selectedOutletsBrandWise = newSelection?.map((out) => {
      const isExist = allBrands.find((aa) => aa.name === out);
      if (isExist) {
        return {
          brandName: out,
          outlets: isExist.outlets.flatMap((a) => a.name),
        };
      }
    });
    dispatch(
      setSelectedBrand({
        brandName: ["All"],
        outlets: selectedOutlets.flatMap((aa) => aa || []),
        selectedAllBrandWiseOutlets: selectedOutletsBrandWise.filter(
          Boolean
        ) as { brandName: string; outlets: string[] }[],
        multiSelectedBrands: newSelection,
      })
    );
  };

  return (
    <div className="relative flex items-center gap-4 self-end md:self-center">
      <MultiSelectDropdown
        // To use for outlets, pass outletOptions and manage outlet selection state
        options={
          isExpanded
            ? selectedAllBrandWiseOutlets
                ?.flatMap((out) => out.outlets)
                .map((out) => {
                  return { label: out, value: out };
                })
            : allBrands.map((brand) => {
                return {
                  value: brand.name,
                  label: brand.name,
                  image: brand.logo,
                };
              })
        }
        selected={
          isExpanded
            ? selectedSubBrands
            : multiSelectedBrands?.length === 0
            ? ["All"]
            : multiSelectedBrands
        }
        onChange={(kk) => {
          if (!isExpanded) {
            handleBrandSelect(kk);
          } else {
            handleOutletSelect(kk);
          }
        }}
        title={isExpanded ? "Outlets" : "Brands"}
        trigger={
          <button className="flex items-center gap-2 rounded-lg bg-white text-gray-600 transition-colors">
            <Ellipsis className="h-6 w-6 cursor-pointer" />
          </button>
        }
      />
    </div>
  );
}
