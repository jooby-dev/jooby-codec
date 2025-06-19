/**
 * Downlink command to set the parameters for voltage graphs and SAIDI.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setDemandParameters from 'jooby-codec/mtx1/commands/downlink/setDemandParameters.js';
 *
 * const parameters = {
 *     channelParam1: 0,
 *     counterInterval: 20,
 *     channelParam2: 160
 * };
 *
 * const bytes = setDemandParameters.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [116, 4, 0, 20, 160, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/SetDemandParameters.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IGetDemandParametersResponseParameters} from '../../utils/CommandBinaryBuffer.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {setDemandParameters as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import validatePayload from '../../../utils/validatePayload.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 4;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple request': {
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
            0x74, 0x04,
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
    validatePayload(name, bytes, maxSize);

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
