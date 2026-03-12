import {BrandType} from '../types.js';

export * from '../mtx1/types.js';

/**
 * Subsystem ids.
 *
 * - CONNECTION = 1;
 * - MTX = 2;
 * - MTX_REPORT = 3;
 * - MTX_EVENT = 4;
 * - BYCON = 5;
 * - MODEM = 6;
 * - PAN_CONFIRMATION = 7;
 * - EMPTY_UPLINK = 8;
 * - LONG_ADDRESS = 9;
 */

export type TSubsystemIds = BrandType<number, '1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9'>;
