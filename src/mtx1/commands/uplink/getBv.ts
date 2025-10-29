/**
 * Uplink command to get vector data from device.
 *
 * The corresponding downlink command: `getBv`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getBv from 'jooby-codec/mtx1/commands/uplink/getBv.js';
 *
 * const bytes = [0x10, 0x09, 0x15, 0x00, 0x00, 0x09];
 *
 * // decoded payload
 * const parameters = getBv.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     vector: [16, 9, 21, 0, 0, 9]
 * }
 * ```
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getBv as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetBvResponseParameters {
    vector: types.TBytes
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 6;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    test: {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            vector: [16, 9, 21, 0, 0, 9]
        },
        bytes: [
            0x70, 0x06,
            0x10, 0x09, 0x15, 0x00, 0x00, 0x09
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetBvResponseParameters => {
    if ( bytes.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    return {
        vector: bytes
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetBvResponseParameters ): types.TBytes => {
    const {vector} = parameters;

    return command.toBytes(id, vector);
};
