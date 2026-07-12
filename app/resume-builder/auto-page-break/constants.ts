/**
 * A4 Page Constants
 * Centralized values for Preview + Print + Pagination
 */

// A4 size (mm)
export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_MM = 297;

// Printable margin (mm)
export const PAGE_MARGIN_MM = 10;

// A4 size (px @ 96 DPI)
export const PAGE_WIDTH_PX = 794;
export const PAGE_HEIGHT_PX = 1123;

/**
 * Extra reserved space:
 * - Top & Bottom padding
 * - Borders
 * - Browser print rounding
 */
export const RESERVED_SPACE_PX = 24;

/**
 * Final printable area
 */
export const PRINTABLE_WIDTH =
  PAGE_WIDTH_PX - 2;

export const PRINTABLE_HEIGHT =
  PAGE_HEIGHT_PX - RESERVED_SPACE_PX;