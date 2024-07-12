import {BrandType} from '../types.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as energyTypes from './constants/energyTypes.js';


export * from '../mtx/types.js';

/**
 * `1` - `A+`, `R+`, `R-`,
 * `2` - `A-`, `R+`, `R-`
 *
 * One of the {@link energyTypes | energy types}
 */
export type TEnergyType = BrandType<number, 'uint8'>;

/**
 * Type of energy, or other parameters for averaged energy and voltage profiles.
 *
 * | Value  | Description                                          |
 * | ------ | ---------------------------------------------------- |
 * | `1`    | Get `15/30/60`-minute load profile `A+` phase `A`    |
 * | `2`    | Get `15/30/60`-minute load profile `A+` phase `B`    |
 * | `3`    | Get `15/30/60`-minute load profile `A+` phase `C`    |
 * | `4`    | Get `15/30/60`-minute load profile `A-` phase `A`    |
 * | `5`    | Get `15/30/60`-minute load profile `A-` phase `B`    |
 * | `6`    | Get `15/30/60`-minute load profile `A-` phase `C`    |
 * | `7`    | Get `15/30/60`-minute load profile `A+R+` phase `A`  |
 * | `8`    | Get `15/30/60`-minute load profile `A+R+` phase `B`  |
 * | `9`    | Get `15/30/60`-minute load profile `A+R+` phase `C`  |
 * | `10`   | Get `15/30/60`-minute load profile `A+R-` phase `A`  |
 * | `11`   | Get `15/30/60`-minute load profile `A+R-` phase `B`  |
 * | `12`   | Get `15/30/60`-minute load profile `A+R-` phase `C`  |
 * | `13`   | Get `15/30/60`-minute load profile `A-R+` phase `A`  |
 * | `14`   | Get `15/30/60`-minute load profile `A-R+` phase `B`  |
 * | `15`   | Get `15/30/60`-minute load profile `A-R+` phase `C`  |
 * | `16`   | Get `15/30/60`-minute load profile `A-R-` phase `A`  |
 * | `17`   | Get `15/30/60`-minute load profile `A-R-` phase `B`  |
 * | `18`   | Get `15/30/60`-minute load profile `A-R-` phase `C`  |
 * | `19`   | Get `15/30/60`-minute load profile `R+` phase `A`    |
 * | `20`   | Get `15/30/60`-minute load profile `R+` phase `B`    |
 * | `21`   | Get `15/30/60`-minute load profile `R+` phase `C`    |
 * | `22`   | Get `15/30/60`-minute load profile `R-` phase `A`    |
 * | `23`   | Get `15/30/60`-minute load profile `R-` phase `B`    |
 * | `24`   | Get `15/30/60`-minute load profile `R-` phase `C`    |
 * | `25`   | Get `15/30/60`-minute voltage profile phase `A`      |
 * | `26`   | Get `15/30/60`-minute voltage profile phase `B`      |
 * | `27`   | Get `15/30/60`-minute voltage profile phase `C`      |
 * | `28`   | Get `10`-minute voltage profile phase `A`            |
 * | `29`   | Get `10`-minute voltage profile phase `B`            |
 * | `30`   | Get `10`-minute voltage profile phase `C`            |
 * | `31`   | Get `15/30/60`-minute current profile phase `A`      |
 * | `32`   | Get `15/30/60`-minute current profile phase `B`      |
 * | `33`   | Get `15/30/60`-minute current profile phase `C`      |
 * | `0x81` | Get active energy profile `A+` `1.4.0`               |
 * | `0x82` | Get active energy profile `A-` `2.4.0`               |
 * | `0x84` | Get reactive energy profile `A+R+` `3.4.0` (`7.4.0`) |
 * | `0x88` | Get reactive energy profile `A+R-` `4.4.0` (`8.4.0`) |
 * | `0x90` | Get reactive energy profile `A-R+` `5.8.0`           |
 * | `0xA0` | Get reactive energy profile `A-R-` `6.8.0`           |
 * | `0xB0` | Get profile recorded in `Canal 1`                    |
 * | `0xB1` | Get profile recorded in `Canal 2`                    |
 * | `0xB2` | Get profile recorded in `Canal 3`                    |
 * | `0xB3` | Get profile recorded in `Canal 4`                    |
 * | `0xB4` | Get profile recorded in `Canal 5`                    |
 * | `0xB5` | Get profile recorded in `Canal 6`                    |
 */
export type TDemandParam = BrandType<number, 'uint8'>;
