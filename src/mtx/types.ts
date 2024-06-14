import {BrandType} from '../types.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as energyTypes from './constants/energyTypes.js';


export * from '../types.js';

/**
 * Command access level.
 *
 * UNENCRYPTED = 0x00;
 * ROOT = 0x01;
 * READ_WRITE = 0x02;
 * READ_ONLY = 0x03;
 */
export type TAccessLevel = BrandType<number, '0 | 1 | 2 | 3'>;

/**
 * `1` - `A+`, `2` - `A-`
 *
 * One of the {@link energyTypes | energy types}
 */
export type TEnergyType = BrandType<number, 'uint8'>;
