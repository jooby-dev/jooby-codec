/**
 * Downlink command to read load graphs.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDemand from 'jooby-codec/mtx3/commands/downlink/getDemand.js';
 *
 * const parameters = {
 *     date: {
 *         year: 21,
 *         month: 6,
 *         date: 18
 *     },
 *     demandParam: 0x81,
 *     firstIndex: 0,
 *     count: 2,
 *     period: 30
 * };
 *
 * const bytes = getDemand.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [118, 7, 42, 210, 129, 0, 0, 2, 30]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetDemand.md#request)
 */

import * as command from '../../../mtx1/utils/command.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IGetDemandParameters} from '../../utils/CommandBinaryBuffer.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import {getDemand as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 7;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request for A+': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 21,
                month: 6,
                date: 18
            },
            demandParam: 0x81,
            firstIndex: 0,
            count: 2,
            period: 30
        },
        bytes: [
            0x76, 0x07,
            0x2a, 0xd2,
            0x81,
            0x00, 0x00,
            0x02,
            0x1e
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDemandParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getDemand();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDemandParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setDemand(parameters);

    return command.toBytes(id, buffer.data);
};
