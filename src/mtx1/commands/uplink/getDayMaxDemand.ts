/**
 * Uplink command to get the maximum daily power `P+` for all tariffs (`T1`-`T4`).
 *
 * The corresponding downlink command: `getDayMaxDemand`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDayMaxDemand from 'jooby-codec/mtx1/commands/uplink/getDayMaxDemand.js';
 *
 * // response to getDayMaxDemand downlink command
 * const bytes = [
 *     0x17, 0x03, 0x0c,
 *     0x01, 0x00, 0x00, 0x00, 0x01, 0xc8,
 *     0x03, 0x0c, 0x00, 0x00, 0x25, 0x02,
 *     0x07, 0x1e, 0x00, 0x01, 0x32, 0xed,
 *     0x0c, 0x3b, 0x00, 0x06, 0x09, 0x77
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
 *     power: [
 *         {
 *             hours: 1,
 *             minutes: 0,
 *             power: 456
 *         },
 *         {
 *             hours: 3,
 *             minutes: 12,
 *             power: 9474
 *         },
 *         {
 *             hours: 7,
 *             minutes: 30,
 *             power: 78573
 *         },
 *         {
 *             hours: 12,
 *             minutes: 59,
 *             power: 395639
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetDayMaxDemand.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {
    IGetDayMaxDemandResponseParameters,
    getDayMaxDemandResponse,
    setDayMaxDemandResponse
} from '../../utils/CommandBinaryBuffer.js';
import {getDayMaxDemand as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 27;
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
            power: [
                {
                    hours: 1,
                    minutes: 0,
                    power: 456
                },
                {
                    hours: 3,
                    minutes: 12,
                    power: 9474
                },
                {
                    hours: 7,
                    minutes: 30,
                    power: 78573
                },
                {
                    hours: 12,
                    minutes: 59,
                    power: 395639
                }
            ]
        },
        bytes: [
            0x31, 0x1b,
            0x17, 0x03, 0x0c,
            0x01, 0x00, 0x00, 0x00, 0x01, 0xc8,
            0x03, 0x0c, 0x00, 0x00, 0x25, 0x02,
            0x07, 0x1e, 0x00, 0x01, 0x32, 0xed,
            0x0c, 0x3b, 0x00, 0x06, 0x09, 0x77
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
    validateCommandPayload(name, bytes, maxSize);

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
