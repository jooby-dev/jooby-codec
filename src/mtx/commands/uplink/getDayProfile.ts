/**
 * Downlink command to get day profile for the given tariff table.
 *
 * The corresponding downlink command: `getDayProfile`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDayProfile from 'jooby-codec/mtx/commands/uplink/getDayProfile.js';
 *
 * // response with 4 periods
 * const bytes = [0x3b, 0x05, 0x10, 0x1d, 0x22, 0x2f, 0xff];
 *
 * // decoded payload
 * const parameters = getDayProfile.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     periods: [
 *         {tariff: 0, isFirstHalfHour: true, hour: 2},
 *         {tariff: 1, isFirstHalfHour: false, hour: 3},
 *         {tariff: 2, isFirstHalfHour: true, hour: 4},
 *         {tariff: 3, isFirstHalfHour: false, hour: 5}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDayProfile.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IDayProfile} from '../../utils/CommandBinaryBuffer.js';


interface IGetDayProfileResponseParameters {
    periods: Array<IDayProfile>
}


const MAX_PERIODS_NUMBER = 8;
const PERIODS_FINAL_BYTE = 0xff;

export const id: types.TCommandId = 0x3b;
export const name: types.TCommandName = 'getDayProfile';
export const headerSize = 2;
export const maxSize = MAX_PERIODS_NUMBER;
export const accessLevel: types.TAccessLevel = READ_ONLY;

export const examples: command.TCommandExamples = {
    'full periods response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
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
        bytes: [0x3b, 0x08, 0x10, 0x1d, 0x22, 0x2f, 0x30, 0x3d, 0x46, 0x4b]
    },
    'response with 4 periods': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            periods: [
                {tariff: 0, isFirstHalfHour: true, hour: 2},
                {tariff: 1, isFirstHalfHour: false, hour: 3},
                {tariff: 2, isFirstHalfHour: true, hour: 4},
                {tariff: 3, isFirstHalfHour: false, hour: 5}
            ]
        },
        bytes: [0x3b, 0x05, 0x10, 0x1d, 0x22, 0x2f, 0xff]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDayProfileResponseParameters => {
    const finalByteIndex = bytes.indexOf(PERIODS_FINAL_BYTE);
    // ignore final byte if present
    const cleanData = finalByteIndex === -1 ? bytes : bytes.slice(0, finalByteIndex);

    return {
        periods: [...cleanData].map(CommandBinaryBuffer.getDayProfileFromByte)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayProfileResponseParameters ): types.TBytes => {
    const hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER;
    const size = parameters.periods.length + +hasPeriodsFinalByte;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);

    // periods
    parameters.periods.forEach(period => {
        buffer.setDayProfile(period);
    });
    // add final byte if not full period set
    if ( hasPeriodsFinalByte ) {
        buffer.setUint8(PERIODS_FINAL_BYTE);
    }

    return command.toBytes(id, buffer.data);
};
