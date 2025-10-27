import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { setLocalAppliedFilters } from "../../redux/filtersSlice";
import {
  setAllBrands,
  setSelectedBrand,
  setSelectedSubBrands,
} from "../../redux/brandSelectionSlice";
import { saveBrandSelection } from "../../utils/brandSelectionStorage";
// import { fetchBrandHierarchy } from "../../redux/brandHierarchySlice";
import BrandSelector from "./BrandSelector";
import CountryFilter from "./CountryFilter";
import HeaderActions from "./HeaderActions";
import TopRightActions from "./TopRightActions";
import type { Brand } from "../../types";
import { fetchBrandHierarchyAPI } from "../../services/brandService";
import { useIndexedDB } from "../../helper/useIndexedDB";
import { brandHierarchy } from "../../data/brandHierarchy";

export default function BrandDashboardHeader() {
  const dispatch: AppDispatch = useDispatch();
  const { saveData, getData } = useIndexedDB();
  // const { brands, status } = useSelector(
  //   (state: RootState) => state.brandHierarchy
  // );
  const [brands, setBrands] = useState(brandHierarchy.brands);
  const localAppliedFilters = useSelector(
    (state: RootState) => state.filters.localAppliedFilters
  );
  const {
    selectedBrand,
    selectedSubBrands,
    selectedAllBrandWiseOutlets,
    multiSelectedBrands,
  } = useSelector((state: RootState) => state.brandSelection);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["All"]);
  const [showBrandArrows, setShowBrandArrows] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCurrencies] = useState<string[]>(["KWD"]);
  const [loadingNav, setLoadingNav] = useState<boolean>(false);

  const HIERARCHY_CACHE_KEY = "brandHierarchy";

  const initialSetup = useCallback(async (): Promise<void> => {
    let hierarchyData = await getData<{ brands: Brand[] }>(HIERARCHY_CACHE_KEY);
    if (hierarchyData) {
      console.log("Loaded brand hierarchy from cache for initial state.");
      // will replace the filter when outlets should be always array
      setBrands(
        hierarchyData.map((brand) => {
          return { ...brand, outlets: brand?.outlets || [] };
        })
      );
      initialBrandSetUp(hierarchyData);
    } else {
      setLoadingNav(true);
    }
    try {
      hierarchyData = await fetchBrandHierarchyAPI();
      // api disabled because percent sign in png
      // hierarchyData = brandHierarchy.brands;
      if (hierarchyData) {
        // Update cache
        await saveData(HIERARCHY_CACHE_KEY, hierarchyData);
        // will replace the filter when outlets should be always array

        setBrands(
          hierarchyData.map((brand) => {
            return { ...brand, outlets: brand?.outlets || [] };
          })
        );

        initialBrandSetUp(hierarchyData.brands);
        console.log("Brand hierarchy cache updated.");
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoadingNav(false);
    }
    // Then, fetch from the API for fresh data
  }, []);

  const initialBrandSetUp = (brands: Brand[]) => {
    // debugger;
    // will replace the filter when outlets should be always array
    dispatch(
      setAllBrands(
        brands.map((brand: Brand) => {
          return { ...brand, outlets: brand?.outlets || [] };
        })
      )
    );
    const initailOutlets = brands
      .filter((brand) => brand.name !== "All")
      .flatMap((outs) => outs.outlets)
      .flatMap((outlets) => outlets.name);

    const initailBrandWiseOutlets = brands
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
  };

  useEffect(() => {
    // if (brands.length > 0) {
    initialSetup();
    // }
  }, [initialSetup, dispatch]);

  useEffect(() => {
    if (selectedBrand) {
      saveBrandSelection({
        selectedBrand,
        selectedSubBrands,
        selectedAllBrandWiseOutlets,
        multiSelectedBrands,
      });
    }
  }, [
    selectedBrand,
    selectedSubBrands,
    selectedAllBrandWiseOutlets,
    multiSelectedBrands,
  ]);

  const clickedBrandIndex = brands.findIndex((b) => b.name === selectedBrand);
  const currentBrand = brands[clickedBrandIndex] || [];
  console.log("currentBrand", currentBrand);
  const outlets = currentBrand?.outlets?.map((o) => o.name) || [];
  console.log("multiSelectedBrands", multiSelectedBrands, selectedSubBrands);
  const getAvailableCountries = () => {
    if (multiSelectedBrands.length > 0) {
      const countries = brands
        .filter((brand) => multiSelectedBrands.includes(brand.name))
        .flatMap((brand) => brand.outlets)
        .flatMap((outlet) => outlet.countries);
      const uniqueCountries = Array.from(
        new Map(countries.map((c) => [c?.code, c])).values()
      );
      return uniqueCountries;
    }

    if (!currentBrand) {
      return [];
    }
    if (selectedSubBrands.length > 0 && currentBrand?.name !== "All") {
      const countries = currentBrand.outlets
        .filter((outlet) => selectedSubBrands.includes(outlet.name))
        .flatMap((outlet) => outlet.countries);

      const uniqueCountries = Array.from(
        new Map(countries.map((c) => [c.code, c])).values()
      );
      return uniqueCountries;
    }
    const allOutletCountries = brands
      .flatMap((outlet) => outlet?.outlets)
      .flatMap((outlet) => outlet?.countries);
    const uniqueCountries = Array.from(
      new Map(allOutletCountries.map((c) => [c?.code, c])).values()
    );
    return uniqueCountries;
  };

  const availableCountries = getAvailableCountries();

  useEffect(() => {
    const existFilter = localAppliedFilters.find(
      (f) => f.filterId === "region-filter"
    );
    if (existFilter) {
      setSelectedCountries(
        Array.isArray(existFilter.value) &&
          existFilter.value.length > 1 &&
          existFilter.value.includes("All")
          ? ["All"]
          : (existFilter?.value as string[])
      );
    }
    if (existFilter === undefined && localAppliedFilters?.length === 0) {
      setSelectedCountries(["All"]);
    }
  }, [localAppliedFilters]);

  const validRegionFilter = () => {
    countryFilterApply(availableCountries.map((val) => val.name));
  };

  useEffect(() => {
    validRegionFilter();
  }, [selectedSubBrands, selectedBrand]);

  const handleBrandDoubleClick = (
    index: number,
    e: React.MouseEvent,
    truth: boolean = false
  ) => {
    e.stopPropagation();
    const brandName = brands[truth ? 0 : index].name;
    const brand = brands.find((b) => b.name === brandName);
    if (brand) {
      const allOutlets = brand.outlets.map((o) => o.name);
      dispatch(
        setSelectedBrand({
          brandName,
          outlets: allOutlets,
          selectedAllBrandWiseOutlets: [{ brandName, outlets: allOutlets }],
        })
      );
    }
    setIsExpanded(!isExpanded);
    setShowBrandArrows(!showBrandArrows);
    setSelectedCountries(["All"]);
  };
  console.log("multiSelectedBrands", multiSelectedBrands);
  const handleBrandClick = (
    index: number,
    e: React.MouseEvent,
    truth: boolean = false
  ) => {
    e.stopPropagation();
    const brandName = brands[truth ? 0 : index].name;
    if (e.shiftKey) {
      const newSelection = multiSelectedBrands.includes(brandName)
        ? multiSelectedBrands.filter((b) => b !== brandName)
        : [...multiSelectedBrands, brandName];
      const selectedOutlets = newSelection?.map((out) => {
        const isExist = brands.find((aa) => aa.name === out);
        if (isExist) {
          return isExist.outlets.flatMap((a) => a.name);
        }
      });
      const selectedOutletsBrandWise = newSelection?.map((out) => {
        const isExist = brands.find((aa) => aa.name === out);
        if (isExist) {
          return {
            brandName: out,
            outlets: isExist.outlets.flatMap((a) => a.name),
          };
        }
      });
      dispatch(
        setSelectedBrand({
          brandName,
          outlets: selectedOutlets.flatMap((aa) => aa || []),
          selectedAllBrandWiseOutlets: selectedOutletsBrandWise.filter(
            Boolean
          ) as { brandName: string; outlets: string[] }[],
          multiSelectedBrands: newSelection,
        })
      );
    } else {
      const brand = brands.find((b) => b.name === brandName);
      if (brand) {
        const allOutlets = brand.outlets.map((o) => o.name);
        dispatch(
          setSelectedBrand({
            brandName,
            outlets: allOutlets,
            selectedAllBrandWiseOutlets: [{ brandName, outlets: allOutlets }],
            multiSelectedBrands: [brandName],
          })
        );
        // dispatch(setSelectedSubBrands([]));
      }
    }

    if (isExpanded) {
      setIsExpanded(false);
      setShowBrandArrows(false);
    }
    setSelectedCountries(["All"]);
  };

  const handleAdditionalBrandClick = (
    brandName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    let newSelection: string[];
    if (e.shiftKey) {
      newSelection = selectedSubBrands.includes(brandName)
        ? selectedSubBrands.filter((b) => b !== brandName)
        : [...selectedSubBrands, brandName];
    } else {
      newSelection =
        selectedSubBrands.includes(brandName) && selectedSubBrands.length === 1
          ? []
          : [brandName];
    }
    dispatch(setSelectedSubBrands(newSelection));
    setSelectedCountries(["All"]);
  };

  const handleCountryClick = (countryName: string) => {
    if (countryName === "All") {
      setSelectedCountries(["All"]);
      validRegionFilter();
    } else {
      if (selectedCountries.includes("All")) {
        countryFilterApply([countryName]);
        setSelectedCountries([countryName]);
      } else if (selectedCountries.includes(countryName)) {
        const newSelection = selectedCountries.filter((c) => c !== countryName);
        if (newSelection.length > 0) {
          countryFilterApply(newSelection);
        } else {
          validRegionFilter();
        }
        setSelectedCountries(newSelection.length > 0 ? newSelection : ["All"]);
      } else {
        countryFilterApply([...selectedCountries, countryName]);
        setSelectedCountries([...selectedCountries, countryName]);
      }
    }
  };

  const countryFilterApply = (country: string[]) => {
    let existingFilter = localAppliedFilters;
    const existing = existingFilter.find((f) => f.filterId === "region-filter");
    if (existing) {
      existingFilter = existingFilter.map((f) =>
        f.filterId === "region-filter" ? { ...f, value: country } : f
      );
    } else {
      existingFilter = [
        ...existingFilter,
        {
          filterId: "region-filter",
          value: country,
        },
      ];
    }
    dispatch(setLocalAppliedFilters(existingFilter));
  };

  const handleBackButtonClick = () => {
    setIsExpanded(false);
    setShowBrandArrows(false);
  };

  const handleCurrencyToggle = (currency: {
    name: string;
    code: string;
    flag: string;
  }) => {
    handleCountryClick(currency.name);
  };

  return (
    <div className="w-full bg-white">
      <div className="border-b border-gray-100 px-10 py-2">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex-1 min-w-0">
            <BrandSelector
              brands={brands.map((b) => ({ name: b.name, logo: b.logo }))}
              outlets={{ [selectedBrand]: outlets }}
              clickedBrandIndex={clickedBrandIndex}
              isExpanded={isExpanded}
              showBrandArrows={showBrandArrows}
              selectedSubBrands={selectedSubBrands}
              multiSelectedBrands={multiSelectedBrands}
              handleBrandClick={handleBrandClick}
              handleBrandDoubleClick={handleBrandDoubleClick}
              handleAdditionalBrandClick={handleAdditionalBrandClick}
              handleBackButtonClick={handleBackButtonClick}
              reset={initialSetup}
            />
          </div>
          <div className="flex-shrink-0">
            <TopRightActions isExpanded={isExpanded} />
          </div>
        </div>
      </div>
      <div className="border-b border-gray-200 px-10 py-3">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <CountryFilter
            availableCountries={availableCountries}
            selectedCountries={selectedCountries}
            handleCountryClick={handleCountryClick}
          />
          <HeaderActions
            selectedCurrencies={selectedCurrencies}
            availableCountries={availableCountries}
            selectedCountries={selectedCountries}
            handleCurrencyToggle={handleCurrencyToggle}
          />
        </div>
      </div>
    </div>
  );
}
