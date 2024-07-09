import {BrandType} from '../types.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {energyTypes} from './constants/index.js';


export * from '../mtx/types.js';

/**
 * `1` - `A+`, `R+`, `R-`,
 * `2` - `A-`, `R+`, `R-`
 *
 * One of the {@link energyTypes | energy types}
 */
export type TEnergyType = BrandType<number, 'uint8'>;
