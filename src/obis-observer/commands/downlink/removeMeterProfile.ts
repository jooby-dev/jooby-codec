/**
 * Request to remove the specific meter profile.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as removeMeterProfile from 'jooby-codec/obis-observer/commands/downlink/removeMeterProfile.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 17
 * };
 * const bytes = removeMeterProfile.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [98, 3, 17]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveMeterProfile.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ICommandParameters} from '../../utils/CommandBinaryBuffer.js';


interface IRemoveMeterProfileParameters extends ICommandParameters {
    meterProfileId: types.TUint8
}


export const id: types.TCommandId = 0x62;
export const name: types.TCommandName = 'removeMeterProfile';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'remove meter profile 17': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            meterProfileId: 17
        },
        bytes: [
            0x62, 0x02,
            0x03, 0x11
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IRemoveMeterProfileParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const meterProfileId = buffer.getUint8();

    return {requestId, meterProfileId};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IRemoveMeterProfileParameters ): types.TBytes => (
    command.toBytes(id, [parameters.requestId, parameters.meterProfileId])
);
