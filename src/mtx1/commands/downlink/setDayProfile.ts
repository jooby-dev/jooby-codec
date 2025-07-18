/**
 * Downlink command to set day profile for tariff plan.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setDayProfile from 'jooby-codec/mtx1/commands/downlink/setDayProfile.js';
 *
 * const parameters = {
 *     tariffTable: 0,
 *     index: 5,
 *     periods: [
 *         {tariff: 0, isFirstHalfHour: true, hour: 2},
 *         {tariff: 1, isFirstHalfHour: false, hour: 3},
 *         {tariff: 2, isFirstHalfHour: true, hour: 4},
 *         {tariff: 3, isFirstHalfHour: false, hour: 5}
 *     ]
 * };
 *
 * const bytes = setDayProfile.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [16, 7, 0, 5, 16, 29, 34, 47, 255]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/SetDayProfile.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {
    IDayProfile,
    getDayProfileFromByte,
    setDayProfile
} from '../../utils/CommandBinaryBuffer.js';
import {setDayProfile as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface ISetDayProfileParameters {
    /**
     * tariff table identifier
     *
     * `0` – table `A+`, `1` – table `A-` (for `MTX1`)</br>
     * `0` – table `A+`, `1` – table `P+`, `2` – table `A-` (for `MTX3`)
     */
    tariffTable: types.TUint8;

    /**
     * Day profile index in a list of all tariff days (max `32`).
     */
    index: types.TUint8;

    periods: Array<IDayProfile>;
}


const MAX_PERIODS_NUMBER = 8;
const PERIODS_FINAL_BYTE = 0xff;

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 2 + MAX_PERIODS_NUMBER;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'set day profile with 1 period': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            tariffTable: 0,
            index: 3,
            periods: [
                {tariff: 0, isFirstHalfHour: true, hour: 2}
            ]
        },
        bytes: [
            0x10, 0x04,
            0x00, 0x03, 0x10, 0xff
        ]
    },
    'set day profile with 4 periods': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            tariffTable: 0,
            index: 5,
            periods: [
                {tariff: 0, isFirstHalfHour: true, hour: 2},
                {tariff: 1, isFirstHalfHour: false, hour: 3},
                {tariff: 2, isFirstHalfHour: true, hour: 4},
                {tariff: 3, isFirstHalfHour: false, hour: 5}
            ]
        },
        bytes: [
            0x10, 0x07,
            0x00, 0x05, 0x10, 0x1d, 0x22, 0x2f, 0xff
        ]
    },
    'set day profile with max periods': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            tariffTable: 0,
            index: 3,
            periods: [
                {tariff: 0, isFirstHalfHour: true, hour: 2},
                {tariff: 1, isFirstHalfHour: false, hour: 3},
                {tariff: 2, isFirstHalfHour: true, hour: 4},
                {tariff: 3, isFirstHalfHour: false, hour: 5},
                {tariff: 0, isFirstHalfHour: true, hour: 6},
                {tariff: 1, isFirstHalfHour: false, hour: 7},
                {tariff: 2, isFirstHalfHour: false, hour: 8},
                {tariff: 3, isFirstHalfHour: true, hour: 9}
            ]
        },
        bytes: [
            0x10, 0x0a,
            0x00, 0x03, 0x10, 0x1d, 0x22, 0x2f, 0x30, 0x3d, 0x46, 0x4b
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetDayProfileParameters => {
    const finalByteIndex = bytes.indexOf(PERIODS_FINAL_BYTE);
    // ignore final byte if present
    const cleanBytes = finalByteIndex === -1 ? bytes : bytes.slice(0, finalByteIndex);
    const buffer: IBinaryBuffer = new BinaryBuffer(cleanBytes, false);

    return {
        tariffTable: buffer.getUint8(),
        index: buffer.getUint8(),
        // eslint-disable-next-line @typescript-eslint/unbound-method
        periods: [...cleanBytes.slice(buffer.offset)].map(getDayProfileFromByte)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetDayProfileParameters ): types.TBytes => {
    const hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER;
    const size = 2 + parameters.periods.length + +hasPeriodsFinalByte;
    const buffer: IBinaryBuffer = new BinaryBuffer(size, false);

    buffer.setUint8(parameters.tariffTable);
    buffer.setUint8(parameters.index);

    // periods
    parameters.periods.forEach(period => {
        setDayProfile(buffer, period);
    });

    // add final byte if not full period set
    if ( hasPeriodsFinalByte ) {
        buffer.setUint8(PERIODS_FINAL_BYTE);
    }

    return command.toBytes(id, buffer.data);
};
