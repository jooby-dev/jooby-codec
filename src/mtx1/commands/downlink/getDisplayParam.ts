/**
 * Downlink command to get the meter displays sorting order.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDisplayParam from 'jooby-codec/mtx1/commands/downlink/getDisplayParam.js';
 * import {displayModes} from 'jooby-codec/mtx1/constants/index.js';
 *
 * const parameters = {
 *     displayMode: displayModes.ADDITIONAL
 * };
 *
 * const bytes = getDisplayParam.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [94, 1, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetDisplayParam.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getDisplayParam as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import {displayModes} from '../../constants/index.js';


interface IGetDisplayParamParameters {
    /**
     * {@link displayModes | available modes}.
     */
    displayMode: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 1;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'get additional display parameters': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            displayMode: displayModes.ADDITIONAL
        },
        bytes: [
            0x5e, 0x01,
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
export const fromBytes = ( [displayMode]: types.TBytes ): IGetDisplayParamParameters => ({displayMode});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDisplayParamParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    buffer.setUint8(parameters.displayMode);

    return command.toBytes(id, buffer.data);
};
