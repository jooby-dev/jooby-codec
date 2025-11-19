/**
 * Uplink command to indicate data frame error.
 *
 * There is no corresponding downlink commands.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as errorDataFrame from 'jooby-codec/mtx1/commands/uplink/errorDataFrame.js';
 *
 * const bytes = [0xff, 0x01, 0x97];
 *
 * // decoded payload
 * const parameters = errorDataFrame.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *      error: 151,
 *      errorName: 'BLOCKED_METER',
 * }
 * ```
 */

import * as types from '../../types.js';
import {errorDataFrameResponse as commandId} from '../../constants/uplinkIds.js';
import * as command from '../../utils/command.js';
import commandNames from '../../constants/uplinkNames.js';
import resultNames from '../../constants/resultNames.js';
import {UNENCRYPTED} from '../../constants/accessLevels.js';


interface IErrorDataFrameParameters {
    error: types.TUint8,

    errorName?: string,
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 1;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            error: 130,
            errorName: 'DECRYPTION_FAILURE'
        },
        bytes: [
            0xff, 0x01,
            0x82
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IErrorDataFrameParameters => {
    if ( bytes.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const [error] = bytes;

    return {
        error,
        errorName: resultNames[error]
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IErrorDataFrameParameters ): types.TBytes => {
    const {error} = parameters;

    return command.toBytes(id, [error]);
};
