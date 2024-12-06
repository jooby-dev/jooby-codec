/**
 * Downlink command to set the Lorawan activation method OTAA or ABP.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setLorawanActivationMethod from 'jooby-codec/obis-observer/commands/downlink/setLorawanActivationMethod.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     activationMethod: 1
 * };
 * const bytes = setLorawanActivationMethod.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [36, 2, 3, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetLorawanActivationMethod.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import {setLorawanActivationMethod as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface ISetLorawanActivationMethodParameters extends ICommandParameters {
    activationMethod: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'set lorawan activation mode to ABP': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            activationMethod: 1
        },
        bytes: [
            0x24, 0x02,
            0x03, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ISetLorawanActivationMethodParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const activationMethod = buffer.getUint8();

    return {requestId, activationMethod};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetLorawanActivationMethodParameters ): types.TBytes => (
    command.toBytes(id, [parameters.requestId, parameters.activationMethod])
);
