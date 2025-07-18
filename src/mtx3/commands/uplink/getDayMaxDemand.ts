/**
 * Uplink command to get the maximum daily power (`A+R+`, `R+`, `A+R-`) for all tariffs (`T1`-`T4`).
 *
 * The corresponding downlink command: `getDayMaxDemand`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDayMaxDemand from 'jooby-codec/mtx3/commands/uplink/getDayMaxDemand.js';
 *
 * // response to getDayMaxDemand downlink command
 * const bytes = [
 *     0x17, 0x03, 0x0c,
 *     0x00, 0x0a, 0x00, 0x00, 0x00, 0x64, 0x01, 0x17, 0x00, 0x00, 0x07, 0xd0, 0x08, 0x0f, 0x00, 0x00, 0x15, 0xb3,
 *     0x02, 0x14, 0x00, 0x00, 0x03, 0xe8, 0x03, 0x18, 0x00, 0x00, 0x4e, 0x20, 0x09, 0x10, 0x00, 0x00, 0xd9, 0x03,
 *     0x04, 0x1e, 0x00, 0x00, 0x27, 0x10, 0x05, 0x19, 0x00, 0x03, 0x0d, 0x40, 0x0a, 0x11, 0x00, 0x08, 0x7a, 0x23,
 *     0x06, 0x28, 0x00, 0x01, 0x86, 0xa0, 0x07, 0x1a, 0x00, 0x1e, 0x84, 0x80, 0x0b, 0x12, 0x00, 0x54, 0xc5, 0x63
 * ];
 *
 * // decoded payload
 * const parameters = getDayMaxDemand.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         year: 23,
 *         month: 3,
 *         date: 12
 *     },
 *     maxDemands: [
 *         {
 *             hourPmax: 0,
 *             minPmax: 10,
 *             pmax: 100,
 *             hourVariMax: 1,
 *             minVariMax: 23,
 *             variMax: 2000,
 *             hourVareMax: 8,
 *             minVareMax: 15,
 *             vareMax: 5555
 *         },
 *         {
 *             hourPmax: 2,
 *             minPmax: 20,
 *             pmax: 1000,
 *             hourVariMax: 3,
 *             minVariMax: 24,
 *             variMax: 20000,
 *             hourVareMax: 9,
 *             minVareMax: 16,
 *             vareMax: 55555
 *         },
 *         {
 *             hourPmax: 4,
 *             minPmax: 30,
 *             pmax: 10000,
 *             hourVariMax: 5,
 *             minVariMax: 25,
 *             variMax: 200000,
 *             hourVareMax: 10,
 *             minVareMax: 17,
 *             vareMax: 555555
 *         },
 *         {
 *             hourPmax: 6,
 *             minPmax: 40,
 *             pmax: 100000,
 *             hourVariMax: 7,
 *             minVariMax: 26,
 *             variMax: 2000000,
 *             hourVareMax: 11,
 *             minVareMax: 18,
 *             vareMax: 5555555
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/uplink/GetDayMaxDemand.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../../mtx1/utils/command.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import {
    IGetDayMaxDemandResponseParameters,
    getDayMaxDemandResponse,
    setDayMaxDemandResponse
} from '../../utils/CommandBinaryBuffer.js';
import {getDayMaxDemand as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 75;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'response for 2023.03.12': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            date: {
                year: 23,
                month: 3,
                date: 12
            },
            maxDemands: [
                {
                    hourPmax: 0,
                    minPmax: 10,
                    pmax: 100,
                    hourVariMax: 1,
                    minVariMax: 23,
                    variMax: 2000,
                    hourVareMax: 8,
                    minVareMax: 15,
                    vareMax: 5555
                },
                {
                    hourPmax: 2,
                    minPmax: 20,
                    pmax: 1000,
                    hourVariMax: 3,
                    minVariMax: 24,
                    variMax: 20000,
                    hourVareMax: 9,
                    minVareMax: 16,
                    vareMax: 55555
                },
                {
                    hourPmax: 4,
                    minPmax: 30,
                    pmax: 10000,
                    hourVariMax: 5,
                    minVariMax: 25,
                    variMax: 200000,
                    hourVareMax: 10,
                    minVareMax: 17,
                    vareMax: 555555
                },
                {
                    hourPmax: 6,
                    minPmax: 40,
                    pmax: 100000,
                    hourVariMax: 7,
                    minVariMax: 26,
                    variMax: 2000000,
                    hourVareMax: 11,
                    minVareMax: 18,
                    vareMax: 5555555
                }
            ]
        },
        bytes: [
            0x31, 0x4b,
            0x17, 0x03, 0x0c,
            0x00, 0x0a, 0x00, 0x00, 0x00, 0x64, 0x01, 0x17, 0x00, 0x00, 0x07, 0xd0, 0x08, 0x0f, 0x00, 0x00, 0x15, 0xb3,
            0x02, 0x14, 0x00, 0x00, 0x03, 0xe8, 0x03, 0x18, 0x00, 0x00, 0x4e, 0x20, 0x09, 0x10, 0x00, 0x00, 0xd9, 0x03,
            0x04, 0x1e, 0x00, 0x00, 0x27, 0x10, 0x05, 0x19, 0x00, 0x03, 0x0d, 0x40, 0x0a, 0x11, 0x00, 0x08, 0x7a, 0x23,
            0x06, 0x28, 0x00, 0x01, 0x86, 0xa0, 0x07, 0x1a, 0x00, 0x1e, 0x84, 0x80, 0x0b, 0x12, 0x00, 0x54, 0xc5, 0x63
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDayMaxDemandResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getDayMaxDemandResponse(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayMaxDemandResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    setDayMaxDemandResponse(buffer, parameters);

    return command.toBytes(id, buffer.getBytesToOffset());
};
