/**
 * Uplink command to get the maximum power of active energy (A+) for the previous day.
 *
 * The corresponding downlink command: `getDayMaxDemandPrevious`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDayMaxDemandPrevious from 'jooby-codec/mtx1/commands/uplink/getDayMaxDemandPrevious.js';
 *
 * // response to getDayMaxDemandPrevious downlink command
 * const bytes = [
 *     0x17, 0x03, 0x0c,
 *     0x01, 0x00, 0x00, 0x00, 0x01, 0xc8,
 *     0x03, 0x0c, 0x00, 0x00, 0x25, 0x02,
 *     0x07, 0x1e, 0x00, 0x01, 0x32, 0xed,
 *     0x0c, 0x3b, 0x00, 0x06, 0x09, 0x77
 * ];
 *
 * // decoded payload
 * const parameters = getDayMaxDemandPrevious.fromBytes(bytes);
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetDayMaxDemandPrevious.md#response)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IGetDayMaxDemandResponseParameters} from '../../utils/CommandBinaryBuffer.js';
import {getDayMaxDemandPrevious as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


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
            0x4a, 0x1b,
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
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDayMaxDemandResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getDayMaxDemandResponse();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayMaxDemandResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setDayMaxDemandResponse(parameters);

    return command.toBytes(id, buffer.getBytesToOffset());
};
