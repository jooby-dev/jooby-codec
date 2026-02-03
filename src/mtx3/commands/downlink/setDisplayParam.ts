/**
 * Downlink command to set the meter displays sorting order.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setDisplayParam from 'jooby-codec/mtx3/commands/downlink/setDisplayParam.js';
 * import {displayModes} from 'jooby-codec/mtx3/constants/index.js';
 *
 * const parameters = {
 *     displayMode: displayModes.MAIN_1,
 *     order: [4, 5, 6, 7]
 * };
 *
 * const bytes = setDisplayParam.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [93, 5, 0, 4, 5, 6, 7]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/SetDisplayParam.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../../mtx1/utils/command.js';
import {READ_WRITE} from '../../../mtx1/constants/accessLevels.js';
import {setDisplayParam as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import {displayModes} from '../../constants/index.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as screenIds from '../../constants/screenIds.js';


interface ISetDisplayParamParameters {
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
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'set params with order': {
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
            0x5d, 0x05,
            0x00,
            0x04, 0x05, 0x06, 0x07
        ]
    },
    'set params without order': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            displayMode: displayModes.MAIN_2,
            order: []
        },
        bytes: [
            0x5d, 0x01,
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
export const fromBytes = ( bytes: types.TBytes ): ISetDisplayParamParameters => {
    if ( bytes.length < 1 || bytes.length > maxSize ) {
        throw new Error('Invalid SetDisplayParam data size.');
    }

    const [displayMode, ...order] = bytes;

    return {displayMode, order};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetDisplayParamParameters ): types.TBytes => (
    command.toBytes(id, [
        parameters.displayMode,
        ...parameters.order
    ])
);
