import * as types from '../../types.js';

/**
 * Unique for a single direction (uplink/downlink) command name.
 * It is used in message build.
 */
export type TAccessLevel = types.BrandType<number, '0 | 1 | 2 | 3'>;
