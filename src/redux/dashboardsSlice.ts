import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardLayout } from "../DashbiardExampleProps";

interface DashboardsState {
  dashboards: DashboardLayout[];
  selectedDashboardId: string;
}

const initialState: DashboardsState = {
  dashboards: [],
  selectedDashboardId: "",
};

const dashboardsSlice = createSlice({
  name: "dashboards",
  initialState,
  reducers: {
    setDashboards: (state, action: PayloadAction<DashboardLayout[]>) => {
      state.dashboards = action.payload;
    },
    addDashboard: (state, action: PayloadAction<DashboardLayout>) => {
      state.dashboards.push(action.payload);
    },
    setSelectedDashboardId: (state, action: PayloadAction<string>) => {
      state.selectedDashboardId = action.payload;
    },
  },
});

export const { setDashboards, addDashboard, setSelectedDashboardId } =
  dashboardsSlice.actions;
export default dashboardsSlice.reducer;
