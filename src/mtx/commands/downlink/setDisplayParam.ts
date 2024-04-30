/**
 * Downlink command to set the meter displays sorting order.
 *
 * @example
 * ```js
 * import * as setDisplayParam from 'jooby-codec/mtx/commands/downlink/setDisplayParam.js';
 *
 * const parameters = {
 *     displayMode: 8,
 *     order: [4, 5, 6, 7]
 * };
 * const bytes = setDisplayParam.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [93, 5, 8, 4, 5, 6, 7]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetDisplayParam.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


interface ISetDisplayParamParameters {
    /**
     * Display mode.
     * (`0` - main, `1` - additional)
     */
    displayMode: types.TUint8,

    /**
     * List of display numbers.
     *
     * ({@link screenIds | display identifiers})
     */
    order: Array<types.TUint8>
}


export const id: types.TCommandId = 0x5d;
export const name: types.TCommandName = 'setDisplayParam';
export const headerSize = 2;
export const maxSize = 33;
export const accessLevel: types.TAccessLevel = READ_WRITE;

export const examples: command.TCommandExamples = {
    'set params with order': {
        id,
        name,
        maxSize,
        accessLevel,
        parameters: {
            displayMode: 8,
            order: [4, 5, 6, 7]
        },
        bytes: [
            0x5d, 0x05,
            0x08, 0x04, 0x05, 0x06, 0x07
        ]
    },
    'set params without order': {
        id,
        name,
        maxSize,
        accessLevel,
        parameters: {
            displayMode: 0,
            order: []
        },
        bytes: [
            0x5d, 0x01,
            0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
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
