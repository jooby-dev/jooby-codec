/**
 * Uplink command to get the meter displays sorting order.
 *
 * The corresponding downlink command: `getDisplayParam`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDisplayParam from 'jooby-codec/mtx3/commands/uplink/getDisplayParam.js';
 *
 * // mode with order
 * const bytes = [0x00, 0x04, 0x05, 0x06, 0x07];
 *
 * // decoded payload
 * const parameters = getDisplayParam.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     displayMode: displayModes.MAIN_1,
 *     order: [4, 5, 6, 7]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetDisplayParam.md#response)
 */

import * as command from '../../../mtx1/utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import {getDisplayParam as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';
import {displayModes} from '../../constants/index.js';


interface IGetDisplayParamResponseParameters {
    /**
     * {@link displayModes | available modes}.
     */
    displayMode: types.TUint8,

    /**
     * List of display numbers.
     *
     * ({@link screenIds | display identifiers})
     */
    order: Array<types.TUint8>
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 65;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'mode with order': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            displayMode: displayModes.MAIN_1,
            order: [4, 5, 6, 7]
        },
        bytes: [
            0x5e, 0x05,
            0x00, 0x04, 0x05, 0x06, 0x07
        ]
    },
    'mode without order': {
        id,
        name,
        maxSize,
        accessLevel,
        parameters: {
            displayMode: displayModes.MAIN_2,
            order: []
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
export const fromBytes = ( bytes: types.TBytes ): IGetDisplayParamResponseParameters => {
    const [displayMode, ...order] = bytes;

    return {displayMode, order};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDisplayParamResponseParameters ): types.TBytes => (
    command.toBytes(id, [parameters.displayMode, ...parameters.order])
);
