# Quick Start Guide - Advanced Date Range Picker

## ✅ Implementation Complete!

The advanced date range picker has been successfully implemented and integrated into your application.

## 📁 New Files Created

```
src/
├── types/
│   └── dateRange.ts                          # Type definitions
├── utils/
│   └── dateRange.ts                          # UTC utilities
├── hooks/
│   └── useDateRangeFilter.ts                 # Custom hook to access date range
├── components/
│   ├── DateRangeDisplay.tsx                  # Example display component
│   └── UI/
│       └── AdvancedDateRangePicker/
│           ├── index.tsx                     # Barrel export
│           ├── AdvancedDateRangePicker.tsx   # Main component
│           └── PresetSidebar.tsx             # Presets & saved dates
└── DATE_PICKER_IMPLEMENTATION.md             # Full documentation
```

## 📝 Modified Files

- `src/components/BrandDashboardHeader/HeaderActions.tsx` - Integrated the new picker

## 🚀 How to Use

### 1. Open the Date Picker

Click the ellipsis button (...) in the header to open the date picker modal.

### 2. Select a Date Range

**Option A: Use Presets**

- Click any preset on the left sidebar (Today, Yesterday, This Week, etc.)

**Option B: Use Calendar**

- Click and drag to select a range on the calendar

**Option C: Type Dates**

- Enter dates in the Start Date and End Date inputs

**Option D: Use Duration**

- Enter a start date
- Enter a duration
- The end date will be calculated automatically

### 3. Exclude Weekdays (Optional)

- Click on weekday buttons (Su, Mo, Tu, etc.) to exclude them
- Excluded days won't be counted in duration or included in the dates array

### 4. Save the Date Range (Optional)

- Click "Save selected date" button
- Enter a label (e.g., "Q1 2025", "Holiday Period")
- Click Save
- The saved range will appear in the sidebar for future use

### 5. Apply the Selection

- Click the "Apply" button
- The date range is now saved to Redux and can be used throughout your app

## 🔧 Using Date Range in Your Components

### Method 1: Using the Custom Hook (Recommended)

```typescript
import { useDateRangeFilter } from "../hooks/useDateRangeFilter";

function MyComponent() {
  const { hasDateFilter, includedDates, startDate, endDate } =
    useDateRangeFilter();

  useEffect(() => {
    if (hasDateFilter) {
      // Use includedDates array for API calls
      fetchData({ dates: includedDates });
    }
  }, [hasDateFilter, includedDates]);

  return <div>...</div>;
}
```

### Method 2: Using Redux Directly

```typescript
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { DateRangeSelection } from "../types/dateRange";

function MyComponent() {
  const filters = useSelector(
    (state: RootState) => state.filters.localAppliedFilters
  );
  const dateFilter = filters.find((f) => f.filterId === "date-range");
  const dateRange = dateFilter?.value as DateRangeSelection | undefined;

  if (dateRange) {
    // Access date range properties
    const dates = dateRange.includedDatesUtc;
    const { startDateUtc, endDateUtc, duration, unit } = dateRange;
  }
}
```

### Method 3: Using the Display Component

Add the `DateRangeDisplay` component anywhere to show the current selection:

```typescript
import DateRangeDisplay from "../components/DateRangeDisplay";

function Dashboard() {
  return (
    <div>
      <DateRangeDisplay />
      {/* Your other components */}
    </div>
  );
}
```

## 📊 Making API Calls with Date Range

### Example: Fetch data for selected dates

```typescript
import { useDateRangeFilter } from "../hooks/useDateRangeFilter";

function DataWidget() {
  const { includedDates, startDate, endDate } = useDateRangeFilter();

  const fetchWidgetData = async () => {
    // Option 1: Send array of dates
    const response = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dates: includedDates }),
    });

    // Option 2: Send start and end dates
    const response2 = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
      }),
    });

    return await response.json();
  };

  useEffect(() => {
    if (includedDates.length > 0) {
      fetchWidgetData();
    }
  }, [includedDates]);

  return <div>...</div>;
}
```

## 🎯 Key Features

### ✨ Two-Way Syncing

- **Start + End → Duration**: Enter both dates, duration updates automatically
- **Start + Duration → End**: Enter start and duration, end date updates automatically
- **Exclusions → Duration**: Toggle exclusions, duration recalculates

### 📅 Date Units

- **Day**: Count individual days
- **Week**: Count weeks
- **Month**: Count months
- **Quarter**: Count quarters

### 🚫 Weekday Exclusions

- Toggle any combination of weekdays
- Excluded days are:
  - Removed from `includedDatesUtc` array
  - Not counted in duration (for day unit)
  - Grayed out in calendar

### 💾 Saved Dates

- Save frequently used ranges
- Persisted in IndexedDB
- Quick access from sidebar
- Delete when no longer needed

### 🎨 Presets

- Today
- Yesterday
- This Week
- Month to Date
- Year to Date
- This Quarter

## 🌍 UTC Date Handling

All dates are in UTC format (`yyyy-MM-dd`):

- `2025-03-01` = March 1, 2025 00:00:00 UTC
- No timezone confusion
- Safe for international applications

## 📦 Data Structure

The `DateRangeSelection` object contains:

```typescript
{
  startDateUtc: "2025-03-01",        // Start date (UTC)
  endDateUtc: "2025-03-31",          // End date (UTC)
  unit: "day",                       // Selected unit
  duration: 23,                      // Duration (excluding weekends)
  excludedWeekdays: [0, 6],          // Sunday & Saturday excluded
  includedDatesUtc: [                // Array of all included dates
    "2025-03-03",  // Monday
    "2025-03-04",  // Tuesday
    "2025-03-05",  // Wednesday
    // ... etc (all weekdays in range)
  ]
}
```

## 🐛 Troubleshooting

### Date picker doesn't open

- Check browser console for errors
- Verify Redux store is properly configured
- Make sure all dependencies are installed

### Saved dates not persisting

- Check IndexedDB is enabled in browser
- Open DevTools → Application → IndexedDB → GeminiDB → ApiData
- Look for key `savedDateRanges`

### Date format issues

- All dates should be in `yyyy-MM-dd` format
- Use the provided utilities in `src/utils/dateRange.ts`
- Don't create Date objects directly; use `parseUtc()` and `formatUtc()`

## 📖 Further Reading

For complete documentation, see:

- `DATE_PICKER_IMPLEMENTATION.md` - Full implementation details
- `src/types/dateRange.ts` - Type definitions
- `src/utils/dateRange.ts` - Utility functions

## 🎉 You're Ready!

The date picker is fully integrated and ready to use. Click the ellipsis (...) button in the header to try it out!
