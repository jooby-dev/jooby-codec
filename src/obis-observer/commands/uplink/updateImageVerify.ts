/**
 * Uplink command to verify the update image on the device. This command is part of update procedure.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as updateImageVerify from 'jooby-codec/obis-observer/commands/uplink/updateImageVerify.js';
 *
 * // response to updateImageVerify downlink command
 * const bytes = [0x20, 0x01];
 *
 * // decoded payload
 * const parameters = updateImageVerify.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 32,
 *     isImageValid: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/UpdateImageVerify.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/binary/buffer.js';
import {updateImageVerify as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export interface IUpdateImageVerifyParameters extends ICommandParameters {
    isImageValid: boolean;
}

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE + 1;

export const examples: command.TCommandExamples = {
    'success result': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 32,
            isImageValid: true
        },
        bytes: [
            0x33, 0x02,
            0x20, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IUpdateImageVerifyParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const requestId = bytes[0];
    const isImageValid = bytes[1] === 1;

    return {requestId, isImageValid};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IUpdateImageVerifyParameters ): types.TBytes => command.toBytes(
    id,
    [parameters.requestId, parameters.isImageValid ? 1 : 0]
);
