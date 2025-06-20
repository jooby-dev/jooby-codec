/**
 * Uplink command to get the parameters for voltage graphs and SAIDI.
 *
 * The corresponding downlink command: `getDemandParameters`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDemandParameters from 'jooby-codec/mtx1/commands/uplink/getDemandParameters.js';
 *
 * // response to getDemandParameters downlink command
 * const bytes = [0x00, 0x14, 0xa0, 0x00];
 *
 * // decoded payload
 * const parameters = getDemandParameters.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     channelParam1: 0,
 *     counterInterval: 20,
 *     channelParam2: 160
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetDemandParameters.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IGetDemandParametersResponseParameters} from '../../utils/CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getDemandParameters as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 4;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            channelParam1: 0,
            counterInterval: 20,
            channelParam2: 160
        },
        bytes: [
            0x75, 0x04,
            0x00, 0x14, 0xa0, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDemandParametersResponseParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getDemandParameters();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDemandParametersResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setDemandParameters(parameters);

    return command.toBytes(id, buffer.data);
};
