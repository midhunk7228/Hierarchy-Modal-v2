import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./filtersSlice";
import naviagtionPathReducer from "./navigationPathSlice";
import layoutReducer from "./layoutSlice";
import notificationsReducer from "./notificationsSlice";
import dashboardsReducer from "./dashboardsSlice";
import editModeReducer from "./editModeSlice";
import brandSelectionReducer from "./brandSelectionSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    navigationPath: naviagtionPathReducer,
    layout: layoutReducer,
    notifications: notificationsReducer,
    dashboards: dashboardsReducer,
    editMode: editModeReducer,
    brandSelection: brandSelectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
