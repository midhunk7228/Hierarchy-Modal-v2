# Advanced Date Range Picker - Implementation Summary

## Overview

A full-featured date range picker component with presets, duration syncing, weekday exclusions, and saved dates persisted in IndexedDB. All dates are handled in UTC and exposed as an array for API calls.

## Features Implemented

### 1. **Date Range Selection**

- Start and End date inputs
- Duration input with automatic calculation
- Four unit types: Day, Week, Month, Quarter
- Twin calendar view for visual selection

### 2. **Two-Way Syncing**

- **Start + End → Duration**: Automatically calculates duration when both dates are entered
- **Start + Duration → End**: Automatically calculates end date when duration is changed
- **End + Duration → Start**: Adjusts start date accordingly

### 3. **Weekday Exclusion**

- Toggle to exclude specific weekdays (Sunday through Saturday)
- Excluded days are:
  - Grayed out in the calendar
  - Not counted in duration calculations (for day unit)
  - Removed from the `includedDatesUtc` array

### 4. **Preset Date Ranges**

- **Today**: Current date
- **Yesterday**: Previous day
- **This Week**: Start to end of current week
- **Month to Date**: First day of month to today
- **Year to Date**: First day of year to today
- **This Quarter**: Start of current quarter to today

### 5. **Saved Dates**

- Save frequently used date ranges with custom labels
- Persisted in IndexedDB for persistence across sessions
- Delete saved ranges
- Shows date range and duration info for each saved item

### 6. **Footer Actions**

- **Today**: Quickly select today's date
- **Clear dates**: Reset to default (today, 1 day)
- **Cancel**: Close without applying changes
- **Apply**: Save selection and update Redux filters

## File Structure

```
src/
├── types/
│   └── dateRange.ts                 # Type definitions
├── utils/
│   └── dateRange.ts                 # UTC utilities and calculations
├── components/
│   └── UI/
│       └── AdvancedDateRangePicker/
│           ├── AdvancedDateRangePicker.tsx  # Main component
│           └── PresetSidebar.tsx            # Presets & saved dates
└── components/BrandDashboardHeader/
    └── HeaderActions.tsx            # Integration point
```

## Data Model

### DateRangeSelection

```typescript
{
  startDateUtc: string;        // "2025-03-01"
  endDateUtc: string;          // "2025-03-31"
  unit: DateRangeUnit;         // "day" | "week" | "month" | "quarter"
  duration: number;            // 31 (in selected unit)
  excludedWeekdays: number[];  // [0, 6] (Sunday, Saturday)
  includedDatesUtc: string[];  // ["2025-03-03", "2025-03-04", ...]
}
```

### SavedDateRange

```typescript
{
  id: string;
  label: string; // "Q1 2025"
  selection: DateRangeSelection;
  createdAt: number; // timestamp
}
```

## Integration with Redux

The date selection is stored in Redux filters:

```typescript
dispatch(
  setLocalAppliedFilters([
    ...existingFilters,
    {
      filterId: "date-range",
      value: selection, // DateRangeSelection object
    },
  ])
);
```

## Using the Date Range in API Calls

Access the date selection from Redux:

```typescript
const filters = useSelector(
  (state: RootState) => state.filters.localAppliedFilters
);

const dateFilter = filters.find((f) => f.filterId === "date-range");
if (dateFilter) {
  const selection = dateFilter.value as DateRangeSelection;

  // Option 1: Use the array of included dates
  const dates = selection.includedDatesUtc;
  // ["2025-03-03", "2025-03-04", "2025-03-05", ...]

  // Option 2: Use start and end dates
  const { startDateUtc, endDateUtc } = selection;

  // Option 3: Use duration info
  const { duration, unit } = selection;

  // Make API call
  await fetchData({ dates, startDate: startDateUtc, endDate: endDateUtc });
}
```

## IndexedDB Storage

Saved dates are stored in the existing `ApiData` store:

- **Key**: `"savedDateRanges"`
- **Value**: Array of `SavedDateRange` objects

## UTC Date Handling

All dates are handled in UTC to avoid timezone issues:

- Input/output format: `yyyy-MM-dd` (ISO 8601 date format)
- Internal calculations use `date-fns` and `date-fns-tz` libraries
- Dates are parsed as UTC midnight (00:00:00.000Z)

## Key Utilities

### `dateRange.ts` exports:

- `parseUtc(dateStr)` - Parse yyyy-MM-dd as UTC Date
- `formatUtc(date)` - Format Date as yyyy-MM-dd UTC
- `getTodayUtc()` - Get current date in UTC
- `addUnitUtc(date, unit, amount)` - Add duration to date
- `calcEndFromDuration(start, unit, duration, excludedWeekdays)` - Calculate end date
- `calcDurationFromRange(start, end, unit, excludedWeekdays)` - Calculate duration
- `enumerateIncludedDates(start, end, excludedWeekdays)` - Get all included dates
- `createSelection(start, end, unit, excludedWeekdays)` - Create complete selection object
- `getPresets()` - Get preset date ranges

## UI/UX Details

### Layout

- **Left Sidebar (288px)**: Presets and saved dates
- **Main Content**: Tabs, inputs, calendar, and actions
- **Modal Overlay**: Centered with backdrop blur
- **Responsive**: Adapts to different screen sizes

### Styling

- Uses Tailwind CSS for styling
- Matches existing design system
- Hover states and transitions
- Icon library: Lucide React

### Calendar Component

- Library: `react-day-picker`
- Displays 2 months side by side
- Range selection mode
- Disabled days for excluded weekdays
- Custom styling to match theme

## Testing the Component

1. Click the ellipsis (...) button in the header
2. The date picker modal opens
3. Try these interactions:
   - Select dates from the calendar
   - Change start/end dates and watch duration update
   - Change duration and watch end date update
   - Toggle weekday exclusions (e.g., exclude weekends)
   - Click preset options (Today, Yesterday, etc.)
   - Save a date range with a custom label
   - Load a saved date range
   - Click Apply to save to Redux

## Future Enhancements

Potential improvements:

- Comparison mode (compare two date ranges)
- Custom date range templates
- Export saved dates
- Import saved dates
- Date range validation rules
- Multiple date range selection
- Keyboard shortcuts
- Accessibility improvements (ARIA labels)

## Package Dependencies

New dependencies added:

- `react-day-picker` - Calendar component
- `date-fns` - Date utilities
- `date-fns-tz` - Timezone utilities

## Browser Compatibility

Tested and working in:

- Chrome/Edge (Chromium)
- Firefox
- Safari

Requires:

- ES6+ support
- IndexedDB support
- CSS Grid and Flexbox

## Notes

- All saved dates persist across browser sessions
- Dates are stored in UTC to avoid timezone issues
- The `includedDatesUtc` array is the recommended way to pass dates to APIs
- Excluded weekdays affect duration calculations only when unit is "day"
- For week/month/quarter units, exclusions only affect the `includedDatesUtc` array

---

**Implementation Date**: October 2025  
**Last Updated**: October 27, 2025
