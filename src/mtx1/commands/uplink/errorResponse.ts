/**
 * Uplink command that correspond to the failed downlink command.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as errorResponse from 'jooby-codec/mtx1/commands/uplink/errorResponse.js';
 *
 * // default parameters
 * const bytes = [0x18, 0x93];
 *
 * // decoded payload
 * const parameters = errorResponse.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     commandId: 0x18,
 *     commandName: 'turnRelayOn',
 *     errorCode: 0x93,
 *     errorName: 'ACCESS_DENIED'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/ErrorResponse.md)
 */

import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import * as resultCodes from '../../constants/resultCodes.js';
import resultNames from '../../constants/resultNames.js';
import {errorResponse as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export interface IErrorResponseParameters {
    /**
     * Downlink command id.
     *
     * @example
     * 7 (GetDateTime)
     */
    commandId: types.TUint8,

    commandName?: string,

    /**
     * Error code from the list of {@link resultCodes | available codes}.
     */
    errorCode: types.TUint8,

    errorName?: string
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 2;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'ACCESS_DENIED on TurnRelayOn command': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            commandId: 0x18,
            commandName: 'turnRelayOn',
            errorCode: resultCodes.ACCESS_DENIED,
            errorName: 'ACCESS_DENIED'
        },
        bytes: [
            0xfe, 0x02,
            0x18, 0x93
        ]
    }
};


export const getFromBytes = ( commandNamesParameter: Record<number, string> ) => (
    (bytes: types.TBytes): IErrorResponseParameters => {
        const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
        const errorCommandId = buffer.getUint8();
        const errorCode = buffer.getUint8();

        return {
            commandId: errorCommandId,
            commandName: commandNamesParameter[errorCommandId],
            errorCode,
            errorName: resultNames[errorCode]
        };
    }
);

/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = getFromBytes(commandNames);

/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IErrorResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setUint8(parameters.commandId);
    buffer.setUint8(parameters.errorCode);

    return command.toBytes(id, buffer.data);
};
