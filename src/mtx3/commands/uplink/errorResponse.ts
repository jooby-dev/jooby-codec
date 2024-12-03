/**
 * Uplink command that correspond to the failed downlink command.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as errorResponse from 'jooby-codec/mtx3/commands/uplink/errorResponse.js';
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
 *     errorCode: 0x93
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/ErrorResponse.md)
 */

import * as types from '../../../mtx1/types.js';
import * as command from '../../../mtx1/utils/command.js';
import * as mtx1 from '../../../mtx1/commands/uplink/errorResponse.js';
import * as resultCodes from '../../../mtx1/constants/resultCodes.js';
import resultNames from '../../../mtx1/constants/resultNames.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import {nameMap} from '../../message/downlink.js';


export const {
    id,
    name,
    headerSize,
    accessLevel,
    maxSize,
    isLoraOnly,
    toBytes
} = mtx1;


export const examples: command.TCommandExamples = {
    'ACCESS_DENIED on setDisplayParam command': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            commandId: 0x54,
            commandName: 'getHalfHourDemandVariExport',
            errorCode: resultCodes.NO_DATA_FOR_DATE,
            errorName: 'NO_DATA_FOR_DATE'
        },
        bytes: [
            0xfe, 0x02,
            0x54, 0x91
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): mtx1.IErrorResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const commandId = buffer.getUint8();
    const commandName = nameMap[commandId];
    const errorCode = buffer.getUint8();
    const errorName = resultNames[errorCode] as string;

    return {
        commandId,
        commandName,
        errorCode,
        errorName
    };
};
