/**
 * Uplink command is used for error indication by the OBIS observer.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as errorResponse from 'jooby-codec/obis-observer/commands/uplink/errorResponse.js';
 *
 * // error code - format error
 * const bytes = [0x20, 0x03];
 *
 * // decoded payload
 * const parameters = errorResponse.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 32,
 *     resultCode: 3
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ErrorResponse.md#response)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {resultCodes} from '../../constants/index.js';
import {errorResponse as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IErrorResponseParameters command parameters
 */
interface IErrorResponseParameters extends ICommandParameters {
    resultCode: types.TInt8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'error code - format error': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 32,
            resultCode: resultCodes.FORMAT_ERROR
        },
        bytes: [
            0xfe, 0x02,
            0x20, 0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( [requestId, resultCode]: types.TBytes ): IErrorResponseParameters => ({requestId, resultCode});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {requestId, resultCode}: IErrorResponseParameters ): types.TBytes => command.toBytes(id, [requestId, resultCode]);
