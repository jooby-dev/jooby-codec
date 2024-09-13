import {BrandType} from '../types.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as energyTypes from './constants/energyTypes.js';


export * from '../mtx1/types.js';

/**
 * `1` - `A+`, `R+`, `R-`,
 * `2` - `A-`, `R+`, `R-`
 *
 * One of the {@link energyTypes | energy types}
 */
export type TEnergyType = BrandType<number, 'uint8'>;
