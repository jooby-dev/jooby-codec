/**
 * Display modes.
 *
 * | Value | Screen type  | Screen range |
 * | ----- | ------------ | ------------ |
 * | `0`   | `main`       | `1..64`      |
 * | `1`   | `main`       | `65..128`    |
 * | `2`   | `additional` | `1..64`      |
 * | `3`   | `additional` | `65..128`    |
 *
 * @packageDocumentation
 */

/** Main display mode (screens 1-64). */
export const MAIN_1 = 0;

/** Main display mode (screens 65-128). */
export const MAIN_2 = 1;

/** Additional display mode (screens 1-64). */
export const ADDITIONAL_1 = 2;

/** Additional display mode (screens 65-128). */
export const ADDITIONAL_2 = 3;
