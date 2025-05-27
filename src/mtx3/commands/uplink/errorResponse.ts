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
 * const bytes = [0x54, 0x91];
 *
 * // decoded payload
 * const parameters = errorResponse.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     commandId: 0x54,
 *     commandName: getHalfHourDemandVariExport,
 *     errorCode: 0x91,
 *     errorName: 'NO_DATA_FOR_DATE'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/ErrorResponse.md)
 */

import * as command from '../../../mtx1/utils/command.js';
import * as mtx1 from '../../../mtx1/commands/uplink/errorResponse.js';
import * as resultCodes from '../../../mtx1/constants/resultCodes.js';
import commandNames from '../../constants/uplinkNames.js';


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
    'NO_DATA_FOR_DATE on getHalfHourDemandVariExport command': {
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
export const fromBytes = mtx1.getFromBytes(commandNames);
