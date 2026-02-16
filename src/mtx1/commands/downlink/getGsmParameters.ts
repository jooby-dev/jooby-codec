/**
 * Downlink command to get GSM module parameters.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getGsmParameters from 'jooby-codec/mtx1/commands/downlink/getGsmParameters.js';
 *
 * const parameters = {
 *     blockIndex: 1
 * };
 *
 * const bytes = getDayMaxDemand.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [97, 1, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetGsmParameters.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getGsmParameters as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetGsmParameters {
    blockIndex: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 1;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request for block 1': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            blockIndex: 1
        },
        bytes: [
            0x61, 0x01,
            0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetGsmParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const [blockIndex] = bytes;

    return {blockIndex};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetGsmParameters ) : types.TBytes => (
    command.toBytes(id, [parameters.blockIndex])
);
