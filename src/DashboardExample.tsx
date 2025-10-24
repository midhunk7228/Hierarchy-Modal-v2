import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, ChartBarBig, Coins, Ellipsis, X } from "lucide-react";
import type {
  DashboardLayout,
  AppliedFilter,
  DashboardWidget,
  // ClickData,
  MatrixData,
} from "./DashbiardExampleProps";
import type { RootState } from "./redux/store";
import { setLayoutForPath, setLayoutLoading } from "./redux/layoutSlice";
import { layoutStorage } from "./utils/layoutStorage";
import { widgetStorage } from "./utils/widgetStorage";
import { useIndexedDB } from "./helper/useIndexedDB";
import MatrixDisplay from "./components/MatrixDisplay";
import WidgetEditor from "./components/WidgetEditor";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import WidgetPanel from "./components/WidgetPanel";
import { BarChart, PieChart, Table, DollarSign } from "lucide-react";
import { setDashboards, setSelectedDashboardId } from "./redux/dashboardsSlice";
import { dashboardStorage } from "./utils/dashboardStorage";
import { PrintableContainer } from "./components/PrintableContainer";

const ResponsiveGridLayout = WidthProvider(Responsive);
const predefinedWidgets = [
  {
    id: "revenue-widget",
    title: "Total Revenue",
    icon: <DollarSign className="w-8 h-8 text-green-500" />,
    defaultLayout: { w: 3, h: 2, minW: 2, minH: 2 },
    position: { row: 0, col: 0, width: 3, height: 2 },
    displayType: "summary",
    viewType: "single-value",
    apiEndpoint: "/api/summary",
    filters: [
      {
        id: "revenue-date-range",
        type: "date-range",
        label: "Date Range",
        field: "date",
        defaultValue: { start: "2024-01-01", end: "2024-12-31" },
      },
    ],
    inVisibleFilters: [
      {
        id: "revenue-date-range",
        type: "date-range",
        label: "Date Range",
        field: "date",
        defaultValue: { start: "2024-01-01", end: "2024-12-31" },
      },
      {
        id: "search-filter",
        type: "text",
        label: "Search",
        field: "name",
        placeholder: "Search by name...",
      },
      {
        id: "region-filter",
        type: "multi-select",
        label: "Regions",
        field: "name",
        options: [
          { label: "Kuwait", value: "Kuwait" },
          { label: "Saudi", value: "Saudi" },
          { label: "UK", value: "UK" },
          { label: "Germany", value: "Germany" },
          { label: "France", value: "France" },
          { label: "Spain", value: "Spain" },
          { label: "Poland", value: "Poland" },
        ],
      },
    ],
  },
  {
    id: "performance-chart-widget",
    title: "Performance Chart",
    icon: <BarChart className="w-8 h-8 text-blue-500" />,
    defaultLayout: { w: 4, h: 4, minW: 3, minH: 3 },
    position: { row: 0, col: 3, width: 3, height: 4 },
    displayType: "summary",
    viewType: "chart",
    apiEndpoint: "/api/performance",
    filters: [
      {
        id: "region-filter",
        type: "multi-select",
        label: "Regions",
        field: "name",
        options: [
          { label: "Kuwait", value: "Kuwait" },
          { label: "Saudi", value: "Saudi" },
          { label: "UK", value: "UK" },
          { label: "Germany", value: "Germany" },
          { label: "France", value: "France" },
          { label: "Spain", value: "Spain" },
          { label: "Poland", value: "Poland" },
        ],
      },
      {
        id: "outcome-filter",
        type: "select",
        label: "Outcome",
        field: "outcome",
        options: [
          { label: "All", value: "" },
          { label: "Positive", value: "positive" },
          { label: "Negative", value: "negative" },
        ],
      },
    ],
    inVisibleFilters: [
      {
        id: "revenue-range",
        type: "number-range",
        label: "Revenue Range",
        field: "revenue",
        min: 0,
        max: 1000000,
        defaultValue: { min: 100000, max: 800000 },
      },
      {
        id: "search-filter",
        type: "text",
        label: "Search",
        field: "name",
        placeholder: "Search by name...",
      },
      {
        id: "region-filter",
        type: "multi-select",
        label: "Regions",
        field: "name",
        options: [
          { label: "Kuwait", value: "Kuwait" },
          { label: "Saudi", value: "Saudi" },
          { label: "UK", value: "UK" },
          { label: "Germany", value: "Germany" },
          { label: "France", value: "France" },
          { label: "Spain", value: "Spain" },
        ],
      },
      {
        id: "outcome-filter",
        type: "select",
        label: "Outcome",
        field: "outcome",
        options: [
          { label: "All", value: "" },
          { label: "Positive", value: "positive" },
          { label: "Negative", value: "negative" },
        ],
      },
    ],
  },
  {
    id: "distribution-widget",
    title: "Market Distribution",
    icon: <PieChart className="w-8 h-8 text-purple-500" />,
    defaultLayout: { w: 3, h: 4, minW: 3, minH: 3 },
    displayType: "summary",
    viewType: "pie-chart",
    apiEndpoint: "/api/performance",
    position: { row: 0, col: 6, width: 3, height: 4 },
    filters: [
      {
        id: "category-date",
        type: "single-date",
        label: "Date",
        field: "date",
        defaultValue: "2024-01-15",
      },
    ],
    inVisibleFilters: [
      {
        id: "category-date",
        type: "single-date",
        label: "Date",
        field: "date",
        defaultValue: "2024-01-15",
      },
      {
        id: "region-filter",
        type: "multi-select",
        label: "Regions",
        field: "name",
        options: [
          { label: "Kuwait", value: "Kuwait" },
          { label: "Saudi", value: "Saudi" },
          { label: "UK", value: "UK" },
          { label: "Germany", value: "Germany" },
          { label: "France", value: "France" },
          { label: "Spain", value: "Spain" },
          { label: "Poland", value: "Poland" },
        ],
      },
    ],
  },
  {
    id: "details-table-widget",
    title: "Detailed Analytics",
    icon: <Table className="w-8 h-8 text-indigo-500" />,
    defaultLayout: { w: 12, h: 4, minW: 6, minH: 3 },
    displayType: "details",
    viewType: "tabular",
    apiEndpoint: "/api/metrics",
    position: { row: 4, col: 0, width: 12, height: 4 },
    additionalInfo: { outcome: true },
    filters: [
      {
        id: "region-filter",
        type: "multi-select",
        label: "Regions",
        field: "name",
        options: [
          { label: "Kuwait", value: "Kuwait" },
          { label: "Saudi", value: "Saudi" },
          { label: "UK", value: "UK" },
          { label: "Germany", value: "Germany" },
          { label: "France", value: "France" },
          { label: "Spain", value: "Spain" },
          { label: "Poland", value: "Poland" },
        ],
      },
      {
        id: "outcome-filter",
        type: "select",
        label: "Outcome",
        field: "outcome",
        options: [
          { label: "All", value: "" },
          { label: "Positive", value: "positive" },
          { label: "Negative", value: "negative" },
        ],
      },
    ],
    inVisibleFilters: [
      {
        id: "search-filter",
        type: "text",
        label: "Search",
        field: "name",
        placeholder: "Search by name...",
      },
      {
        id: "region-filter",
        type: "multi-select",
        label: "Regions",
        field: "name",
        options: [
          { label: "Kuwait", value: "Kuwait" },
          { label: "Saudi", value: "Saudi" },
          { label: "UK", value: "UK" },
          { label: "Germany", value: "Germany" },
          { label: "France", value: "France" },
          { label: "Spain", value: "Spain" },
        ],
      },
      {
        id: "outcome-filter",
        type: "select",
        label: "Outcome",
        field: "outcome",
        options: [
          { label: "All", value: "" },
          { label: "Positive", value: "positive" },
          { label: "Negative", value: "negative" },
        ],
      },
    ],
  },
  {
    id: "bar-graph-widget",
    title: "Bar Graph",
    icon: <ChartBarBig className="w-8 h-8 text-blue-500" />,
    defaultLayout: { w: 12, h: 4, minW: 6, minH: 3 },
    displayType: "details",
    viewType: "bar-graph",
    apiEndpoint: "/api/metrics",
    position: {
      row: 12,
      col: 0,
      width: 12,
      height: 6,
    },
    additionalInfo: { outcome: true },
  },
  {
    id: "bar-graph-widget-two",
    title: "Revenue Graph",
    icon: <ChartBarBig className="w-8 h-8 text-blue-500" />,
    defaultLayout: { w: 12, h: 4, minW: 6, minH: 3 },
    displayType: "details",
    viewType: "bar-two",
    apiEndpoint: "/api/metrics",
    position: {
      row: 12,
      col: 0,
      width: 6,
      height: 5,
    },
    additionalInfo: { outcome: true },
  },
];

const DEFAULT_DASHBOARD: DashboardLayout = {
  id: "default-dashboard",
  name: "Default Dashboard",
  description: "A comprehensive view of business metrics with filtering",
  grid: {
    columns: 12,
    rows: 8,
    gap: 16,
  },
  widgets: [
    {
      id: "widget-1",
      title: "Total Revenue",
      displayType: "summary",
      viewType: "single-value",
      position: { row: 0, col: 0, width: 3, height: 2 },
      apiEndpoint: "/api/summary",
      filters: [
        {
          id: "revenue-date-range",
          type: "date-range",
          label: "Date Range",
          field: "date",
          defaultValue: { start: "2024-01-01", end: "2024-12-31" },
        },
      ],
      inVisibleFilters: [
        {
          id: "revenue-date-range",
          type: "date-range",
          label: "Date Range",
          field: "date",
          defaultValue: { start: "2024-01-01", end: "2024-12-31" },
        },
        {
          id: "search-filter",
          type: "text",
          label: "Search",
          field: "name",
          placeholder: "Search by name...",
        },
        {
          id: "region-filter",
          type: "multi-select",
          label: "Regions",
          field: "name",
          options: [
            { label: "Kuwait", value: "Kuwait" },
            { label: "Saudi", value: "Saudi" },
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
            { label: "Poland", value: "Poland" },
          ],
        },
      ],
    },
    {
      id: "widget-2",
      title: "Regional Performance",
      displayType: "summary",
      viewType: "comparison",
      position: { row: 0, col: 3, width: 3, height: 4 },
      additionalInfo: { outcome: true },
      apiEndpoint: "/api/distribution",
      filters: [
        {
          id: "region-filter",
          type: "multi-select",
          label: "Regions",
          field: "name",
          options: [
            { label: "Kuwait", value: "Kuwait" },
            { label: "Saudi", value: "Saudi" },
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
            { label: "Poland", value: "Poland" },
          ],
        },
        {
          id: "outcome-filter",
          type: "select",
          label: "Outcome",
          field: "outcome",
          options: [
            { label: "All", value: "" },
            { label: "Positive", value: "positive" },
            { label: "Negative", value: "negative" },
          ],
        },
      ],
      inVisibleFilters: [
        {
          id: "search-filter",
          type: "text",
          label: "Search",
          field: "name",
          placeholder: "Search by name...",
        },
        {
          id: "region-filter",
          type: "multi-select",
          label: "Regions",
          field: "name",
          options: [
            { label: "Kuwait", value: "Kuwait" },
            { label: "Saudi", value: "Saudi" },
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
          ],
        },
        {
          id: "outcome-filter",
          type: "select",
          label: "Outcome",
          field: "outcome",
          options: [
            { label: "All", value: "" },
            { label: "Positive", value: "positive" },
            { label: "Negative", value: "negative" },
          ],
        },
      ],
    },
    {
      id: "widget-3",
      title: "Market Distribution",
      displayType: "summary",
      viewType: "pie-chart",
      position: { row: 0, col: 6, width: 3, height: 4 },
      apiEndpoint: "/api/performance",
      filters: [
        {
          id: "category-date",
          type: "single-date",
          label: "Date",
          field: "date",
          defaultValue: "2024-01-15",
        },
      ],
      inVisibleFilters: [
        {
          id: "category-date",
          type: "single-date",
          label: "Date",
          field: "date",
          defaultValue: "2024-01-15",
        },
        {
          id: "region-filter",
          type: "multi-select",
          label: "Regions",
          field: "name",
          options: [
            { label: "Kuwait", value: "Kuwait" },
            { label: "Saudi", value: "Saudi" },
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
            { label: "Poland", value: "Poland" },
          ],
        },
      ],
    },
    {
      id: "widget-4",
      title: "Performance Chart",
      displayType: "summary",
      viewType: "chart",
      position: { row: 0, col: 9, width: 3, height: 4 },
      apiEndpoint: "/api/comparison",
      filters: [
        {
          id: "revenue-range",
          type: "number-range",
          label: "Revenue Range",
          field: "revenue",
          min: 0,
          max: 1000000,
          defaultValue: { min: 100000, max: 800000 },
        },
      ],
      inVisibleFilters: [
        {
          id: "revenue-range",
          type: "number-range",
          label: "Revenue Range",
          field: "revenue",
          min: 0,
          max: 1000000,
          defaultValue: { min: 100000, max: 800000 },
        },
      ],
    },
    {
      id: "widget-5",
      title: "Regional Metrics",
      displayType: "summary",
      viewType: "comparison",
      position: { row: 2, col: 0, width: 6, height: 3 },
      additionalInfo: { outcome: true },
      apiEndpoint: "/api/regions",
      filters: [
        {
          id: "search-filter",
          type: "text",
          label: "Search",
          field: "name",
          placeholder: "Search by name...",
        },
      ],
      inVisibleFilters: [
        {
          id: "search-filter",
          type: "text",
          label: "Search",
          field: "name",
          placeholder: "Search by name...",
        },
        {
          id: "region-filter",
          type: "multi-select",
          label: "Regions",
          field: "name",
          options: [
            { label: "Kuwait", value: "Kuwait" },
            { label: "Saudi", value: "Saudi" },
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
          ],
        },
        {
          id: "outcome-filter",
          type: "select",
          label: "Outcome",
          field: "outcome",
          options: [
            { label: "All", value: "" },
            { label: "Positive", value: "positive" },
            { label: "Negative", value: "negative" },
          ],
        },
      ],
    },
    {
      id: "widget-6",
      title: "Detailed Analytics",
      displayType: "details",
      viewType: "tabular",
      position: { row: 4, col: 0, width: 12, height: 4 },
      additionalInfo: { outcome: true },
      apiEndpoint: "/api/metrics",
      filters: [
        {
          id: "revenue-date-range",
          type: "date-range",
          label: "Date Range",
          field: "date",
        },
        {
          id: "region-filter",
          type: "multi-select",
          label: "Region",
          field: "region",
          options: [
            { label: "Kuwait", value: "Kuwait" },
            { label: "Saudi", value: "Saudi" },
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
          ],
        },
        {
          id: "details-category",
          type: "select",
          label: "Category",
          field: "category",
          options: [
            { label: "All Categories", value: "" },
            { label: "Electronics", value: "Electronics" },
            { label: "Fashion", value: "Fashion" },
          ],
        },
      ],
      inVisibleFilters: [
        {
          id: "revenue-date-range",
          type: "date-range",
          label: "Date Range",
          field: "date",
        },
        {
          id: "region-filter",
          type: "multi-select",
          label: "Region",
          field: "region",
          options: [
            { label: "Kuwait", value: "Kuwait" },
            { label: "Saudi", value: "Saudi" },
            { label: "UK", value: "UK" },
            { label: "Germany", value: "Germany" },
            { label: "France", value: "France" },
            { label: "Spain", value: "Spain" },
            { label: "Poland", value: "Poland" },
          ],
        },
        {
          id: "details-category",
          type: "select",
          label: "Category",
          field: "category",
          options: [
            { label: "All Categories", value: "" },
            { label: "Electronics", value: "Electronics" },
            { label: "Fashion", value: "Fashion" },
          ],
        },
        {
          id: "outcome-filter",
          type: "select",
          label: "Outcome",
          field: "outcome",
          options: [
            { label: "All", value: "" },
            { label: "Positive", value: "positive" },
            { label: "Negative", value: "negative" },
          ],
        },
      ],
    },
  ],
};

const SAMPLE_DATA: MatrixData = {
  summary: {
    totalRevenue: 2450000,
    totalOrders: 15234,
    avgOrderValue: 160.85,
    growthRate: 12.5,
    regions: [
      {
        name: "UK",
        value: 45,
        revenue: 1102500,
        orders: 6855,
        outcome: "positive",
        date: "2024-01-15",
      },
      {
        name: "Germany",
        value: 25,
        revenue: 612500,
        orders: 3809,
        outcome: "positive",
        date: "2024-01-16",
      },
      {
        name: "France",
        value: 20,
        revenue: 490000,
        orders: 3047,
        outcome: "negative",
        date: "2024-01-17",
      },
      {
        name: "Spain",
        value: 10,
        revenue: 245000,
        orders: 1523,
        outcome: "positive",
        date: "2024-01-18",
      },
    ],
    categories: [
      {
        name: "Electronics",
        value: 850000,
        revenue: 850000,
        orders: 5300,
        percentage: 34.7,
        outcome: "positive",
        date: "2024-01-15",
      },
      {
        name: "Fashion",
        value: 735000,
        revenue: 735000,
        orders: 4590,
        percentage: 30.0,
        outcome: "positive",
        date: "2024-01-16",
      },
      {
        name: "Home & Garden",
        value: 490000,
        revenue: 490000,
        orders: 3060,
        percentage: 20.0,
        outcome: "negative",
        date: "2024-01-17",
      },
      {
        name: "Books",
        value: 245000,
        revenue: 245000,
        orders: 1530,
        percentage: 10.0,
        outcome: "positive",
        date: "2024-01-18",
      },
      {
        name: "Sports",
        value: 130000,
        revenue: 130000,
        orders: 812,
        percentage: 5.3,
        outcome: "negative",
        date: "2024-01-19",
      },
    ],
  },
  details: [
    {
      id: 1,
      region: "UK",
      category: "Electronics",
      revenue: 450000,
      orders: 2800,
      avgOrder: 160.71,
      growth: 15.2,
      outcome: "positive",
      date: "2024-01-15",
    },
    {
      id: 2,
      region: "UK",
      category: "Fashion",
      revenue: 380000,
      orders: 2375,
      avgOrder: 160.0,
      growth: 8.5,
      outcome: "positive",
      date: "2024-01-16",
    },
    {
      id: 3,
      region: "Germany",
      category: "Electronics",
      revenue: 280000,
      orders: 1750,
      avgOrder: 160.0,
      growth: 12.3,
      outcome: "positive",
      date: "2024-01-17",
    },
    {
      id: 4,
      region: "Germany",
      category: "Fashion",
      revenue: 220000,
      orders: 1375,
      avgOrder: 160.0,
      growth: -2.1,
      outcome: "negative",
      date: "2024-01-18",
    },
    {
      id: 5,
      region: "France",
      category: "Electronics",
      revenue: 180000,
      orders: 1125,
      avgOrder: 160.0,
      growth: -5.5,
      outcome: "negative",
      date: "2024-01-19",
    },
    {
      id: 6,
      region: "France",
      category: "Fashion",
      revenue: 160000,
      orders: 1000,
      avgOrder: 160.0,
      growth: 3.2,
      outcome: "positive",
      date: "2024-01-20",
    },
  ],
};

const JsonDrivenDashboard: React.FC = () => {
  // const { saveLayout, getLayout } = useIndexedDB();
  const dispatch = useDispatch();
  const { currentNavigationPath, layouts } = useSelector(
    (state: RootState) => state.layout
  );
  const dashboards = useSelector(
    (state: RootState) => state.dashboards.dashboards
  );
  const { isEditMode } = useSelector((state: RootState) => state.editMode);
  const { selectedSubBrands } = useSelector(
    (state: RootState) => state.brandSelection
  );
  const [currentDashboard, setCurrentDashboard] =
    useState<DashboardLayout>(DEFAULT_DASHBOARD);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(
    null
  );
  const [isWidgetEditorOpen, setIsWidgetEditorOpen] = useState(false);
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(false);
  const [widgetFilters, setWidgetFilters] = useState<
    Record<string, AppliedFilter[]>
  >({});
  const [openDatePopup, setOpenDatePopup] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-03-01",
    endDate: "2025-03-31",
  });
  const [comparisonDate] = useState("Feb, 2025");

  const [isInitialized, setIsInitialized] = useState(false);
  const selectedDashboard =
    useSelector((state: RootState) => state.dashboards.selectedDashboardId) ||
    "default-dashboard";

  const { getData } = useIndexedDB();

  // Initialize IndexedDB and load layout for current navigation path
  useEffect(() => {
    const initializeLayout = async () => {
      try {
        dispatch(setLayoutLoading(true));
        await Promise.all([layoutStorage.init(), dashboardStorage.init()]);

        // Load dashboards from IndexedDB
        const savedDashboards = (await getData("dashboards")) as
          | DashboardLayout[]
          | null;
        const savedSelectedDashboard = (await getData("selectedDashboard")) as
          | string
          | null;

        // Initialize dashboards in Redux store
        if (savedDashboards && savedDashboards.length > 0) {
          // Use saved dashboards from IndexedDB
          dispatch(setDashboards(savedDashboards));
        } else {
          // Initialize with DEFAULT_DASHBOARD if nothing saved
          dispatch(setDashboards([DEFAULT_DASHBOARD]));
        }

        // Initialize selectedDashboardId from saved value or default
        const dashboardIdToUse = savedSelectedDashboard || "default-dashboard";
        dispatch(setSelectedDashboardId(dashboardIdToUse));

        const storedDashboards = await dashboardStorage.getAllDashboards();
        if (storedDashboards.length > 0) {
          const dashboardsObj = storedDashboards.reduce(
            (acc, { dashboard, dashboardName }) => ({
              ...acc,
              [dashboardName]: dashboard,
            }),
            {}
          );

          // if (
          //   dashboardsObj[`${dashboardIdToUse}:${currentNavigationPath}`] ===
          //   undefined
          // ) {
          // }
          //later remove this condition
          if (
            dashboardsObj[
              `${dashboardIdToUse}:${currentNavigationPath}` as keyof typeof dashboardsObj
            ] !== undefined
          ) {
            setCurrentDashboard(
              dashboardsObj[
                `${dashboardIdToUse}:${currentNavigationPath}` as keyof typeof dashboardsObj
              ] ||
                dashboardsObj[
                  `${dashboardIdToUse}:default` as keyof typeof dashboardsObj
                ]
            );
          }
        } else {
          await dashboardStorage.saveDashboard(
            `${dashboardIdToUse}:${currentNavigationPath}`,
            DEFAULT_DASHBOARD
          );
        }
        // Load layout for current navigation path
        const savedLayout = await layoutStorage.getLayout(
          `${dashboardIdToUse}:${currentNavigationPath}`
        );
        if (savedLayout) {
          dispatch(
            setLayoutForPath({
              path: `${dashboardIdToUse}:${currentNavigationPath}`,
              layout: savedLayout,
            })
          );
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize layout storage:", error);
        setIsInitialized(true);
      } finally {
        dispatch(setLayoutLoading(false));
      }
    };

    initializeLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load dashboard content and layout when selectedDashboard or navigation path changes
  useEffect(() => {
    if (!isInitialized) return;

    const loadDashboardAndLayout = async () => {
      try {
        dispatch(setLayoutLoading(true));

        // Load dashboard content from storage
        const storedDashboards = await dashboardStorage.getAllDashboards();
        if (storedDashboards.length > 0) {
          const dashboardsObj = storedDashboards.reduce(
            (acc, { dashboard, dashboardName }) => ({
              ...acc,
              [dashboardName]: dashboard,
            }),
            {}
          );

          // Load dashboard for current path or default
          const currentDashboardKey =
            `${selectedDashboard}:${currentNavigationPath}` as keyof typeof dashboardsObj;
          const defaultDashboardKey =
            `${selectedDashboard}:default` as keyof typeof dashboardsObj;

          if (dashboardsObj[currentDashboardKey]) {
            setCurrentDashboard(dashboardsObj[currentDashboardKey]);
          } else if (dashboardsObj[defaultDashboardKey]) {
            setCurrentDashboard(dashboardsObj[defaultDashboardKey]);
          } else if (selectedDashboard === "default-dashboard") {
            setCurrentDashboard(DEFAULT_DASHBOARD);
          }
        }

        // Load layout
        const savedLayout = await layoutStorage.getLayout(
          `${selectedDashboard}:${currentNavigationPath}`
        );
        if (savedLayout) {
          dispatch(
            setLayoutForPath({
              path: `${selectedDashboard}:${currentNavigationPath}`,
              layout: savedLayout,
            })
          );
        } else {
          const defaultLayout = await layoutStorage.getLayout(
            `${selectedDashboard}:default`
          );
          dispatch(
            setLayoutForPath({
              path: `${selectedDashboard}:default`,
              layout: defaultLayout || [],
            })
          );
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard and layout:",
          currentNavigationPath,
          error
        );
      } finally {
        dispatch(setLayoutLoading(false));
      }
    };

    loadDashboardAndLayout();
  }, [selectedDashboard, currentNavigationPath, dispatch, isInitialized]);

  // Initialize IndexedDB and load layout for current navigation path
  // useEffect(() => {
  //   const initializeLayout = async () => {
  //     try {
  //       dispatch(setLayoutLoading(true));
  //       await layoutStorage.init();

  //       // Load layout for current navigation path
  //       const savedLayout = await layoutStorage.getLayout(
  //         currentNavigationPath
  //       );
  //       if (savedLayout) {
  //         dispatch(
  //           setLayoutForPath({
  //             path: currentNavigationPath,
  //             layout: savedLayout,
  //           })
  //         );
  //       }

  //       setIsInitialized(true);
  //     } catch (error) {
  //       console.error("Failed to initialize layout storage:", error);
  //       setIsInitialized(true);
  //     } finally {
  //       dispatch(setLayoutLoading(false));
  //     }
  //   };

  //   initializeLayout();
  // }, [currentNavigationPath, dispatch]);

  // Load layout when navigation path changes
  // useEffect(() => {
  //   if (!isInitialized) return;

  //   const loadLayoutForPath = async () => {
  //     try {
  //       dispatch(setLayoutLoading(true));
  //       const savedLayout = await layoutStorage.getLayout(
  //         currentNavigationPath
  //       );
  //       if (savedLayout) {
  //         dispatch(
  //           setLayoutForPath({
  //             path: currentNavigationPath,
  //             layout: savedLayout,
  //           })
  //         );
  //       }
  //     } catch (error) {
  //       console.error(
  //         "Failed to load layout for path:",
  //         currentNavigationPath,
  //         error
  //       );
  //     } finally {
  //       dispatch(setLayoutLoading(false));
  //     }
  //   };

  //   loadLayoutForPath();
  // }, [currentNavigationPath, dispatch, isInitialized]);

  const handleEditWidget = (widgetId: string): void => {
    const widget = currentDashboard.widgets.find((w) => w.id === widgetId);
    if (widget) {
      setEditingWidget(widget);
      setIsWidgetEditorOpen(true);
    }
  };

  const handleDeleteWidget = (widgetId: string): void => {
    if (confirm("Are you sure you want to delete this widget?")) {
      const updatedDashboard = {
        ...currentDashboard,
        widgets: currentDashboard.widgets.filter((w) => w.id !== widgetId),
      };
      setCurrentDashboard(updatedDashboard);
      dashboardStorage.saveDashboard(
        `${selectedDashboard}:${currentNavigationPath}`,
        updatedDashboard
      );
      const newWidgetFilters = { ...widgetFilters };
      delete newWidgetFilters[widgetId];
      setWidgetFilters(newWidgetFilters);
    }
  };

  const handleSaveWidget = (updatedWidget: DashboardWidget): void => {
    const existingWidget = currentDashboard.widgets.find(
      (w) => w.id === updatedWidget.id
    );
    if (existingWidget) {
      const updatedDashboard = {
        ...currentDashboard,
        widgets: currentDashboard.widgets.map((w) =>
          w.id === updatedWidget.id ? updatedWidget : w
        ),
      };
      setCurrentDashboard(updatedDashboard);
      dashboardStorage.saveDashboard(
        `${selectedDashboard}:${currentNavigationPath}`,
        updatedDashboard
      );
    } else {
      const updatedDashboard = {
        ...currentDashboard,
        widgets: [...currentDashboard.widgets, updatedWidget],
      };
      setCurrentDashboard(updatedDashboard);
      dashboardStorage.saveDashboard(
        `${selectedDashboard}:${currentNavigationPath}`,
        updatedDashboard
      );
    }
  };

  const handleAddCustomWidget = () => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      title: "New Widget",
      displayType: "summary",
      viewType: "single-value",
      position: { row: 0, col: 0, width: 3, height: 2 },
      filters: [],
    };
    setEditingWidget(newWidget);
    setIsWidgetEditorOpen(true);
  };

  const handleWidgetFiltersChange = (
    widgetId: string,
    filters: AppliedFilter[]
  ): void => {
    setWidgetFilters((prev) => ({ ...prev, [widgetId]: filters }));
  };

  const onDrop = (
    layout: ReactGridLayout.Layout[],
    _item: ReactGridLayout.Layout,
    e: DragEvent
  ) => {
    const widgetId = e.dataTransfer?.getData("text/plain");
    const predefinedWidget = predefinedWidgets.find((p) => p.id === widgetId);
    if (predefinedWidget) {
      const newWidgetId = `widget-${Date.now()}`;
      const newWidget: DashboardWidget = {
        id: newWidgetId,
        title: predefinedWidget.title,
        displayType: predefinedWidget.displayType,
        viewType: predefinedWidget.viewType,
        apiEndpoint: predefinedWidget.apiEndpoint,
        // position: {
        //   row: item.y,
        //   col: item.x,
        //   width: predefinedWidget.defaultLayout.w,
        //   height: predefinedWidget.defaultLayout.h,
        // },
        position: predefinedWidget?.position,
        filters: predefinedWidget?.filters || [],
        inVisibleFilters: predefinedWidget?.inVisibleFilters || [],
      };

      const updatedDashboard = {
        ...currentDashboard,
        widgets: [...currentDashboard.widgets, newWidget],
      };
      setCurrentDashboard(updatedDashboard);
      widgetStorage.saveWidget(
        `${selectedDashboard}:${currentNavigationPath}`,
        updatedDashboard,
        "widget"
      );
      dispatch(
        setDashboards(
          dashboards.map((d) =>
            d.id === selectedDashboard
              ? { ...d, widgets: updatedDashboard.widgets }
              : d
          )
        )
      );
      dashboardStorage.saveDashboard(
        `${selectedDashboard}:${currentNavigationPath}`,
        updatedDashboard
      );

      const newLayoutItem = {
        i: newWidgetId,
        x: predefinedWidget.position.col,
        y: predefinedWidget.position.row,
        w: predefinedWidget.position.width,
        h: predefinedWidget.position.height,
      };

      const newLayoutExist = JSON.parse(JSON.stringify(layout));
      const newLayout = newLayoutExist.map((val: { isDraggable: boolean }) => {
        if (val?.isDraggable) {
          return { ...val, w: newLayoutItem.w, h: newLayoutItem.h };
        } else {
          return val;
        }
      });
      newLayout.push(newLayoutItem);
      dispatch(
        setLayoutForPath({
          path: `${selectedDashboard}:${currentNavigationPath}`,
          layout: newLayout,
        })
      );
      layoutStorage.saveLayout(
        currentNavigationPath,
        newLayout,
        selectedDashboard
      );
    }
  };

  const onLayoutChange = async (
    layout: ReactGridLayout.Layout[]
  ): Promise<void> => {
    // The 'layout' parameter now correctly comes from the grid component's event.
    const layoutData =
      layout?.length === 0
        ? layouts[`${selectedDashboard}:${currentNavigationPath}`]
        : JSON.parse(JSON.stringify(layout));
    // Dispatch the new layout to the Redux store.
    dispatch(
      setLayoutForPath({
        path: `${selectedDashboard}:${currentNavigationPath}`,
        layout: layoutData,
      })
    );

    // Save the new layout to IndexedDB.
    layoutStorage
      .saveLayout(currentNavigationPath, layoutData, selectedDashboard)
      .catch((error) => {
        console.error("Failed to save layout to IndexedDB:", error);
      });
    const updatedWidgets = currentDashboard.widgets.map((widget) => {
      const layoutItem = layoutData.find(
        (item: { i: string }) => item.i === widget.id
      );
      if (layoutItem) {
        return {
          ...widget,
          position: {
            ...widget.position,
            ...layoutItem,
            col: layoutItem.x,
            row: layoutItem.y,
            width: layoutItem.w,
            height: layoutItem.h,
          },
        };
      }
      return widget;
    });
    // if (!isInitialized) return;
    if (currentDashboard?.id !== selectedDashboard) {
      return;
    }

    if (
      `${selectedDashboard}:${currentNavigationPath}` !==
      currentDashboard?.dashboardName
    ) {
      return;
    }

    dashboardStorage.saveDashboard(
      `${selectedDashboard}:${currentNavigationPath}`,
      {
        ...currentDashboard,
        widgets: updatedWidgets,
      }
    );

    setCurrentDashboard({
      ...currentDashboard,
      widgets: updatedWidgets,
    });
    dashboardStorage.saveDashboard(
      `${selectedDashboard}:${currentNavigationPath}`,
      {
        ...currentDashboard,
        widgets: updatedWidgets,
      }
    );
    // dispatch(
    //   setDashboards(
    //     dashboards.map((d) =>
    //       d.id === selectedDashboard ? { ...d, widgets: updatedWidgets } : d
    //     )
    //   )
    // );
  };

  const handleHeightChange = (widgetId: string, height: number) => {
    const rowHeight = 108; // Match the rowHeight prop in ResponsiveGridLayout
    const marginY = 16; // Match the margin prop in ResponsiveGridLayout

    // Calculate grid units from pixel height
    const newH = Math.ceil(height / (rowHeight + marginY));

    const widget = currentDashboard.widgets.find((w) => w.id === widgetId);
    if (widget && widget.position.height !== newH) {
      const updatedWidgets = currentDashboard.widgets.map((w) =>
        w.id === widgetId
          ? {
              ...w,
              position: {
                ...w.position,
                height: newH,
              },
              customHeight: height,
            }
          : w
      );

      setCurrentDashboard({ ...currentDashboard, widgets: updatedWidgets });
      dashboardStorage.saveDashboard(
        `${selectedDashboard}:${currentNavigationPath}`,
        {
          ...currentDashboard,
          widgets: updatedWidgets,
        }
      );
    }
  };

  // Get layout from Redux store or fallback to widget positions
  const getCurrentLayout = (): ReactGridLayout.Layout[] => {
    // Fallback to widget positions - use stored heights directly
    return currentDashboard?.widgets.map((w) => ({
      i: w.id,
      x: w.position.col,
      y: w.position.row,
      w: w.position.width,
      h: w.position.height,
    }));
  };

  const layout = getCurrentLayout();

  // Show loading state while initializing
  // if (!isInitialized || isLayoutLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading dashboard layout...</p>
  //       </div>
  //     </div>
  //   );
  // }
  const DateRangeFilter: React.FC<{
    onDateChange: (startDate: string, endDate: string) => void;
    startDate?: string;
    endDate?: string;
  }> = ({ onDateChange, startDate = "", endDate = "" }) => {
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localEndDate, setLocalEndDate] = useState(endDate);

    const handleStartDateChange = (date: string) => {
      setLocalStartDate(date);
      onDateChange(date, localEndDate);
    };

    const handleEndDateChange = (date: string) => {
      setLocalEndDate(date);
      onDateChange(localStartDate, date);
    };

    return (
      <div className="flex items-center space-x-2 bg-slate-100 rounded-md p-2">
        <Calendar className="w-4 h-4 text-slate-500" />
        <input
          type="date"
          value={localStartDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none w-32"
          placeholder="Start Date"
        />
        <span className="text-slate-400">-</span>
        <input
          type="date"
          value={localEndDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
          className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none w-32"
          placeholder="End Date"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen  flex">
      <div className="flex-1">
        <div className="flex justify-end items-center gap-2 py-2 px-6 border-b border-gray-200 bg-white">
          {selectedSubBrands?.length !== 0 && (
            <div className="flex items-center gap-2">
              {/* Date Range Button */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDatePopup(openDatePopup === 0 ? null : 0)
                  }
                  className="flex items-center justify-center w-8 h-8 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Ellipsis className="w-5 h-5" />
                </button>

                {openDatePopup === 0 && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 w-80">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-800">
                        Select Date Range
                      </h4>
                      <button
                        onClick={() => setOpenDatePopup(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <DateRangeFilter
                      startDate={dateRange.startDate}
                      endDate={dateRange.endDate}
                      onDateChange={(startDate, endDate) =>
                        setDateRange({ startDate, endDate })
                      }
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => setOpenDatePopup(null)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Comparison Badge */}
              <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-1.5">
                <span className="text-gray-500">Comparison:</span>
                <span className="font-medium text-gray-700">
                  {comparisonDate}
                </span>
              </div>

              {/* Currency Button */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-md hover:bg-gray-100 transition-colors">
                <Coins className="w-4 h-4" />
                <span className="font-medium">Thousands</span>
              </button>

              {/* Filter Button */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 text-sm hover:bg-blue-50 rounded-md transition-colors font-medium">
                <span>+</span>
                <span>Filter</span>
              </button>
            </div>
          )}
        </div>

        <div className="px-6 bg-[#fcfcfc]">
          {/* Printable Content */}
          <PrintableContainer
            config={{
              pageFormat: "A3-landscape",
              marginInches: 0.5,
            }}
            // className="h-full overflow-y-auto"
          >
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: layout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={108}
              onLayoutChange={onLayoutChange}
              isDraggable={isEditMode}
              isResizable={isEditMode}
              isDroppable={true}
              onDrop={onDrop}
              margin={[16, 16]}
              // resizeHandles={["se"]}
              // compactType={null}
            >
              {currentDashboard.widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="bg-white rounded-lg border border-gray-300 printable-widget"
                >
                  <MatrixDisplay
                    widget={widget}
                    displayType={widget.displayType || "summary"}
                    viewType={widget.viewType || "tabular"}
                    title={widget.title}
                    apiEndpoint={widget.apiEndpoint}
                    refreshInterval={widget.refreshInterval}
                    additionalInfo={widget.additionalInfo}
                    customStyles={widget.customStyles}
                    onItemClick={() => {}}
                    isDragging={false}
                    onEdit={handleEditWidget}
                    onDelete={handleDeleteWidget}
                    isEditMode={isEditMode}
                    filters={widget.filters || []}
                    inVisibleFilters={widget.inVisibleFilters || []}
                    appliedFilters={widgetFilters[widget.id] || []}
                    onFiltersChange={(filters) =>
                      handleWidgetFiltersChange(widget.id, filters)
                    }
                    onHeightChange={handleHeightChange}
                    sampleData={SAMPLE_DATA}
                  />
                </div>
              ))}
            </ResponsiveGridLayout>
          </PrintableContainer>
        </div>

        <WidgetEditor
          widget={editingWidget}
          isOpen={isWidgetEditorOpen}
          onClose={() => {
            setIsWidgetEditorOpen(false);
            setEditingWidget(null);
          }}
          onSave={handleSaveWidget}
        />
      </div>
      <WidgetPanel
        isOpen={isWidgetPanelOpen}
        onClose={() => setIsWidgetPanelOpen(false)}
        onAddCustomWidget={handleAddCustomWidget}
      />
    </div>
  );
};

export default JsonDrivenDashboard;
