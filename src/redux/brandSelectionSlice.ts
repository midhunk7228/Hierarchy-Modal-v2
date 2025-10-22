import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BrandChooseType } from "../types/brands";

export interface BrandSelectionState {
  selectedBrand: string;
  selectedSubBrands: string[];
  selectedAllBrandWiseOutlets: { brandName: string; outlets: string[] }[];
  multiSelectedBrands: string[];
}

const initialState: BrandSelectionState = {
  selectedBrand: "All",
  selectedSubBrands: [],
  selectedAllBrandWiseOutlets: [],
  multiSelectedBrands: [],
};

const brandSelectionSlice = createSlice({
  name: "brandSelection",
  initialState,
  reducers: {
    setSelectedBrand(state, action: PayloadAction<BrandChooseType>) {
      state.selectedBrand = action.payload.brandName;
      state.selectedSubBrands = action.payload.outlets;
      state.selectedAllBrandWiseOutlets =
        action.payload.selectedAllBrandWiseOutlets;
      state.multiSelectedBrands =
        action.payload?.multiSelectedBrands ?? state.multiSelectedBrands;
    },
    setSelectedSubBrands(state, action: PayloadAction<string[]>) {
      state.selectedSubBrands = action.payload;
    },
    setBrandSelection(state, action: PayloadAction<BrandSelectionState>) {
      state.selectedBrand = action.payload.selectedBrand;
      state.selectedSubBrands = action.payload.selectedSubBrands;
    },
    setMultiSelectedBrands(state, action: PayloadAction<string[]>) {
      state.multiSelectedBrands = action.payload;
    },
  },
});

export const {
  setSelectedBrand,
  setSelectedSubBrands,
  setBrandSelection,
  setMultiSelectedBrands,
} = brandSelectionSlice.actions;
export default brandSelectionSlice.reducer;
