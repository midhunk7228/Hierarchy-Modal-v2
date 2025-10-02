/**
 * Date configuration settings
 *
 * This file contains configuration options for date-related calculations
 * and display throughout the application.
 */

/**
 * Week start day configuration
 * 0 = Sunday
 * 1 = Monday
 * 2 = Tuesday
 * 3 = Wednesday
 * 4 = Thursday
 * 5 = Friday
 * 6 = Saturday
 *
 * @default 0 (Sunday)
 */
export const WEEK_STARTS_ON = 0 as const;

/**
 * Type for week start day
 */
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Constrain "This Week" to current month only
 *
 * When enabled, "This Week" will only include days within the current month,
 * ignoring days from the previous or next month even if they fall within
 * the same calendar week.
 *
 * Example:
 * - Current month starts on Wednesday (1st is Wednesday)
 * - Normal "This Week" would include Monday-Tuesday from previous month
 * - With this enabled, "This Week" only includes Wednesday-Sunday (5 days)
 *
 * @default false
 */
export const CONSTRAIN_WEEK_TO_CURRENT_MONTH = false as const;
