/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import * as types from '../types.js';
import MtxBinaryBuffer, {
    ICommandBinaryBuffer as IMtxCommandBinaryBuffer,
    IEvent,
    TARIFF_NUMBER,
    DATE_SIZE,
    ENERGY_SIZE
} from '../../mtx1/utils/CommandBinaryBuffer.js';
import * as bitSet from '../../utils/bitSet.js';
import {TEnergyType} from '../types.js';
import {displayModes, baudRates, events, eventNames} from '../constants/index.js';


export interface IDisplaySet1OperatorParameter {
    /**
     * Test display.
     */
    SET_ALL_SEGMENT_DISPLAY: boolean;

    /**
     * Display software version.
     */
    SOFTWARE_VERSION: boolean;

    /**
     * Total active energy (`A+`) across all tariffs (`1.8.0`).
     */
    TOTAL_ACTIVE_ENERGY: boolean;

    /**
     * Active energy (`A+`) for tariff `T1` (`1.8.1`).
     */
    ACTIVE_ENERGY_T1: boolean;

    /**
     * Active energy (`A+`) for tariff `T2` (`1.8.2`).
     */
    ACTIVE_ENERGY_T2: boolean;

    /**
     * Active energy (`A+`) for tariff `T3` (`1.8.3`).
     */
    ACTIVE_ENERGY_T3: boolean;

    /**
     * Active energy (`A+`) for tariff `T4` (`1.8.4`).
     */
    ACTIVE_ENERGY_T4: boolean;

    /**
     * Total reactive energy (`R+`) across all tariffs (`3.8.0` for `R`-type meters), (`A+R+`, `5.8.0` for `G`-type meters).
     */
    TOTAL_REACTIVE_ENERGY: boolean;

    /**
     * Reactive energy (`R+`) for tariff `T1` (`3.8.1` for `R`-type meters), (`A+R+`, `5.8.1` for `G`-type meters).
     */
    REACTIVE_ENERGY_T1: boolean;

    /**
     * Reactive energy (`R+`) for tariff `T2` (`3.8.2` for `R`-type meters), (`A+R+`, `5.8.2` for `G`-type meters).
     */
    REACTIVE_ENERGY_T2: boolean;

    /**
     * Reactive energy (`R+`) for tariff `T3` (`3.8.3` for `R`-type meters), (`A+R+`, `5.8.3` for `G`-type meters).
     */
    REACTIVE_ENERGY_T3: boolean;

    /**
     * Reactive energy (`R+`) for tariff `T4` (`3.8.4` for `R`-type meters), (`A+R+`, `5.8.4` for `G`-type meters).
     */
    REACTIVE_ENERGY_T4: boolean;

    /**
     * Total negative reactive energy (`R-`) across all tariffs (`4.8.0` for `R`-type meters), (`A+R-`, `8.8.0` for `G`-type meters).
     */
    TOTAL_NEGATIVE_REACTIVE_ENERGY: boolean;

    /**
     * Negative reactive energy (`R-`) for tariff `T1` (`4.8.1` for `R`-type meters), (`A+R-`, `8.8.1` for `G`-type meters).
     */
    NEGATIVE_REACTIVE_ENERGY_T1: boolean;

    /**
     * Negative reactive energy (`R-`) for tariff `T2` (`4.8.2` for `R`-type meters), (`A+R-`, `8.8.2` for `G`-type meters).
     */
    NEGATIVE_REACTIVE_ENERGY_T2: boolean;

    /**
     * Negative reactive energy (`R-`) for tariff `T3` (`4.8.3` for `R`-type meters), (`A+R-`, `8.8.3` for `G`-type meters).
     */
    NEGATIVE_REACTIVE_ENERGY_T3: boolean;

    /**
     * Negative reactive energy (`R-`) for tariff `T4` (`4.8.4` for `R`-type meters), (`A+R-`, `8.8.4` for `G`-type meters).
     */
    NEGATIVE_REACTIVE_ENERGY_T4: boolean;

    /**
     * Total exported active energy (`A-`) across all tariffs (`2.8.0` for `G`-type meters).
     */
    TOTAL_EXPORTED_ACTIVE_ENERGY: boolean;

    /**
     * Exported active energy (`A-`) for tariff `T1` (`2.8.1` for `G`-type meters).
     */
    EXPORTED_ACTIVE_ENERGY_T1: boolean;

    /**
     * Exported active energy (`A-`) for tariff `T2` (`2.8.2` for `G`-type meters).
     */
    EXPORTED_ACTIVE_ENERGY_T2: boolean;

    /**
     * Exported active energy (`A-`) for tariff `T3` (`2.8.3` for `G`-type meters).
     */
    EXPORTED_ACTIVE_ENERGY_T3: boolean;

    /**
     * Exported active energy (`A-`) for tariff `T4` (`2.8.4` for `G`-type meters).
     */
    EXPORTED_ACTIVE_ENERGY_T4: boolean;

    /**
     * Total exported reactive energy (`A-R+`) across all tariffs (`6.8.0` for `G`-type meters).
     */
    TOTAL_EXPORTED_REACTIVE_ENERGY: boolean;

    /**
     * Exported reactive energy (`A-R+`) for tariff `T1` (`6.8.1` for `G`-type meters).
     */
    EXPORTED_REACTIVE_ENERGY_T1: boolean;

    /**
     * Exported reactive energy (`A-R+`) for tariff `T2` (`6.8.2` for `G`-type meters).
     */
    EXPORTED_REACTIVE_ENERGY_T2: boolean;

    /**
     * Exported reactive energy (`A-R+`) for tariff `T3` (`6.8.3` for `G`-type meters).
     */
    EXPORTED_REACTIVE_ENERGY_T3: boolean;

    /**
     * Exported reactive energy (`A-R+`) for tariff `T4` (`6.8.4` for `G`-type meters).
     */
    EXPORTED_REACTIVE_ENERGY_T4: boolean;

    /**
     * Total exported negative reactive energy (`A-R-`) across all tariffs (`7.8.0` for `G`-type meters).
     */
    TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: boolean;

    /**
     * Exported negative reactive energy (`A-R-`) for tariff `T1` (`7.8.1` for `G`-type meters).
     */
    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: boolean;

    /**
     * Exported negative reactive energy (`A-R-`) for tariff `T2` (`7.8.2` for `G`-type meters).
     */
    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: boolean;

    /**
     * Exported negative reactive energy (`A-R-`) for tariff `T3` (`7.8.3` for `G`-type meters).
     */
    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: boolean;

    /**
     * Exported negative reactive energy (`A-R-`) for tariff `T4` (`7.8.4` for `G`-type meters).
     */
    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: boolean;
}

export interface IDisplaySet2OperatorParameter {
    /**
     * Current in phase `A` (`31.7.0`).
     */
    CURRENT_IN_PHASE_A: boolean;

    /**
     * Current in phase `B` (`51.7.0`).
     */
    CURRENT_IN_PHASE_B: boolean;

    /**
     * Current in phase `C` (`71.7.0`).
     */
    CURRENT_IN_PHASE_C: boolean;

    /**
     * Current in neutral (`91.7.0`).
     */
    CURRENT_IN_NEUTRAL: boolean;

    /**
     * Voltage in phase `A` (`32.7.0`).
     */
    VOLTAGE_IN_PHASE_A: boolean;

    /**
     * Voltage in phase `B` (`52.7.0`).
     */
    VOLTAGE_IN_PHASE_B: boolean;

    /**
     * Voltage in phase `C` (`72.7.0`).
     */
    VOLTAGE_IN_PHASE_C: boolean;

    /**
     * Battery voltage (`96.6.3`).
     */
    BATTERY_VOLTAGE: boolean;

    /**
     * Network frequency (`14.7.0`).
     */
    FREQUENCY: boolean;

    /**
     * Active power of all phases (`P`, `1.7.0` for `R`-type meters), (`±P`, `16.7.0` for `G`-type meters).
     */
    ACTIVE_POWER_SUM: boolean;

    /**
     * Active power of phase `A` (`P`, `21.7.0` for `R`-type meters), (`±P`, `36.7.0` for `G`-type meters).
     */
    ACTIVE_POWER_PHASE_A: boolean;

    /**
     * Active power of phase `B` (`P`, `41.7.0` for `R`-type meters), (`±P`, `56.7.0` for `G`-type meters).
     */
    ACTIVE_POWER_PHASE_B: boolean;

    /**
     * Active power of phase `C` (`P`, `61.7.0` for `R`-type meters), (`±P`, `76.7.0` for `G`-type meters).
     */
    ACTIVE_POWER_PHASE_C: boolean;

    /**
     * Reactive power of all phases, `Q+` (quadrant `QI + QII`) (`3.7.0`).
     */
    REACTIVE_POWER_QPLUS_SUM: boolean;

    /**
     * Reactive power of phase `A`, `Q+` (quadrant `QI + QII`) (`23.7.0`).
     */
    REACTIVE_POWER_QPLUS_PHASE_A: boolean;

    /**
     * Reactive power of phase `B`, `Q+` (quadrant `QI + QII`) (`43.7.0`).
     */
    REACTIVE_POWER_QPLUS_PHASE_B: boolean;

    /**
     * Reactive power of phase `C`, `Q+` (quadrant `QI + QII`) (`63.7.0`).
     */
    REACTIVE_POWER_QPLUS_PHASE_C: boolean;

    /**
     * Reactive power of all phases, `Q-` (quadrant `QIII + QIV`) (`4.7.0`).
     */
    REACTIVE_POWER_QMINUS_SUM: boolean;

    /**
     * Reactive power of phase `A`, `Q-` (quadrant `QIII + QIV`) (`24.7.0`).
     */
    REACTIVE_POWER_QMINUS_PHASE_A: boolean;

    /**
     * Reactive power of phase `B`, `Q-` (quadrant `QIII + QIV`) (`44.7.0`).
     */
    REACTIVE_POWER_QMINUS_PHASE_B: boolean;

    /**
     * Reactive power of phase `C`, `Q-` (quadrant `QIII + QIV`) (`64.7.0`).
     */
    REACTIVE_POWER_QMINUS_PHASE_C: boolean;

    /**
     * Power factor (`cos φ`) of all phases (`13.7.0`).
     */
    POWER_COEFFICIENT_SUM: boolean;

    /**
     * Power factor (`cos φ`) of phase `A` (`33.7.0`).
     */
    POWER_COEFFICIENT_PHASE_A: boolean;

    /**
     * Power factor (`cos φ`) of phase `B` (`53.7.0`).
     */
    POWER_COEFFICIENT_PHASE_B: boolean;

    /**
     * Power factor (`cos φ`) of phase `C` (`73.7.0`).
     */
    POWER_COEFFICIENT_PHASE_C: boolean;

    /**
     * Total apparent power `S+` (quadrant `QI + QIV`) (`9.7.0`).
     */
    APPARENT_POWER_QPLUS_SUM: boolean;

    /**
     * Apparent power `S+` of phase `A` (quadrant `QI + QIV`) (`29.7.0`).
     */
    APPARENT_POWER_QPLUS_PHASE_A: boolean;

    /**
     * Apparent power `S+` of phase `B` (quadrant `QI + QIV`) (`49.7.0`).
     */
    APPARENT_POWER_QPLUS_PHASE_B: boolean;

    /**
     * Apparent power `S+` of phase `C` (quadrant `QI + QIV`) (`69.7.0`).
     */
    APPARENT_POWER_QPLUS_PHASE_C: boolean;

    /**
     * Total apparent power `S-` (quadrant `QII + QIII`) (`10.7.0`).
     */
    APPARENT_POWER_QMINUS_SUM: boolean;

    /**
     * Apparent power `S-` of phase `A` (quadrant `QII + QIII`) (`30.7.0`).
     */
    APPARENT_POWER_QMINUS_PHASE_A: boolean;

    /**
     * Apparent power `S-` of phase `B` (quadrant `QII + QIII`) (`50.7.0`).
     */
    APPARENT_POWER_QMINUS_PHASE_B: boolean;
}

export interface IDisplaySet3OperatorParameter {
    /**
     * Apparent power `S-` of phase `C`, (quadrant `QII + QIII`) (`70.7.0`).
     */
    APPARENT_POWER_QMINUS_PHASE_C: boolean;

    /**
     * Maximum daily active power for tariff `T1` (`|P|`, `15.26.1` for `R`-type meters), (`P+`, `1.26.1` for `G`-type meters).
     */
    MAX_ACTIVE_POWER_DAY_T1: boolean;

    /**
     * Maximum daily active power for tariff `T2` (`|P|`, `15.26.2` for `R`-type meters), (`P+`, `1.26.2` for `G`-type meters).
     */
    MAX_ACTIVE_POWER_DAY_T2: boolean;

    /**
     * Maximum daily active power for tariff `T3` (`|P|`, `15.26.3` for `R`-type meters), (`P+`, `1.26.3` for `G`-type meters).
     */
    MAX_ACTIVE_POWER_DAY_T3: boolean;

    /**
     * Maximum daily active power for tariff `T4` (`|P|`, `15.26.4` for `R`-type meters), (`P+`, `1.26.4` for `G`-type meters).
     */
    MAX_ACTIVE_POWER_DAY_T4: boolean;

    /**
     * Maximum monthly active power for tariff `T1` (`|P|`, `15.16.1` for `R`-type meters), (`P+`, `1.16.1` for `G`-type meters).
     */
    MAX_ACTIVE_POWER_MONTH_T1: boolean;

    /**
     * Maximum monthly active power for tariff `T2` (`|P|`, `15.16.2` for `R`-type meters), (`P+`, `1.16.2` for `G`-type meters).
     */
    MAX_ACTIVE_POWER_MONTH_T2: boolean;

    /**
     * Maximum monthly active power for tariff `T3` (`|P|`, `15.16.3` for `R`-type meters), (`P+`, `1.16.3` for `G`-type meters).
     */
    MAX_ACTIVE_POWER_MONTH_T3: boolean;

    /**
     * Maximum monthly active power for tariff `T4` (`|P|`, `15.16.4` for `R`-type meters), (`P+`, `1.16.4` for `G`-type meters).
     */
    MAX_ACTIVE_POWER_MONTH_T4: boolean;

    /**
     * Maximum daily reactive power for tariff `T1` (`Q+`, `3.26.1` for `R`-type meters), (`Q1`, `5.26.1` for `G`-type meters).
     */
    MAX_REACTIVE_POWER_DAY_T1: boolean;

    /**
     * Maximum daily reactive power for tariff `T2` (`Q+`, `3.26.2` for `R`-type meters), (`Q1`, `5.26.2` for `G`-type meters).
     */
    MAX_REACTIVE_POWER_DAY_T2: boolean;

    /**
     * Maximum daily reactive power for tariff `T3` (`Q+`, `3.26.3` for `R`-type meters), (`Q1`, `5.26.3` for `G`-type meters).
     */
    MAX_REACTIVE_POWER_DAY_T3: boolean;

    /**
     * Maximum daily reactive power for tariff `T4` (`Q+`, `3.26.4` for `R`-type meters), (`Q1`, `5.26.4` for `G`-type meters).
     */
    MAX_REACTIVE_POWER_DAY_T4: boolean;

    /**
     * Maximum monthly reactive power for tariff `T1` (`Q+`, `3.16.1` for `R`-type meters), (`Q1`, `5.16.1` for `G`-type meters).
     */
    MAX_REACTIVE_POWER_MONTH_T1: boolean;

    /**
     * Maximum monthly reactive power for tariff `T2` (`Q+`, `3.16.2` for `R`-type meters), (`Q1`, `5.16.2` for `G`-type meters).
     */
    MAX_REACTIVE_POWER_MONTH_T2: boolean;

    /**
     * Maximum monthly reactive power for tariff `T3` (`Q+`, `3.16.3` for `R`-type meters), (`Q1`, `5.16.3` for `G`-type meters).
     */
    MAX_REACTIVE_POWER_MONTH_T3: boolean;

    /**
     * Maximum monthly reactive power for tariff `T4` (`Q+`, `3.16.4` for `R`-type meters), (`Q1`, `5.16.4` for `G`-type meters).
     */
    MAX_REACTIVE_POWER_MONTH_T4: boolean;

    /**
     * Maximum daily negative reactive power for tariff `T1` (`Q-`, `4.26.1` for `R`-type meters), (`Q4`, `8.26.1` for `G`-type meters).
     */
    MAX_NEGATIVE_REACTIVE_POWER_DAY_T1: boolean;

    /**
     * Maximum daily negative reactive power for tariff `T2` (`Q-`, `4.26.2` for `R`-type meters), (`Q4`, `8.26.2` for `G`-type meters).
     */
    MAX_NEGATIVE_REACTIVE_POWER_DAY_T2: boolean;

    /**
     * Maximum daily negative reactive power for tariff `T3` (`Q-`, `4.26.3` for `R`-type meters), (`Q4`, `8.26.3` for `G`-type meters).
     */
    MAX_NEGATIVE_REACTIVE_POWER_DAY_T3: boolean;

    /**
     * Maximum daily negative reactive power for tariff `T4` (`Q-`, `4.26.4` for `R`-type meters), (`Q4`, `8.26.4` for `G`-type meters).
     */
    MAX_NEGATIVE_REACTIVE_POWER_DAY_T4: boolean;

    /**
     * Maximum monthly negative reactive power for tariff `T1` (`Q-`, `4.16.1` for `R`-type meters), (`Q4`, `8.16.1` for `G`-type meters).
     */
    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1: boolean;

    /**
     * Maximum monthly negative reactive power for tariff `T2` (`Q-`, `4.16.2` for `R`-type meters), (`Q4`, `8.16.2` for `G`-type meters).
     */
    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2: boolean;

    /**
     * Maximum monthly negative reactive power for tariff `T3` (`Q-`, `4.16.3` for `R`-type meters), (`Q4`, `8.16.3` for `G`-type meters).
     */
    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3: boolean;

    /**
     * Maximum monthly negative reactive power for tariff `T4` (`Q-`, `4.16.4` for `R`-type meters), (`Q4`, `8.16.4` for `G`-type meters).
     */
    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4: boolean;

    /**
     * Maximum daily exported active power for tariff `T1` (`P-`, `2.26.1` for `G`-type meters).
     */
    MAX_EXPORTED_ACTIVE_POWER_DAY_T1: boolean;

    /**
     * Maximum daily exported active power for tariff `T2` (`P-`, `2.26.2` for `G`-type meters).
     */
    MAX_EXPORTED_ACTIVE_POWER_DAY_T2: boolean;

    /**
     * Maximum daily exported active power for tariff `T3` (`P-`, `2.26.3` for `G`-type meters).
     */
    MAX_EXPORTED_ACTIVE_POWER_DAY_T3: boolean;

    /**
     * Maximum daily exported active power for tariff `T4` (`P-`, `2.26.4` for `G`-type meters).
     */
    MAX_EXPORTED_ACTIVE_POWER_DAY_T4: boolean;

    /**
     * Maximum monthly exported active power for tariff `T1` (`P-`, `2.16.1` for `G`-type meters).
     */
    MAX_EXPORTED_ACTIVE_POWER_MONTH_T1: boolean;

    /**
     * Maximum monthly exported active power for tariff `T2` (`P-`, `2.16.2` for `G`-type meters).
     */
    MAX_EXPORTED_ACTIVE_POWER_MONTH_T2: boolean;

    /**
     * Maximum monthly exported active power for tariff `T3` (`P-`, `2.16.3` for `G`-type meters).
     */
    MAX_EXPORTED_ACTIVE_POWER_MONTH_T3: boolean;
}

interface IDisplaySet4BaseOperatorParameter {
    /**
     * Maximum monthly active power for tariff `T4` (`P-`, `2.16.4` for `G`-type meters).
     */
    MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: boolean;

    /**
     * Maximum daily exported reactive power for tariff `T1` (`Q2`, `6.26.1` for `G`-type meters).
     */
    MAX_EXPORTED_REACTIVE_POWER_DAY_T1: boolean;

    /**
     * Maximum daily exported reactive power for tariff `T2` (`Q2`, `6.26.2` for `G`-type meters).
     */
    MAX_EXPORTED_REACTIVE_POWER_DAY_T2: boolean;

    /**
     * Maximum daily exported reactive power for tariff `T3` (`Q2`, `6.26.3` for `G`-type meters).
     */
    MAX_EXPORTED_REACTIVE_POWER_DAY_T3: boolean;

    /**
     * Maximum daily exported reactive power for tariff `T4` (`Q2`, `6.26.4` for `G`-type meters).
     */
    MAX_EXPORTED_REACTIVE_POWER_DAY_T4: boolean;

    /**
     * Maximum monthly exported reactive power for tariff `T1` (`Q2`, `6.16.1` for `G`-type meters).
     */
    MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: boolean;

    /**
     * Maximum monthly exported reactive power for tariff `T2` (`Q2`, `6.16.2` for `G`-type meters).
     */
    MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: boolean;

    /**
     * Maximum monthly exported reactive power for tariff `T3` (`Q2`, `6.16.3` for `G`-type meters).
     */
    MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: boolean;

    /**
     * Maximum monthly exported reactive power for tariff `T4` (`Q2`, `6.16.4` for `G`-type meters).
     */
    MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: boolean;

    /**
     * Maximum daily negative exported reactive power for tariff `T1` (`Q3`, `7.26.1` for `G`-type meters).
     */
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T1: boolean;

    /**
     * Maximum daily negative exported reactive power for tariff `T2` (`Q3`, `7.26.2` for `G`-type meters).
     */
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T2: boolean;

    /**
     * Maximum daily negative exported reactive power for tariff `T3` (`Q3`, `7.26.3` for `G`-type meters).
     */
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T3: boolean;

    /**
     * Maximum daily negative exported reactive power for tariff `T4` (`Q3`, `7.26.4` for `G`-type meters).
     */
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T4: boolean;

    /**
     * Maximum monthly negative exported reactive power for tariff `T1` (`Q3`, `7.16.1` for `G`-type meters).
     */
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T1: boolean;

    /**
     * Maximum monthly negative exported reactive power for tariff `T2` (`Q3`, `7.16.2` for `G`-type meters).
     */
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T2: boolean;

    /**
     * Maximum monthly negative exported reactive power for tariff `T3` (`Q3`, `7.16.3` for `G`-type meters).
     */
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T3: boolean;

    /**
     * Maximum monthly negative exported reactive power for tariff `T4` (`Q3`, `7.16.4` for `G`-type meters).
     */
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T4: boolean;

    /**
     * Current time of the meter clock (`0.9.1`).
     */
    HOUR_MINUTE_SECOND: boolean;

    /**
     * Current date of the meter clock (`0.9.2`).
     */
    DATE_MONTH_YEAR: boolean;

    /**
     * Current transformer ratio (`0.4.2`).
     */
    CURRENT_TRANSFORMATION_RATIO: boolean;

    /**
     * Voltage transformer ratio (`0.4.3`).
     */
    VOLTAGE_TRANSFORMATION_RATIO: boolean;

    /**
     * Display current balance.
     */
    CURRENT_BALANCE: boolean;

    /**
     * Display power threshold for tariff `T1` (`5.2.1`).
     *
     * since build `302.35.005`
     */
    POWER_THRESHOLD_T1: boolean;

    /**
     * Display power threshold for tariff `T2` (`5.2.2`).
     */
    POWER_THRESHOLD_T2: boolean;

    /**
     * Display power threshold for tariff `T3` (`5.2.3`).
     */
    POWER_THRESHOLD_T3: boolean;

    /**
     * Display power threshold for tariff `T4` (`5.2.4`).
     */
    POWER_THRESHOLD_T4: boolean;
}

export interface IDisplaySet4OperatorParameter extends IDisplaySet4BaseOperatorParameter {
    /**
     * Enable display sorting (see commands `getDisplayParam`, `setDisplayParam`).
     */
    SORT_DISPLAY_SCREENS: boolean;

    /**
     * Automatic display scrolling after pressing a button.
     */
    AUTO_SCREEN_SCROLLING: boolean;
}

export interface IRelaySetOperatorParameter {
    /**
     * Relay activation function.
     *
     * `true` - enabled,
     * `false` - disabled.
     */
    RELAY_ON_Y: boolean;

    /**
     * Turn on by command from the center.
     */
    RELAY_ON_CENTER: boolean;

    /**
     * Turn on by button.
     */
    RELAY_ON_PB: boolean;

    /**
     * Turn on by tariff `T1`.
     */
    RELAY_ON_TARIFF_0: boolean;

    /**
     * Turn on by tariff `T2`.
     */
    RELAY_ON_TARIFF_1: boolean;

    /**
     * Turn on by tariff `T3`.
     */
    RELAY_ON_TARIFF_2: boolean;

    /**
     * Turn on by tariff `T4`.
     */
    RELAY_ON_TARIFF_3: boolean;

    /**
     * Turn on by restoration of good voltage.
     */
    RELAY_ON_V_GOOD: boolean;

    /**
     * Relay deactivation function.
     *
     * `true` - enabled,
     * `false` - disabled.
     */
    RELAY_OFF_Y: boolean;

    /**
     * Turn off by command from the center.
     */
    RELAY_OFF_CENTER: boolean;

    /**
     * Turn off by tariff `T1`.
     */
    RELAY_OFF_TARIFF_0: boolean;

    /**
     * Turn off by tariff `T2`.
     */
    RELAY_OFF_TARIFF_1: boolean;

    /**
     * Turn off by tariff `T3`.
     */
    RELAY_OFF_TARIFF_2: boolean;

    /**
     * Turn off by tariff `T4`.
     */
    RELAY_OFF_TARIFF_3: boolean;

    /**
     * Turn off on load current exceeding.
     */
    RELAY_OFF_I_LIMIT: boolean;

    /**
     * Turn off on poor voltage.
     */
    RELAY_OFF_V_BAD: boolean;

    /**
     * Turn off on exceeding the differential current limit.
     */
    RELAY_OFF_DIFF_BAD: boolean;

    /**
     * Turn off on exceeding the power consumption limit for tariff `T1`.
     */
    RELAY_OFF_LIM_TARIFF_0: boolean;

    /**
     * Turn off on exceeding the power consumption limit for tariff `T2`.
     */
    RELAY_OFF_LIM_TARIFF_1: boolean;

    /**
     * Turn off on exceeding the power consumption limit for tariff `T3`.
     */
    RELAY_OFF_LIM_TARIFF_2: boolean;

    /**
     * Turn off on exceeding the power consumption limit for tariff `T4`.
     */
    RELAY_OFF_LIM_TARIFF_3: boolean;

    /**
     * Turn off on exceeding the reactive power consumption limit for tariff `T1`.
     */
    RELAY_OFF_LIM_VAR_TARIFF_0: boolean;

    /**
     * Turn off on exceeding the reactive power consumption limit for tariff `T2`.
     */
    RELAY_OFF_LIM_VAR_TARIFF_1: boolean;

    /**
     * Turn off on exceeding the reactive power consumption limit for tariff `T3`.
     */
    RELAY_OFF_LIM_VAR_TARIFF_2: boolean;

    /**
     * Turn off on exceeding the reactive power consumption limit for tariff `T4`.
     */
    RELAY_OFF_LIM_VAR_TARIFF_3: boolean;

    /**
     * Turn on when `cos φ` is normalized.
     */
    RELAY_ON_PF_MIN: boolean;

    /**
     * Turn off on `cos φ`.
     */
    RELAY_OFF_PF_MIN: boolean;

    /**
     * Turn on after timeout.
     */
    RELAY_ON_TIMEOUT: boolean;

    /**
     * Turn on based on saldo.
     */
    RELAY_ON_SALDO: boolean;

    /**
     * Turn off based on saldo.
     */
    RELAY_OFF_SALDO: boolean;

    /**
     * Turn off based on saldo with condition.
     */
    RELAY_OFF_SALDO_SOFT: boolean;
}

export interface ISpeedOptoPortOperatorParameter {
    /**
     * Baud rate of the PLC (UART_0): `2400` or `9600`.
     *
     * | Value | Baud Rate |
     * | ----- | --------- |
     * | `0`   | `9600`    |
     * | `2`   | `2400`    |
     * | `4`   | `9600`    |
     */
    plc: typeof baudRates.RATE_2400 | typeof baudRates.RATE_9600,

    /**
     * Baud rate of the optoport (UART_1): `2400` or `9600`.
     *
     * | Value | Baud Rate |
     * | ----- | --------- |
     * | `0`   | `2400`    |
     * | `2`   | `2400`    |
     * | `4`   | `9600`    |
     */
    optoport: typeof baudRates.RATE_2400 | typeof baudRates.RATE_9600
}

export interface ITypeMeterOperatorParameter {
    /**
     * Consideration of transformation ratio.
     *
     * `false` - without transformation ratio,
     * `true` - with transformation ratio.
     */
    TRANSFORMATION_RATIO: boolean;

    /**
     * Meter type.
     *
     * `true` - `R`-type meter.
     */
    METER_TYPE_R: boolean;

    /**
     * Reactive energy accumulation type.
     *
     * `false` - reactive energy accumulation by quadrants `Q1`, `Q2`, `Q3`, `Q4`;
     * `true` - reactive energy accumulation by `R+`, `R-`.
     *
     * Since build `302.19.XXX` (`XXX` - decimal number) for `G`-type meters, the energies `R+` and `R-` are accumulated and displayed similarly to `R`-type meters.
     * Reactive energy by quadrants is not accumulated.
     */
    ACCUMULATE_BY_R_PLUS_MINUS: boolean;
}

export interface IOperatorParameters {
    /**
     * Maximum voltage threshold, mV.
     */
    vpThreshold: types.TUint32,

    /**
     * Minimum voltage threshold, mV.
     */
    vThreshold: types.TUint32,

    /**
     * Maximum current threshold, mA.
     */
    ipThreshold: types.TUint32,

    /**
     * Maximum active power threshold for tariff `T1`, Watts.
     */
    pmaxThreshold0: types.TUint32,

    /**
     * Maximum active power threshold for tariff `T2`, Watts.
     */
    pmaxThreshold1: types.TUint32,

    /**
     * Maximum active power threshold for tariff `T3`, Watts.
     */
    pmaxThreshold2: types.TUint32,

    /**
     * Maximum active power threshold for tariff `T4`, Watts.
     */
    pmaxThreshold3: types.TUint32,

    /**
     * Maximum reactive power threshold for tariff `T1`, VAR.
     */
    rmaxThreshold0: types.TUint32,

    /**
     * Maximum reactive power threshold for tariff `T2`, VAR.
     */
    rmaxThreshold1: types.TUint32,

    /**
     * Maximum reactive power threshold for tariff `T3`, VAR.
     */
    rmaxThreshold2: types.TUint32,

    /**
     * Maximum reactive power threshold for tariff `T4`, VAR.
     */
    rmaxThreshold3: types.TUint32,

    /**
     * Power averaging interval, in minutes (`1`-`60`).
     */
    tint: types.TUint8,

    /**
     * Start date of the monthly billing period.
     */
    calcPeriodDate: types.TUint8,

    /**
     * Display active time.
     */
    timeoutDisplay: types.TUint8,

    /**
     * Display active time for each screen.
     */
    timeoutScreen: types.TUint8,

    /**
     * Display settings for meter readings (first `32` screens).
     */
    displaySet1: IDisplaySet1OperatorParameter,

    /**
     * Display settings for meter readings.
     */
    displaySet2: IDisplaySet2OperatorParameter,

    /**
     * Display settings for meter readings.
     */
    displaySet3: IDisplaySet3OperatorParameter,

    /**
     * Relay settings.
     */
    relaySet: IRelaySetOperatorParameter,

    /**
     * Controls the data transmission speed for UART interfaces.
     */
    speedOptoPort: ISpeedOptoPortOperatorParameter,

    /**
     * Integration period for energy profiles.
     *
     * `15` - `15` minutes; `0`, `30` - `30` minutes; `60` - `60` minutes.
     *
     * since build `0.0.17`
     */
    ten: types.TUint8,

    /**
     * Voltage averaging interval.
     *
     * `0`, `1`, `3`, `5`, `10`, `15`, `30` minutes.
     *
     * since build `0.0.17`
     */
    tu: types.TUint8,

    /**
     * Interval for tracking power off events, in minutes.
     *
     * since build `0.0.17`
     */
    timeIntervalPowerOff: types.TUint8,

    /**
     * Reserved byte.
     */
    reserved: types.TUint8,

    /**
     * Timeout for relay deactivation due to poor voltage, seconds.
     */
    timeoutBadVAVB: types.TUint8,

    /**
     * Maximum threshold for the frequency of the grid voltage.
     */
    freqMax: types.TUint8,

    /**
     * Minimum threshold for the frequency of the grid voltage.
     */
    freqMin: types.TUint8,

    /**
     * Year of parameters recording.
     */
    year: types.TUint8,

    /**
     * Month of parameters recording.
     */
    month: types.TUint8,

    /**
     * Date of parameters recording.
     */
    date: types.TUint8,

    /**
     * The number of digits after the decimal point for displaying energy values.
     *
     * | Value  | Mode  |
     * | ------ | ----- |
     * | `0x00` | `8+0` |
     * | `0x01` | `7+1` |
     * | `0x02` | `6+2` |
     * | `0x03` | `5+3` |
     */
    energyDecimalPoint: types.TUint8,

    /**
     * Numerator of the voltage transformation ratio.
     */
    voltageTransformationRatioNumerator: types.TUint16,

    /**
     * Denominator of the voltage transformation ratio.
     */
    voltageTransformationRatioDenominator: types.TUint16,

    /**
     * Numerator of the current transformation ratio.
     */
    currentTransformationRatioNumerator: types.TUint16,

    /**
     * Denominator of the current transformation ratio.
     */
    currentTransformationRatioDenominator: types.TUint16,

    /**
     * Measurement type settings.
     */
    typeMeter: ITypeMeterOperatorParameter,

    /**
     * Minimum threshold for the `cos φ` value.
     */
    phMin: types.TUint16,

    /**
     * Timeout for relay deactivation based on maximum current.
     */
    timeoutIMax: types.TUint8,

    /**
     * Timeout for relay deactivation based on maximum power.
     */
    timeoutPMax: types.TUint8,

    /**
     * Timeout for relay deactivation based on `cos φ`.
     */
    timeoutCos: types.TUint8,

    /**
     * `0` - `PMAX` = `POWER_A` + `POWER_B` + `POWER_C`;
     * `1` - `PMAX` is the averaged power over the integration period.
     */
    pMaxDef: types.TUint8,

    /**
     * Display settings for meter readings.
     */
    displaySet4: IDisplaySet4OperatorParameter
}

export interface IDefine1OperatorParameterExtended {
    /**
     * `true` - enable resetting daily maximum power using button.
     */
    RESET_DAY_MAX_POWER_KEY: boolean,

    /**
     * `true` - enable resetting monthly maximum power using button.
     */
    RESET_MONTH_MAX_POWER_KEY: boolean,

    /**
     * `true` - optoport is unlocked by button, `false` - optoport is always unlocked.
     */
    BLOCK_KEY_OPTOPORT: boolean,

    /**
     * `true` - enable constant magnetic field screen.
     *
     * since build `302.35.005`
     */
    MAGNET_SCREEN_CONST: boolean

    /**
     * `true` - enable display indication in battery mode.
     *
     * since build `0.0.17`
     */
    ALLOW_BROWNOUT_INDICATION: boolean
}

export interface IOperatorParametersExtended {
    /**
     * Timeout for automatic relay activation based on `IMAX`, `PMAX`, `IDIFF`, `COSFI` in minutes.
     */
    timeoutRelayOn: types.TUint8,

    /**
     * Setting for optoport, constant magnetic field screen, resetting power, and battery mode indication.
     */
    define1: IDefine1OperatorParameterExtended,

    /**
     * Timeout for relay activation based on `IMAX`, `PMAX`, `IDIFF`, `COSFI` in seconds.
     */
    timeoutRelayKey: types.TUint8,

    /**
     * Timeout for relay activation upon restoration of quality voltage, in seconds.
     */
    timeoutRelayAuto: types.TUint8
}

/** Can represent two different sets of energies depending on the value of {@link TEnergyType | energy type}. */
export interface IEnergies {
    /**
     * Active energy by tariff.
     *
     * For energy type `1`: `A+` (`1.8.1`, `1.8.2`, `1.8.3`, `1.8.4`).
     *
     * For energy type `2`: `A-` (`2.8.1`, `2.8.2`, `2.8.3`, `2.8.4`).
     */
    wh: Array<types.TInt32 | null>,

    /**
     * Reactive energy by tariff.
     *
     * For energy type `1`:
     * - for type `R` meters: `R+` (`3.8.1`, `3.8.2`, `3.8.3`, `3.8.4`)
     * - for type `G` meters: `A+R+` (`5.8.1`, `5.8.2`, `5.8.3`, `5.8.4`)
     *
     * For energy type `2`:
     * - for type `G` meters: `A-R+` (`6.8.1`, `6.8.2`, `6.8.3`, `6.8.4`)
     *
     * Since build `302.19.XXX` (`XXX` - decimal number) for `G` meters, the accumulated and displayed energies are `R+` instead of `A+R+`, `A-R+`.
     */
    vari: Array<types.TInt32 | null>,

    /**
     * Negative reactive energy by tariff.
     *
     * For energy type `1`:
     * - for type `R` meters: `R-` (`4.8.1`, `4.8.2`, `4.8.3`, `4.8.4`)
     * - for type `G` meters: `A+R-` (`8.8.1`, `8.8.2`, `8.8.3`, `8.8.4`)
     *
     * For energy type `2`:
     * - for type `G` meters: `A-R-` (`7.8.1`, `7.8.2`, `7.8.3`, `7.8.4`)
     *
     * Since build `302.19.XXX` (`XXX` - decimal number) for `G` meters, the accumulated and displayed energies are `R-` instead of `A+R-`, `A-R-`.
     */
    vare: Array<types.TInt32 | null>
}

export interface IPackedEnergiesWithType {
    energyType?: TEnergyType,

    energies: IEnergies
}

/**
 * Array of energy values for each half-hour interval.
 *
 * since build 302.25.001
 *
 * In previous versions, this field also included tariff information.
 */
type TEnergyPeriods = Array<types.TUint32 | undefined>;

export interface IGetHalfHourDemandResponseParameters {
    date: types.IDate,

    energies: TEnergyPeriods,

    /**
     * If DST start/end of this day, contain DST hour.
     */
    dstHour?: types.TUint8
}

export interface IMaxDemand {
    /** hour */
    hourPmax: types.TUint8,
    /** minute */
    minPmax: types.TUint8,
    pmax: types.TInt32,
    /** hour */
    hourVariMax: types.TUint8,
    /** minute */
    minVariMax: types.TUint8,
    variMax: types.TInt32,
    /** hour */
    hourVareMax: types.TUint8,
    /** minute */
    minVareMax: types.TUint8,
    vareMax: types.TInt32
}

export interface IGetDayMaxDemandResponseParameters {
    date: types.IDate,

    /** values for 4 tariffs */
    maxDemands: Array<IMaxDemand>
}

export interface IGetMonthMaxDemandResponseParameters {
    date: {
        year: types.TYear2000,
        month: types.TMonth,
    },

    /** values for 4 tariffs */
    maxDemands: Array<IMaxDemand>
}

export interface IGetDemandParameters {
    /**
     * Packed date.
     */
    date: types.IDate,

    demandParam: TDemandParam,

    /**
     * Starting block number of requested data.
     *
     * Possible values:
     *
     * | Period | Value range |
     * | ------ | ----------- |
     * | `1`    | `0`..`1440` |
     * | `3`    | `0`..`480`  |
     * | `5`    | `0`..`288`  |
     * | `10`   | `0`..`144`  |
     * | `15`   | `0`..`96`   |
     * | `30`   | `0`..`48`   |
     * | `60`   | `0`..`24`   |
     */
    firstIndex: types.TUint16,

    /**
     * Number of requested blocks (`48` max).
     */
    count: types.TUint8,

    /**
     * Accumulation period (`0` – `30` minutes, `1`, `3`, `5`, `10`, `15`, `30`, `60` minutes).
     * Depends on the `ten` parameter in {@link IOperatorParameters}.
     */
    period: types.TUint8
}

export interface IGetDemandResponseParameters extends IGetDemandParameters {
    /**
     * Load data.
     */
    demands: Array<types.TUint16>
}

/**
 * Type of energy, or other parameters for averaged energy and voltage profiles.
 *
 * | Value  | Description                                                                     |
 * | ------ | ------------------------------------------------------------------------------- |
 * | `1`    | get `ten` = `1/3/5/10/15/30/60`-minute load profile `A+` phase `A`              |
 * | `2`    | get `1/3/5/10/15/30/60`-minute load profile `A+` phase `B`                      |
 * | `3`    | get `1/3/5/10/15/30/60`-minute load profile `A+` phase `C`                      |
 * | `4`    | get `1/3/5/10/15/30/60`-minute load profile `A-` phase `A`                      |
 * | `5`    | get `1/3/5/10/15/30/60`-minute load profile `A-` phase `B`                      |
 * | `6`    | get `1/3/5/10/15/30/60`-minute load profile `A-` phase `C`                      |
 * | `7`    | get `1/3/5/10/15/30/60`-minute load profile `A+R+` phase `A`                    |
 * | `8`    | get `1/3/5/10/15/30/60`-minute load profile `A+R+` phase `B`                    |
 * | `9`    | get `1/3/5/10/15/30/60`-minute load profile `A+R+` phase `C`                    |
 * | `10`   | get `1/3/5/10/15/30/60`-minute load profile `A+R-` phase `A`                    |
 * | `11`   | get `1/3/5/10/15/30/60`-minute load profile `A+R-` phase `B`                    |
 * | `12`   | get `1/3/5/10/15/30/60`-minute load profile `A+R-` phase `C`                    |
 * | `13`   | get `1/3/5/10/15/30/60`-minute load profile `A-R+` phase `A`                    |
 * | `14`   | get `1/3/5/10/15/30/60`-minute load profile `A-R+` phase `B`                    |
 * | `15`   | get `1/3/5/10/15/30/60`-minute load profile `A-R+` phase `C`                    |
 * | `16`   | get `1/3/5/10/15/30/60`-minute load profile `A-R-` phase `A`                    |
 * | `17`   | get `1/3/5/10/15/30/60`-minute load profile `A-R-` phase `B`                    |
 * | `18`   | get `1/3/5/10/15/30/60`-minute load profile `A-R-` phase `C`                    |
 * | `19`   | get `1/3/5/10/15/30/60`-minute load profile `R+` phase `A`                      |
 * | `20`   | get `1/3/5/10/15/30/60`-minute load profile `R+` phase `B`                      |
 * | `21`   | get `1/3/5/10/15/30/60`-minute load profile `R+` phase `C`                      |
 * | `22`   | get `1/3/5/10/15/30/60`-minute load profile `R-` phase `A`                      |
 * | `23`   | get `1/3/5/10/15/30/60`-minute load profile `R-` phase `B`                      |
 * | `24`   | get `1/3/5/10/15/30/60`-minute load profile `R-` phase `C`                      |
 * | `25`   | get `1/3/5/10/15/30/60`-minute voltage profile phase `A`                        |
 * | `26`   | get `1/3/5/10/15/30/60`-minute voltage profile phase `B`                        |
 * | `27`   | get `1/3/5/10/15/30/60`-minute voltage profile phase `C`                        |
 * | `28`   | get `10`-minute voltage profile phase `A`                                       |
 * | `29`   | get `10`-minute voltage profile phase `B`                                       |
 * | `30`   | get `10`-minute voltage profile phase `C`                                       |
 * | `31`   | get `1/3/5/10/15/30/60`-minute current profile phase `A`                        |
 * | `32`   | get `1/3/5/10/15/30/60`-minute current profile phase `B`                        |
 * | `33`   | get `1/3/5/10/15/30/60`-minute current profile phase `C`                        |
 * | `0x81` | get `1/3/5/10/15/30/60`-minute active energy profile (`A+`) `1.4.0`             |
 * | `0x82` | get `1/3/5/10/15/30/60`-minute active energy profile (`A-`) `2.4.0`             |
 * | `0x84` | get `1/3/5/10/15/30/60`-minute reactive energy profile `A+R+` `3.4.0` (`7.4.0`) |
 * | `0x88` | get `1/3/5/10/15/30/60`-minute reactive energy profile `A+R-` `4.4.0` (`8.4.0`) |
 * | `0x90` | get `1/3/5/10/15/30/60`-minute reactive energy profile `A-R+` `5.4.0`           |
 * | `0xA0` | get `1/3/5/10/15/30/60`-minute reactive energy profile `A-R-` `6.4.0`           |
 * | `0xB0` | get profile recorded in `Channel 1`                                             |
 * | `0xB1` | get profile recorded in `Channel 2`                                             |
 * | `0xB2` | get profile recorded in `Channel 3`                                             |
 * | `0xB3` | get profile recorded in `Channel 4`                                             |
 * | `0xB4` | get profile recorded in `Channel 5`                                             |
 * | `0xB5` | get profile recorded in `Channel 6`                                             |
 */
export type TDemandParam = types.TUint8;

/**
 * Load profile.
 *
 * | Value | Parameter                                                                    |
 * | ----- | ---------------------------------------------------------------------------- |
 * | `0`   | Get load profile specified by `channel`                                      |
 * | `1`   | Get `15/30/60`-minute load profile `A+` phase `A`                            |
 * | `2`   | Get `15/30/60`-minute load profile `A+` phase `B`                            |
 * | `3`   | Get `15/30/60`-minute load profile `A+` phase `C`                            |
 * | `4`   | Get `15/30/60`-minute load profile `A-` phase `A`                            |
 * | `5`   | Get `15/30/60`-minute load profile `A-` phase `B`                            |
 * | `6`   | Get `15/30/60`-minute load profile `A-` phase `C`                            |
 * | `7`   | Get `15/30/60`-minute load profile `A+R+` phase `A`                          |
 * | `8`   | Get `15/30/60`-minute load profile `A+R+` phase `B`                          |
 * | `9`   | Get `15/30/60`-minute load profile `A+R+` phase `C`                          |
 * | `10`  | Get `15/30/60`-minute load profile `A+R-` phase `A`                          |
 * | `11`  | Get `15/30/60`-minute load profile `A+R-` phase `B`                          |
 * | `12`  | Get `15/30/60`-minute load profile `A+R-` phase `C`                          |
 * | `13`  | Get `15/30/60`-minute load profile `A-R+` phase `A`                          |
 * | `14`  | Get `15/30/60`-minute load profile `A-R+` phase `B`                          |
 * | `15`  | Get `15/30/60`-minute load profile `A-R+` phase `C`                          |
 * | `16`  | Get `15/30/60`-minute load profile `A-R-` phase `A`                          |
 * | `17`  | Get `15/30/60`-minute load profile `A-R-` phase `B`                          |
 * | `18`  | Get `15/30/60`-minute load profile `A-R-` phase `C`                          |
 * | `19`  | Get `15/30/60`-minute load profile `R+` phase `A` (since build `302.17.009`) |
 * | `20`  | Get `15/30/60`-minute load profile `R+` phase `B` (since build `302.17.009`) |
 * | `21`  | Get `15/30/60`-minute load profile `R+` phase `C` (since build `302.17.009`) |
 * | `22`  | Get `15/30/60`-minute load profile `R-` phase `A` (since build `302.17.009`) |
 * | `23`  | Get `15/30/60`-minute load profile `R-` phase `B` (since build `302.17.009`) |
 * | `24`  | Get `15/30/60`-minute load profile `R-` phase `C` (since build `302.17.009`) |
 */
export type TChannelParameter = types.TUint8;

/**
 * Channel number from `0` to `5`.
 * If `channelParameter` is `0`, representing different load profiles.
 */
export type TChannel = types.TUint8;

export interface IRelaySetExtOperatorParameter2 {
    /**
     * Turn off relay upon detection of a magnetic field.
     */
    RELAY_OFF_MAGNET: boolean,

    /**
     * Turn on after timeout {@link IOperatorParametersExtended.timeoutRelayOn}.
     */
    RELAY_ON_MAGNET_TIMEOUT: boolean,

    /**
     * Turn on relay after removal of the magnetic field.
     */
    RELAY_ON_MAGNET_AUTO: boolean
}

/**
 * Load profile parameter number.
 *
 * | Value | Parameter                                                                    |
 * | ----- | ---------------------------------------------------------------------------- |
 * | `0`   | Additional load profile not used                                             |
 * | `1`   | Get `15/30/60`-minute load profile `A+` phase `A`                            |
 * | `2`   | Get `15/30/60`-minute load profile `A+` phase `B`                            |
 * | `3`   | Get `15/30/60`-minute load profile `A+` phase `C`                            |
 * | `4`   | Get `15/30/60`-minute load profile `A-` phase `A`                            |
 * | `5`   | Get `15/30/60`-minute load profile `A-` phase `B`                            |
 * | `6`   | Get `15/30/60`-minute load profile `A-` phase `C`                            |
 * | `7`   | Get `15/30/60`-minute load profile `A+R+` phase `A`                          |
 * | `8`   | Get `15/30/60`-minute load profile `A+R+` phase `B`                          |
 * | `9`   | Get `15/30/60`-minute load profile `A+R+` phase `C`                          |
 * | `10`  | Get `15/30/60`-minute load profile `A+R-` phase `A`                          |
 * | `11`  | Get `15/30/60`-minute load profile `A+R-` phase `B`                          |
 * | `12`  | Get `15/30/60`-minute load profile `A+R-` phase `C`                          |
 * | `13`  | Get `15/30/60`-minute load profile `A-R+` phase `A`                          |
 * | `14`  | Get `15/30/60`-minute load profile `A-R+` phase `B`                          |
 * | `15`  | Get `15/30/60`-minute load profile `A-R+` phase `C`                          |
 * | `16`  | Get `15/30/60`-minute load profile `A-R-` phase `A`                          |
 * | `17`  | Get `15/30/60`-minute load profile `A-R-` phase `B`                          |
 * | `18`  | Get `15/30/60`-minute load profile `A-R-` phase `C`                          |
 * | `19`  | Get `15/30/60`-minute load profile `R+` phase `A` (since build `302.17.009`) |
 * | `20`  | Get `15/30/60`-minute load profile `R+` phase `B` (since build `302.17.009`) |
 * | `21`  | Get `15/30/60`-minute load profile `R+` phase `C` (since build `302.17.009`) |
 * | `22`  | Get `15/30/60`-minute load profile `R-` phase `A` (since build `302.17.009`) |
 * | `23`  | Get `15/30/60`-minute load profile `R-` phase `B` (since build `302.17.009`) |
 * | `24`  | Get `15/30/60`-minute load profile `R-` phase `C` (since build `302.17.009`) |
 * | `25`  | Get `15/30`-minute voltage profile phase `A` (since build `20.03.23.0.0.19`) |
 * | `26`  | Get `15/30`-minute voltage profile phase `B` (since build `20.03.23.0.0.19`) |
 * | `27`  | Get `15/30`-minute voltage profile phase `C` (since build `20.03.23.0.0.19`) |
 * | `28`  | Get `10`-minute voltage profile phase `A` (since build `20.03.23.0.0.19`)    |
 * | `29`  | Get `10`-minute voltage profile phase `B` (since build `20.03.23.0.0.19`)    |
 * | `30`  | Get `10`-minute voltage profile phase `C` (since build `20.03.23.0.0.19`)    |
 * | `31`  | Get `15/30`-minute current profile phase `A` (since build `20.03.23.0.0.19`) |
 * | `32`  | Get `15/30`-minute current profile phase `B` (since build `20.03.23.0.0.19`) |
 * | `33`  | Get `15/30`-minute current profile phase `C` (since build `20.03.23.0.0.19`) |
 */
export type TChannelOperatorParameter2 = types.TUint8;

export interface IDisplaySet24OperatorParameter2 extends IDisplaySet4BaseOperatorParameter {
    /**
     * Optical port speed (for additional display only).
     */
    OPTOPORT_SPEED: boolean;

    /**
     * Magnetic induction (for additional display only).
     */
    MAGNET_INDUCTION: boolean;
}

export interface IOperatorParametersExtended2 {
    /**
     * Allowed correction interval.
     * This parameter can only be set with third-level access.
     */
    deltaCorMin: types.TUint8,

    /**
     * Timeout for relay deactivation due to magnetic interference, in seconds.
     */
    timeoutMagnetOff: types.TUint8,

    /**
     * Extended relay settings.
     */
    relaySetExt: IRelaySetExtOperatorParameter2,

    /**
     * Timeout for relay activation after removal of magnetic field, in seconds.
     */
    timeoutMagnetOn: types.TUint8,

    /**
     * Default PLC phase.
     *
     * | Value | Phase |
     * | ----- | ----- |
     * | `0`   | `A`   |
     * | `1`   | `A`   |
     * | `2`   | `B`   |
     * | `3`   | `C`   |
     */
    phaseDefault: types.TUint8,

    /**
     * Display settings for additional meter readings screens.
     *
     * since build `302.15.001`
     */
    displaySet21: IDisplaySet1OperatorParameter,

    /**
     * Display settings for additional meter readings screens.
     *
     * since build `302.15.001`
     */
    displaySet22: IDisplaySet2OperatorParameter

    /**
     * Display settings for additional meter readings screens.
     *
     * since build `302.15.001`
     */
    displaySet23: IDisplaySet3OperatorParameter,

    /**
     * Display settings for additional meter readings screens.
     *
     * since build `302.15.001`
     */
    displaySet24: IDisplaySet24OperatorParameter2,

    /**
     * Additional load profile parameter 1.
     *
     * since build `302.17.001`
     */
    channel1: TChannelOperatorParameter2,

    /**
     * Additional load profile parameter 2.
     *
     * since build `302.17.001`
     */
    channel2: TChannelOperatorParameter2,

    /**
     * Additional load profile parameter 3.
     *
     * since build `302.17.001`
     */
    channel3: TChannelOperatorParameter2,

    /**
     * Additional load profile parameter 4.
     *
     * since build `302.17.001`
     */
    channel4: TChannelOperatorParameter2,

    /**
     * Additional load profile parameter 5.
     *
     * since build `302.17.001`
     */
    channel5: TChannelOperatorParameter2,

    /**
     * Additional load profile parameter 6.
     *
     * since build `302.17.001`
     */
    channel6: TChannelOperatorParameter2,

    /**
     * Allowed correction period, in hours (`24` hours by default).
     */
    timeCorrectPeriod: types.TUint8,

    /**
     * Is the time correction with a transition across the half-hour boundary allowed.
     *
     * since build `302.25.001`
     */
    timeCorrectPassHalfhour: boolean
}

export interface IOperatorParametersExtended4 {
    /** Configuration for displaying meter readings in the main mode. */
    displaySet5: IDisplaySet5OperatorParameter,

    /** Configuration for displaying meter readings in the extended mode. */
    displaySet25: IDisplaySet5OperatorParameter,

    /** Configuration for displaying meter readings in the battery mode. */
    displaySet31: IDisplaySet1OperatorParameter,

    /** Configuration for displaying meter readings in the battery mode. */
    displaySet32: IDisplaySet1OperatorParameter,

    /** Configuration for displaying meter readings in the battery mode. */
    displaySet33: IDisplaySet1OperatorParameter,

    /** Configuration for displaying meter readings in the battery mode. */
    displaySet34: IDisplaySet1OperatorParameter,

    /** Configuration for displaying meter readings in the battery mode. */
    displaySet35: IDisplaySet5OperatorParameter
}

export interface IDisplaySet5OperatorParameter {
    /** Journal of event profile `P.98`. */
    EVENT: boolean,

    /** Journal of load graph profile `1.5.0` `P.01`. */
    PROFILE_P01: boolean,

    /** Journal of load graph profile `2.5.0` `P.02`. */
    PROFILE_P02: boolean,

    /** Journal of load graph profile `3.5.0` (`5.5.0`) `P.03`. */
    PROFILE_P03: boolean,

    /** Journal of load graph profile `4.5.0` (`6.5.0`) `P.05`. */
    PROFILE_P04: boolean,

    /** Journal of load graph profile `7.5.0` `P.05`. */
    PROFILE_P05: boolean,

    /** Journal of load graph profile `8.5.0` `P.06`. */
    PROFILE_P06: boolean
}


export const OPERATOR_PARAMETERS_SIZE = 95;
export const OPERATOR_PARAMETERS_EXTENDED_SIZE = 9;
export const OPERATOR_PARAMETERS_EXTENDED2_SIZE = 28;
export const OPERATOR_PARAMETERS_EXTENDED4_SIZE = 28;
export const PACKED_ENERGY_TYPE_SIZE = 1;
const ENERGY_TYPE_BITS = 4;


const displaySet1Mask = {
    SET_ALL_SEGMENT_DISPLAY: 1 << 0,
    SOFTWARE_VERSION: 1 << 1,
    TOTAL_ACTIVE_ENERGY: 1 << 2,
    ACTIVE_ENERGY_T1: 1 << 3,
    ACTIVE_ENERGY_T2: 1 << 4,
    ACTIVE_ENERGY_T3: 1 << 5,
    ACTIVE_ENERGY_T4: 1 << 6,
    TOTAL_REACTIVE_ENERGY: 1 << 7,
    REACTIVE_ENERGY_T1: 1 << 8,
    REACTIVE_ENERGY_T2: 1 << 9,
    REACTIVE_ENERGY_T3: 1 << 10,
    REACTIVE_ENERGY_T4: 1 << 11,
    TOTAL_NEGATIVE_REACTIVE_ENERGY: 1 << 12,
    NEGATIVE_REACTIVE_ENERGY_T1: 1 << 13,
    NEGATIVE_REACTIVE_ENERGY_T2: 1 << 14,
    NEGATIVE_REACTIVE_ENERGY_T3: 1 << 15,
    NEGATIVE_REACTIVE_ENERGY_T4: 1 << 16,
    TOTAL_EXPORTED_ACTIVE_ENERGY: 1 << 17,
    EXPORTED_ACTIVE_ENERGY_T1: 1 << 18,
    EXPORTED_ACTIVE_ENERGY_T2: 1 << 19,
    EXPORTED_ACTIVE_ENERGY_T3: 1 << 20,
    EXPORTED_ACTIVE_ENERGY_T4: 1 << 21,
    TOTAL_EXPORTED_REACTIVE_ENERGY: 1 << 22,
    EXPORTED_REACTIVE_ENERGY_T1: 1 << 23,
    EXPORTED_REACTIVE_ENERGY_T2: 1 << 24,
    EXPORTED_REACTIVE_ENERGY_T3: 1 << 25,
    EXPORTED_REACTIVE_ENERGY_T4: 1 << 26,
    TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: 1 << 27,
    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: 1 << 28,
    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: 1 << 29,
    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: 1 << 30,
    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: 1 << 31
};

const displaySet2Mask = {
    CURRENT_IN_PHASE_A: 1 << 0,
    CURRENT_IN_PHASE_B: 1 << 1,
    CURRENT_IN_PHASE_C: 1 << 2,
    CURRENT_IN_NEUTRAL: 1 << 3,
    VOLTAGE_IN_PHASE_A: 1 << 4,
    VOLTAGE_IN_PHASE_B: 1 << 5,
    VOLTAGE_IN_PHASE_C: 1 << 6,
    BATTERY_VOLTAGE: 1 << 7,
    FREQUENCY: 1 << 8,
    ACTIVE_POWER_SUM: 1 << 9,
    ACTIVE_POWER_PHASE_A: 1 << 10,
    ACTIVE_POWER_PHASE_B: 1 << 11,
    ACTIVE_POWER_PHASE_C: 1 << 12,
    REACTIVE_POWER_QPLUS_SUM: 1 << 13,
    REACTIVE_POWER_QPLUS_PHASE_A: 1 << 14,
    REACTIVE_POWER_QPLUS_PHASE_B: 1 << 15,
    REACTIVE_POWER_QPLUS_PHASE_C: 1 << 16,
    REACTIVE_POWER_QMINUS_SUM: 1 << 17,
    REACTIVE_POWER_QMINUS_PHASE_A: 1 << 18,
    REACTIVE_POWER_QMINUS_PHASE_B: 1 << 19,
    REACTIVE_POWER_QMINUS_PHASE_C: 1 << 20,
    POWER_COEFFICIENT_SUM: 1 << 21,
    POWER_COEFFICIENT_PHASE_A: 1 << 22,
    POWER_COEFFICIENT_PHASE_B: 1 << 23,
    POWER_COEFFICIENT_PHASE_C: 1 << 24,
    APPARENT_POWER_QPLUS_SUM: 1 << 25,
    APPARENT_POWER_QPLUS_PHASE_A: 1 << 26,
    APPARENT_POWER_QPLUS_PHASE_B: 1 << 27,
    APPARENT_POWER_QPLUS_PHASE_C: 1 << 28,
    APPARENT_POWER_QMINUS_SUM: 1 << 29,
    APPARENT_POWER_QMINUS_PHASE_A: 1 << 30,
    APPARENT_POWER_QMINUS_PHASE_B: 1 << 31
};

const displaySet3Mask = {
    APPARENT_POWER_QMINUS_PHASE_C: 1 << 0,
    MAX_ACTIVE_POWER_DAY_T1: 1 << 1,
    MAX_ACTIVE_POWER_DAY_T2: 1 << 2,
    MAX_ACTIVE_POWER_DAY_T3: 1 << 3,
    MAX_ACTIVE_POWER_DAY_T4: 1 << 4,
    MAX_ACTIVE_POWER_MONTH_T1: 1 << 5,
    MAX_ACTIVE_POWER_MONTH_T2: 1 << 6,
    MAX_ACTIVE_POWER_MONTH_T3: 1 << 7,
    MAX_ACTIVE_POWER_MONTH_T4: 1 << 8,
    MAX_REACTIVE_POWER_DAY_T1: 1 << 9,
    MAX_REACTIVE_POWER_DAY_T2: 1 << 10,
    MAX_REACTIVE_POWER_DAY_T3: 1 << 11,
    MAX_REACTIVE_POWER_DAY_T4: 1 << 12,
    MAX_REACTIVE_POWER_MONTH_T1: 1 << 13,
    MAX_REACTIVE_POWER_MONTH_T2: 1 << 14,
    MAX_REACTIVE_POWER_MONTH_T3: 1 << 15,
    MAX_REACTIVE_POWER_MONTH_T4: 1 << 16,
    MAX_NEGATIVE_REACTIVE_POWER_DAY_T1: 1 << 17,
    MAX_NEGATIVE_REACTIVE_POWER_DAY_T2: 1 << 18,
    MAX_NEGATIVE_REACTIVE_POWER_DAY_T3: 1 << 19,
    MAX_NEGATIVE_REACTIVE_POWER_DAY_T4: 1 << 20,
    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1: 1 << 21,
    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2: 1 << 22,
    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3: 1 << 23,
    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4: 1 << 24,
    MAX_EXPORTED_ACTIVE_POWER_DAY_T1: 1 << 25,
    MAX_EXPORTED_ACTIVE_POWER_DAY_T2: 1 << 26,
    MAX_EXPORTED_ACTIVE_POWER_DAY_T3: 1 << 27,
    MAX_EXPORTED_ACTIVE_POWER_DAY_T4: 1 << 28,
    MAX_EXPORTED_ACTIVE_POWER_MONTH_T1: 1 << 29,
    MAX_EXPORTED_ACTIVE_POWER_MONTH_T2: 1 << 30,
    MAX_EXPORTED_ACTIVE_POWER_MONTH_T3: 1 << 31
};

export const displaySet4BaseMask = {
    MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: 1 << 0,
    MAX_EXPORTED_REACTIVE_POWER_DAY_T1: 1 << 1,
    MAX_EXPORTED_REACTIVE_POWER_DAY_T2: 1 << 2,
    MAX_EXPORTED_REACTIVE_POWER_DAY_T3: 1 << 3,
    MAX_EXPORTED_REACTIVE_POWER_DAY_T4: 1 << 4,
    MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: 1 << 5,
    MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: 1 << 6,
    MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: 1 << 7,
    MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: 1 << 8,
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T1: 1 << 9,
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T2: 1 << 10,
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T3: 1 << 11,
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T4: 1 << 12,
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T1: 1 << 13,
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T2: 1 << 14,
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T3: 1 << 15,
    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T4: 1 << 16,
    HOUR_MINUTE_SECOND: 1 << 17,
    DATE_MONTH_YEAR: 1 << 18,
    CURRENT_TRANSFORMATION_RATIO: 1 << 19,
    VOLTAGE_TRANSFORMATION_RATIO: 1 << 20,
    CURRENT_BALANCE: 1 << 21,
    POWER_THRESHOLD_T1: 1 << 22,
    POWER_THRESHOLD_T2: 1 << 23,
    POWER_THRESHOLD_T3: 1 << 24,
    POWER_THRESHOLD_T4: 1 << 25
};

export const displaySet4Mask = {
    ...displaySet4BaseMask,
    SORT_DISPLAY_SCREENS: 1 << 29,
    AUTO_SCREEN_SCROLLING: 1 << 31
};

const displaySet5Mask = {
    EVENT: 1 << 0,
    PROFILE_P01: 1 << 1,
    PROFILE_P02: 1 << 2,
    PROFILE_P03: 1 << 3,
    PROFILE_P04: 1 << 4,
    PROFILE_P05: 1 << 5,
    PROFILE_P06: 1 << 6
};

export const relaySetMask = {
    RELAY_ON_Y: 1 << 0,
    RELAY_ON_CENTER: 1 << 1,
    RELAY_ON_PB: 1 << 2,
    RELAY_ON_TARIFF_0: 1 << 3,
    RELAY_ON_TARIFF_1: 1 << 4,
    RELAY_ON_TARIFF_2: 1 << 5,
    RELAY_ON_TARIFF_3: 1 << 6,
    RELAY_ON_V_GOOD: 1 << 7,
    RELAY_OFF_Y: 1 << 8,
    RELAY_OFF_CENTER: 1 << 9,
    RELAY_OFF_TARIFF_0: 1 << 10,
    RELAY_OFF_TARIFF_1: 1 << 11,
    RELAY_OFF_TARIFF_2: 1 << 12,
    RELAY_OFF_TARIFF_3: 1 << 13,
    RELAY_OFF_I_LIMIT: 1 << 14,
    RELAY_OFF_V_BAD: 1 << 15,
    RELAY_OFF_DIFF_BAD: 1 << 16,
    RELAY_OFF_LIM_TARIFF_0: 1 << 17,
    RELAY_OFF_LIM_TARIFF_1: 1 << 18,
    RELAY_OFF_LIM_TARIFF_2: 1 << 19,
    RELAY_OFF_LIM_TARIFF_3: 1 << 20,
    RELAY_OFF_LIM_VAR_TARIFF_0: 1 << 21,
    RELAY_OFF_LIM_VAR_TARIFF_1: 1 << 22,
    RELAY_OFF_LIM_VAR_TARIFF_2: 1 << 23,
    RELAY_OFF_LIM_VAR_TARIFF_3: 1 << 24,
    RELAY_ON_PF_MIN: 1 << 25,
    RELAY_OFF_PF_MIN: 1 << 26,
    RELAY_ON_TIMEOUT: 1 << 27,
    RELAY_ON_SALDO: 1 << 28,
    RELAY_OFF_SALDO: 1 << 29,
    RELAY_OFF_SALDO_SOFT: 1 << 30
};

const typeMeterMask = {
    TRANSFORMATION_RATIO: 1 << 0,
    METER_TYPE_R: 1 << 4,
    ACCUMULATE_BY_R_PLUS_MINUS: 1 << 7
};

export const define1Mask = {
    RESET_DAY_MAX_POWER_KEY: 1 << 0,
    RESET_MONTH_MAX_POWER_KEY: 1 << 1,
    BLOCK_KEY_OPTOPORT: 1 << 2,
    MAGNET_SCREEN_CONST: 1 << 5,
    ALLOW_BROWNOUT_INDICATION: 1 << 7
};

export const displaySet24Mask = {
    ...displaySet4BaseMask,
    OPTOPORT_SPEED: 1 << 26,
    MAGNET_INDUCTION: 1 << 27
};

export const relaySetExtMask = {
    RELAY_OFF_MAGNET: 1 << 0,
    RELAY_ON_MAGNET_TIMEOUT: 1 << 1,
    RELAY_ON_MAGNET_AUTO: 1 << 2
};


const getSpeedOptoPort = ( value: number ): ISpeedOptoPortOperatorParameter => ({
    plc: baudRates.valueToRate.plc[bitSet.extractBits(value, 4, 1)],
    optoport: baudRates.valueToRate.optoport[bitSet.extractBits(value, 4, 5)]
});

const setSpeedOptoPort = ( speedOptoPort: ISpeedOptoPortOperatorParameter ): number => {
    let result = 0;

    result = bitSet.fillBits(result, 4, 1, Number(baudRates.rateToValue.plc[speedOptoPort.plc]));
    result = bitSet.fillBits(result, 4, 5, Number(baudRates.rateToValue.optoport[speedOptoPort.optoport]));

    return result;
};

function getPackedEnergies ( buffer: ICommandBinaryBuffer, energyType: TEnergyType, tariffMapByte: number ): IEnergies {
    const byte = tariffMapByte >> ENERGY_TYPE_BITS;
    const wh = [];
    const vari = [];
    const vare = [];

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        // read flags by one bit
        const isTariffExists = !!bitSet.extractBits(byte, 1, index + 1);

        if ( isTariffExists ) {
            wh.push(buffer.getInt32());
            vari.push(buffer.getInt32());
            vare.push(buffer.getInt32());
        } else {
            wh.push(null);
            vari.push(null);
            vare.push(null);
        }
    }

    return {wh, vari, vare};
}

function getPackedEnergyType ( energyType: TEnergyType, energies: IEnergies ) {
    const {wh, vari, vare} = energies;
    const indexShift = 1 + ENERGY_TYPE_BITS;
    let tariffsByte = energyType;

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        // set flags by one bit
        tariffsByte = bitSet.fillBits(
            tariffsByte,
            1,
            index + indexShift,
            Number(!!wh[index] && !!vari[index] && !!vare[index])
        );
    }

    return tariffsByte;
}


export type ICommandBinaryBuffer = types.Modify<IMtxCommandBinaryBuffer, {
    // static methods
    getDefaultOperatorParameters (): IOperatorParameters,
    getDefaultOperatorParametersExtended (): IOperatorParametersExtended,
    getDefaultOperatorParametersExtended2 (): IOperatorParametersExtended2,

    // instance methods
    // getFrameHeader (): IFrameHeader,
    // setFrameHeader ( frameHeader: IFrameHeader ),

    getOperatorParameters(): IOperatorParameters,
    setOperatorParameters ( operatorParameters: IOperatorParameters),

    getOperatorParametersExtended(): IOperatorParametersExtended,
    setOperatorParametersExtended ( operatorParametersExtended: IOperatorParametersExtended),

    getEnergies(): IEnergies,
    setEnergies ( energies: IEnergies ),

    getPackedEnergyWithType (): IPackedEnergiesWithType,
    setPackedEnergyWithType ( {energyType, energies}: IPackedEnergiesWithType ),

    getEnergyPeriods ( energiesNumber: number ): TEnergyPeriods,
    setEnergyPeriods ( energies: TEnergyPeriods ),

    getMaxDemand (): IMaxDemand,
    setMaxDemand ( maxDemand: IMaxDemand ),

    getDayMaxDemandResponse (): IGetDayMaxDemandResponseParameters,
    setDayMaxDemandResponse ( event: IGetDayMaxDemandResponseParameters ),

    getMonthMaxDemandResponse (): IGetMonthMaxDemandResponseParameters,
    setMonthMaxDemandResponse ( event: IGetMonthMaxDemandResponseParameters ),

    getEvent (): IEvent,
    setEvent ( event: IEvent ),

    getDemand (): IGetDemandParameters,
    setDemand ( parameters: IGetDemandParameters ),

    getOperatorParametersExtended2(): IOperatorParametersExtended2,
    setOperatorParametersExtended2 ( operatorParametersExtended: IOperatorParametersExtended2 )

    getOperatorParametersExtended4(): IOperatorParametersExtended4,
    setOperatorParametersExtended4 ( operatorParametersExtended: IOperatorParametersExtended4 )
}>;


function CommandBinaryBuffer ( this: ICommandBinaryBuffer, dataOrLength: types.TBytes | number, isLittleEndian = false ) {
    MtxBinaryBuffer.call(this, dataOrLength, isLittleEndian);
}

// extending
CommandBinaryBuffer.prototype = Object.create(MtxBinaryBuffer.prototype);
CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;


CommandBinaryBuffer.getDefaultOperatorParameters = (): IOperatorParameters => (
    {
        vpThreshold: 265000,
        vThreshold: 156000,
        ipThreshold: 120000,
        pmaxThreshold0: 31800,
        pmaxThreshold1: 31800,
        pmaxThreshold2: 31800,
        pmaxThreshold3: 31800,
        rmaxThreshold0: 31800,
        rmaxThreshold1: 31800,
        rmaxThreshold2: 31800,
        rmaxThreshold3: 31800,
        tint: 30,
        calcPeriodDate: 1,
        timeoutDisplay: 127,
        timeoutScreen: 7,
        displaySet1: (bitSet.toObject(displaySet1Mask, 4229) as unknown) as IDisplaySet1OperatorParameter,
        displaySet2: (bitSet.toObject(displaySet2Mask, 139776) as unknown) as IDisplaySet2OperatorParameter,
        displaySet3: (bitSet.toObject(displaySet3Mask, 0) as unknown) as IDisplaySet3OperatorParameter,
        relaySet: (bitSet.toObject(relaySetMask, 771) as unknown) as IRelaySetOperatorParameter,
        speedOptoPort: getSpeedOptoPort(64),
        ten: 30,
        tu: 30,
        timeIntervalPowerOff: 3,
        reserved: 0,
        timeoutBadVAVB: 5,
        freqMax: 55,
        freqMin: 45,
        year: 0,
        month: 0,
        date: 0,
        energyDecimalPoint: 2,
        voltageTransformationRatioNumerator: 1,
        voltageTransformationRatioDenominator: 1,
        currentTransformationRatioNumerator: 1,
        currentTransformationRatioDenominator: 1,
        typeMeter: (bitSet.toObject(typeMeterMask, 0) as unknown) as ITypeMeterOperatorParameter,
        phMin: 0,
        timeoutIMax: 5,
        timeoutPMax: 5,
        timeoutCos: 5,
        pMaxDef: 1,
        displaySet4: (bitSet.toObject(displaySet4Mask, 2147876864) as unknown) as IDisplaySet4OperatorParameter
    }
);

CommandBinaryBuffer.getDefaultOperatorParametersExtended = (): IOperatorParametersExtended => (
    {
        timeoutRelayOn: 1,
        define1: (bitSet.toObject(define1Mask, 0) as unknown) as IDefine1OperatorParameterExtended,
        timeoutRelayKey: 0,
        timeoutRelayAuto: 5
    }
);

CommandBinaryBuffer.getDefaultOperatorParametersExtended2 = (): IOperatorParametersExtended2 => (
    {
        deltaCorMin: 0,
        timeoutMagnetOff: 5,
        relaySetExt: (bitSet.toObject(relaySetExtMask, 0) as unknown) as IRelaySetExtOperatorParameter2,
        timeoutMagnetOn: 5,
        phaseDefault: 3,
        displaySet21: (bitSet.toObject(displaySet1Mask, 4231) as unknown) as IDisplaySet1OperatorParameter,
        displaySet22: (bitSet.toObject(displaySet2Mask, 31597303) as unknown) as IDisplaySet2OperatorParameter,
        displaySet23: (bitSet.toObject(displaySet3Mask, 0) as unknown) as IDisplaySet3OperatorParameter,
        displaySet24: (bitSet.toObject(displaySet24Mask, 393216) as unknown) as IDisplaySet24OperatorParameter2,
        channel1: 0,
        channel2: 0,
        channel3: 0,
        channel4: 0,
        channel5: 0,
        channel6: 0,
        timeCorrectPeriod: 24,
        timeCorrectPassHalfhour: false
    }
);

CommandBinaryBuffer.getDefaultOperatorParametersExtended3 = MtxBinaryBuffer.getDefaultOperatorParametersExtended3;


// CommandBinaryBuffer.prototype.getFrameHeader = function (): IFrameHeader {
//     return {
//         type: this.getUint8(),
//         destination: this.getUint16(),
//         source: this.getUint16()
//     };
// };

// CommandBinaryBuffer.prototype.setFrameHeader = function ( {
//     type = defaultFrameHeader.type,
//     destination = defaultFrameHeader.destination,
//     source = defaultFrameHeader.source
// }: IFrameHeader ) {
//     this.setUint8(type);
//     this.setUint16(destination);
//     this.setUint16(source);
// };

CommandBinaryBuffer.prototype.getOperatorParameters = function (): IOperatorParameters {
    return {
        vpThreshold: this.getUint32(),
        vThreshold: this.getUint32(),
        ipThreshold: this.getUint32(),
        pmaxThreshold0: this.getUint32(),
        pmaxThreshold1: this.getUint32(),
        pmaxThreshold2: this.getUint32(),
        pmaxThreshold3: this.getUint32(),
        rmaxThreshold0: this.getUint32(),
        rmaxThreshold1: this.getUint32(),
        rmaxThreshold2: this.getUint32(),
        rmaxThreshold3: this.getUint32(),
        tint: this.getUint8(),
        calcPeriodDate: this.getUint8(),
        timeoutDisplay: this.getUint8(),
        timeoutScreen: this.getUint8(),
        displaySet1: (bitSet.toObject(displaySet1Mask, this.getUint32()) as unknown) as IDisplaySet1OperatorParameter,
        displaySet2: (bitSet.toObject(displaySet2Mask, this.getUint32()) as unknown) as IDisplaySet2OperatorParameter,
        displaySet3: (bitSet.toObject(displaySet3Mask, this.getUint32()) as unknown) as IDisplaySet3OperatorParameter,
        relaySet: (bitSet.toObject(relaySetMask, this.getUint32()) as unknown) as IRelaySetOperatorParameter,
        speedOptoPort: getSpeedOptoPort(this.getUint8()),
        ten: this.getUint8(),
        tu: this.getUint8(),
        timeIntervalPowerOff: this.getUint8(),
        reserved: this.getUint8(),
        timeoutBadVAVB: this.getUint8(),
        freqMax: this.getUint8(),
        freqMin: this.getUint8(),
        year: this.getUint8(),
        month: this.getUint8(),
        date: this.getUint8(),
        energyDecimalPoint: this.getUint8(),
        voltageTransformationRatioNumerator: this.getUint16(),
        voltageTransformationRatioDenominator: this.getUint16(),
        currentTransformationRatioNumerator: this.getUint16(),
        currentTransformationRatioDenominator: this.getUint16(),
        typeMeter: (bitSet.toObject(typeMeterMask, this.getUint8()) as unknown) as ITypeMeterOperatorParameter,
        phMin: this.getUint16(),
        timeoutIMax: this.getUint8(),
        timeoutPMax: this.getUint8(),
        timeoutCos: this.getUint8(),
        pMaxDef: this.getUint8(),
        displaySet4: (bitSet.toObject(displaySet4Mask, this.getUint32()) as unknown) as IDisplaySet4OperatorParameter
    };
};

CommandBinaryBuffer.prototype.setOperatorParameters = function ( operatorParameters: IOperatorParameters ) {
    this.setUint32(operatorParameters.vpThreshold);
    this.setUint32(operatorParameters.vThreshold);
    this.setUint32(operatorParameters.ipThreshold);
    this.setUint32(operatorParameters.pmaxThreshold0);
    this.setUint32(operatorParameters.pmaxThreshold1);
    this.setUint32(operatorParameters.pmaxThreshold2);
    this.setUint32(operatorParameters.pmaxThreshold3);
    this.setUint32(operatorParameters.rmaxThreshold0);
    this.setUint32(operatorParameters.rmaxThreshold1);
    this.setUint32(operatorParameters.rmaxThreshold2);
    this.setUint32(operatorParameters.rmaxThreshold3);
    this.setUint8(operatorParameters.tint);
    this.setUint8(operatorParameters.calcPeriodDate);
    this.setUint8(operatorParameters.timeoutDisplay);
    this.setUint8(operatorParameters.timeoutScreen);
    this.setUint32(bitSet.fromObject(displaySet1Mask, (operatorParameters.displaySet1 as unknown) as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(displaySet2Mask, (operatorParameters.displaySet2 as unknown) as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(displaySet3Mask, (operatorParameters.displaySet3 as unknown) as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(relaySetMask, (operatorParameters.relaySet as unknown) as bitSet.TBooleanObject));
    this.setUint8(setSpeedOptoPort(operatorParameters.speedOptoPort));
    this.setUint8(operatorParameters.ten);
    this.setUint8(operatorParameters.tu);
    this.setUint8(operatorParameters.timeIntervalPowerOff);
    this.setUint8(operatorParameters.reserved);
    this.setUint8(operatorParameters.timeoutBadVAVB);
    this.setUint8(operatorParameters.freqMax);
    this.setUint8(operatorParameters.freqMin);
    this.setUint8(operatorParameters.year);
    this.setUint8(operatorParameters.month);
    this.setUint8(operatorParameters.date);
    this.setUint8(operatorParameters.energyDecimalPoint);
    this.setUint16(operatorParameters.voltageTransformationRatioNumerator);
    this.setUint16(operatorParameters.voltageTransformationRatioDenominator);
    this.setUint16(operatorParameters.currentTransformationRatioNumerator);
    this.setUint16(operatorParameters.currentTransformationRatioDenominator);
    this.setUint8(bitSet.fromObject(typeMeterMask, (operatorParameters.typeMeter as unknown) as bitSet.TBooleanObject));
    this.setUint16(operatorParameters.phMin);
    this.setUint8(operatorParameters.timeoutIMax);
    this.setUint8(operatorParameters.timeoutPMax);
    this.setUint8(operatorParameters.timeoutCos);
    this.setUint8(operatorParameters.pMaxDef);
    this.setUint32(bitSet.fromObject(displaySet4Mask, (operatorParameters.displaySet4 as unknown) as bitSet.TBooleanObject));
};

CommandBinaryBuffer.prototype.getOperatorParametersExtended = function (): IOperatorParametersExtended {
    return {
        timeoutRelayOn: this.getUint8(),
        define1: (bitSet.toObject(define1Mask, this.getUint8()) as unknown) as IDefine1OperatorParameterExtended,
        timeoutRelayKey: this.getUint8(),
        timeoutRelayAuto: this.getUint8()
    };
};

CommandBinaryBuffer.prototype.setOperatorParametersExtended = function ( operatorParametersExtended: IOperatorParametersExtended ) {
    this.setUint8(operatorParametersExtended.timeoutRelayOn);
    this.setUint8(bitSet.fromObject(define1Mask, (operatorParametersExtended.define1 as unknown) as bitSet.TBooleanObject));
    this.setUint8(operatorParametersExtended.timeoutRelayKey);
    this.setUint8(operatorParametersExtended.timeoutRelayAuto);
    // reserved1
    this.setUint32(0);
    // reserved2
    this.setUint8(0);
};

CommandBinaryBuffer.prototype.getEnergies = function (): IEnergies {
    const wh = [];
    const vari = [];
    const vare = [];

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        wh.push(this.getInt32());
        vari.push(this.getInt32());
        vare.push(this.getInt32());
    }

    return {wh, vari, vare};
};

CommandBinaryBuffer.prototype.setEnergies = function ( parameters: IEnergies ) {
    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        this.setInt32(parameters.wh[index]);
        this.setInt32(parameters.vari[index]);
        this.setInt32(parameters.vare[index]);
    }
};

CommandBinaryBuffer.prototype.getPackedEnergyWithType = function (): IPackedEnergiesWithType {
    const byte = this.getUint8();
    const energyType = bitSet.extractBits(byte, ENERGY_TYPE_BITS, 1);
    const energies = getPackedEnergies(this, energyType, byte);

    return {
        energyType,
        energies
    };
};

CommandBinaryBuffer.prototype.setPackedEnergyWithType = function ( {energyType, energies}: IPackedEnergiesWithType ) {
    if ( energyType ) {
        const energyTypeByte = getPackedEnergyType(energyType, energies);
        const tariffsByte = energyTypeByte >> ENERGY_TYPE_BITS;
        this.setUint8(energyTypeByte);

        for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
            const isTariffExists = !!bitSet.extractBits(tariffsByte, 1, index + 1);

            if ( isTariffExists ) {
                this.setInt32(energies.wh[index]);
                this.setInt32(energies.vari[index]);
                this.setInt32(energies.vare[index]);
            }
        }

        return;
    }

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        this.setInt32(energies.wh[index]);
        this.setInt32(energies.vari[index]);
        this.setInt32(energies.vare[index]);
    }
};

CommandBinaryBuffer.prototype.getEnergyPeriods = function ( energiesNumber: number ): TEnergyPeriods {
    return new Array(energiesNumber).fill(0).map(() => {
        const energy = this.getUint16();

        return energy === 0xffff ? undefined : energy;
    });
};

CommandBinaryBuffer.prototype.setEnergyPeriods = function ( energies: TEnergyPeriods ) {
    energies.forEach(energy => this.setUint16(energy === undefined ? 0xffff : energy));
};

CommandBinaryBuffer.prototype.getMaxDemand = function (): IMaxDemand {
    return {
        hourPmax: this.getUint8(),
        minPmax: this.getUint8(),
        pmax: this.getInt32(),
        hourVariMax: this.getUint8(),
        minVariMax: this.getUint8(),
        variMax: this.getInt32(),
        hourVareMax: this.getUint8(),
        minVareMax: this.getUint8(),
        vareMax: this.getInt32()
    };
};

CommandBinaryBuffer.prototype.setMaxDemand = function ( maxDemand: IMaxDemand ) {
    this.setUint8(maxDemand.hourPmax);
    this.setUint8(maxDemand.minPmax);
    this.setInt32(maxDemand.pmax);
    this.setUint8(maxDemand.hourVariMax);
    this.setUint8(maxDemand.minVariMax);
    this.setInt32(maxDemand.variMax);
    this.setUint8(maxDemand.hourVareMax);
    this.setUint8(maxDemand.minVareMax);
    this.setInt32(maxDemand.vareMax);
};

CommandBinaryBuffer.prototype.getDayMaxDemandResponse = function (): IGetDayMaxDemandResponseParameters {
    const date = this.getDate();

    // 4 tariffs
    const maxDemands = new Array(TARIFF_NUMBER).fill(0).map(() => this.getMaxDemand());

    return {date, maxDemands};
};

CommandBinaryBuffer.prototype.setDayMaxDemandResponse = function ( parameters: IGetDayMaxDemandResponseParameters ) {
    this.setDate(parameters.date);

    // 4 tariffs
    parameters.maxDemands.forEach(value => this.setMaxDemand(value));
};

CommandBinaryBuffer.prototype.getMonthMaxDemandResponse = function (): IGetMonthMaxDemandResponseParameters {
    const date = {
        year: this.getUint8(),
        month: this.getUint8()
    };

    // 4 tariffs
    const maxDemands = new Array(TARIFF_NUMBER).fill(0).map(() => this.getMaxDemand());

    return {date, maxDemands};
};

CommandBinaryBuffer.prototype.setMonthMaxDemandResponse = function ( parameters: IGetMonthMaxDemandResponseParameters ) {
    this.setUint8(parameters.date.year);
    this.setUint8(parameters.date.month);

    // 4 tariffs
    parameters.maxDemands.forEach(value => this.setMaxDemand(value));
};

CommandBinaryBuffer.prototype.getEvent = function (): IEvent {
    const data: IEvent = {
        hours: this.getUint8(),
        minutes: this.getUint8(),
        seconds: this.getUint8(),
        event: this.getUint8()
    };
    const {event} = data;
    const {bytesLeft} = this;

    data.eventName = eventNames[event];

    switch ( event ) {
        case events.POWER_OVER_RELAY_OFF:
            if ( bytesLeft < 4 ) {
                return data;
            }

            data.power = [this.getUint8(), this.getUint8(), this.getUint8(), this.getUint8()];
            break;

        case events.CMD_CHANGE_TIME:
        case events.TIME_CORRECT:
            if ( bytesLeft < 8 ) {
                return data;
            }

            data.newDate = this.getDateTime();
            break;

        default:
            break;
    }

    return data;
};

CommandBinaryBuffer.prototype.setEvent = function ( event: IEvent ) {
    this.setUint8(event.hours);
    this.setUint8(event.minutes);
    this.setUint8(event.seconds);
    this.setUint8(event.event);

    switch ( event.event ) {
        case events.POWER_OVER_RELAY_OFF:
            for ( const item of event.power ) {
                this.setUint8(item);
            }
            break;

        case events.CMD_CHANGE_TIME:
        case events.TIME_CORRECT:
            this.setDateTime(event.newDate);
            break;

        default: break;
    }
};

CommandBinaryBuffer.prototype.getDemand = function (): IGetDemandParameters {
    const date0 = this.getUint8();
    const date1 = this.getUint8();

    return {
        date: {
            year: date0 >> 1,
            month: ((date0 << 3) & 0x0f) | (date1 >> 5),
            date: date1 & 0x1f
        },
        demandParam: this.getUint8(),
        firstIndex: this.getUint16(),
        count: this.getUint8(),
        period: this.getUint8()
    };
};

CommandBinaryBuffer.prototype.setDemand = function ( parameters: IGetDemandParameters ) {
    const date0 = (parameters.date.year << 1) | ((parameters.date.month >> 3) & 0x01);
    const date1 = ((parameters.date.month << 5) & 0xe0) | (parameters.date.date & 0x1f);

    this.setUint8(date0);
    this.setUint8(date1);
    this.setUint8(parameters.demandParam);
    this.setUint16(parameters.firstIndex);
    this.setUint8(parameters.count);
    this.setUint8(parameters.period);
};

CommandBinaryBuffer.prototype.getOperatorParametersExtended2 = function (): IOperatorParametersExtended2 {
    const operatorParametersExtended2 = {
        deltaCorMin: this.getUint8(),
        timeoutMagnetOff: this.getUint8(),
        relaySetExt: (bitSet.toObject(relaySetExtMask, this.getUint8()) as unknown) as IRelaySetExtOperatorParameter2,
        timeoutMagnetOn: this.getUint8(),
        phaseDefault: this.getUint8(),
        displaySet21: (bitSet.toObject(displaySet1Mask, this.getUint32()) as unknown) as IDisplaySet1OperatorParameter,
        displaySet22: (bitSet.toObject(displaySet2Mask, this.getUint32()) as unknown) as IDisplaySet2OperatorParameter,
        displaySet23: (bitSet.toObject(displaySet3Mask, this.getUint32()) as unknown) as IDisplaySet3OperatorParameter,
        displaySet24: (bitSet.toObject(displaySet24Mask, this.getUint32()) as unknown) as IDisplaySet24OperatorParameter2,
        channel1: this.getUint8(),
        channel2: this.getUint8(),
        channel3: this.getUint8(),
        channel4: this.getUint8(),
        channel5: this.getUint8(),
        channel6: this.getUint8(),
        timeCorrectPeriod: 0,
        timeCorrectPassHalfhour: false
    };

    const timeCorrectPeriod = this.getUint8();

    operatorParametersExtended2.timeCorrectPeriod = timeCorrectPeriod & 0x7f;
    operatorParametersExtended2.timeCorrectPassHalfhour = !!(timeCorrectPeriod & 0x80);

    return operatorParametersExtended2;
};

CommandBinaryBuffer.prototype.setOperatorParametersExtended2 = function ( operatorParametersExtended2: IOperatorParametersExtended2 ) {
    const timeCorrectPeriod = operatorParametersExtended2.timeCorrectPeriod
        | (operatorParametersExtended2.timeCorrectPassHalfhour ? 0x80 : 0);

    this.setUint8(operatorParametersExtended2.deltaCorMin);
    this.setUint8(operatorParametersExtended2.timeoutMagnetOff);
    this.setUint8(bitSet.fromObject(relaySetExtMask, operatorParametersExtended2.relaySetExt as unknown as bitSet.TBooleanObject));
    this.setUint8(operatorParametersExtended2.timeoutMagnetOn);
    this.setUint8(operatorParametersExtended2.phaseDefault);
    this.setUint32(bitSet.fromObject(displaySet1Mask, operatorParametersExtended2.displaySet21 as unknown as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(displaySet2Mask, operatorParametersExtended2.displaySet22 as unknown as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(displaySet3Mask, operatorParametersExtended2.displaySet23 as unknown as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(displaySet24Mask, operatorParametersExtended2.displaySet24 as unknown as bitSet.TBooleanObject));
    this.setUint8(operatorParametersExtended2.channel1);
    this.setUint8(operatorParametersExtended2.channel2);
    this.setUint8(operatorParametersExtended2.channel3);
    this.setUint8(operatorParametersExtended2.channel4);
    this.setUint8(operatorParametersExtended2.channel5);
    this.setUint8(operatorParametersExtended2.channel6);
    this.setUint8(timeCorrectPeriod);
};

CommandBinaryBuffer.prototype.getOperatorParametersExtended4 = function (): IOperatorParametersExtended4 {
    return {
        displaySet5: (bitSet.toObject(displaySet5Mask, this.getUint32()) as unknown) as IDisplaySet5OperatorParameter,
        displaySet25: (bitSet.toObject(displaySet5Mask, this.getUint32()) as unknown) as IDisplaySet5OperatorParameter,
        displaySet31: (bitSet.toObject(displaySet1Mask, this.getUint32()) as unknown) as IDisplaySet1OperatorParameter,
        displaySet32: (bitSet.toObject(displaySet1Mask, this.getUint32()) as unknown) as IDisplaySet1OperatorParameter,
        displaySet33: (bitSet.toObject(displaySet1Mask, this.getUint32()) as unknown) as IDisplaySet1OperatorParameter,
        displaySet34: (bitSet.toObject(displaySet1Mask, this.getUint32()) as unknown) as IDisplaySet1OperatorParameter,
        displaySet35: (bitSet.toObject(displaySet5Mask, this.getUint32()) as unknown) as IDisplaySet5OperatorParameter
    };
};

CommandBinaryBuffer.prototype.setOperatorParametersExtended4 = function ( operatorParametersExtended: IOperatorParametersExtended4 ) {
    this.setUint32(bitSet.fromObject(displaySet5Mask, operatorParametersExtended.displaySet5 as unknown as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(displaySet5Mask, operatorParametersExtended.displaySet25 as unknown as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(displaySet1Mask, operatorParametersExtended.displaySet31 as unknown as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(displaySet1Mask, operatorParametersExtended.displaySet32 as unknown as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(displaySet1Mask, operatorParametersExtended.displaySet33 as unknown as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(displaySet1Mask, operatorParametersExtended.displaySet34 as unknown as bitSet.TBooleanObject));
    this.setUint32(bitSet.fromObject(displaySet5Mask, operatorParametersExtended.displaySet35 as unknown as bitSet.TBooleanObject));
};

export const getPackedEnergiesWithDateSize = ( parameters: IPackedEnergiesWithType ): number => {
    const {wh, vari, vare} = parameters.energies;

    if ( parameters?.energyType ) {
        const energiesNumber = [...wh, ...vari, ...vare].filter(energy => energy !== null).length;

        return DATE_SIZE + PACKED_ENERGY_TYPE_SIZE + (energiesNumber * ENERGY_SIZE);
    }

    return DATE_SIZE + ENERGY_SIZE * TARIFF_NUMBER;
};


export default CommandBinaryBuffer;
