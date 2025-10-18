import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface BrandSelectionState {
  selectedBrand: string;
  selectedSubBrands: string[];
}

const initialState: BrandSelectionState = {
  selectedBrand: "All",
  selectedSubBrands: [],
};

const brandSelectionSlice = createSlice({
  name: "brandSelection",
  initialState,
  reducers: {
    setSelectedBrand(state, action: PayloadAction<string>) {
      state.selectedBrand = action.payload;
      state.selectedSubBrands = []; // Reset sub-brands when a new brand is selected
    },
    setSelectedSubBrands(state, action: PayloadAction<string[]>) {
      state.selectedSubBrands = action.payload;
    },
    setBrandSelection(state, action: PayloadAction<BrandSelectionState>) {
      state.selectedBrand = action.payload.selectedBrand;
      state.selectedSubBrands = action.payload.selectedSubBrands;
    },
  },
});

export const { setSelectedBrand, setSelectedSubBrands, setBrandSelection } =
  brandSelectionSlice.actions;
export default brandSelectionSlice.reducer;
