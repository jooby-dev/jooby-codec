/**
 * Downlink command to get the meter displays sorting order.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDisplayParam from 'jooby-codec/mtx3/commands/downlink/getDisplayParam.js';
 *
 * const parameters = {
 *     displayMode: 1
 * };
 * const bytes = getDisplayParam.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [94, 1, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDisplayParam.md#request)
 */

import * as command from '../../../mtx/utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../../mtx/constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


interface IGetDisplayParamParameters {
    /**
     * Display mode.
     *
     * | Value | Screen type  | Screen range |
     * | ----- | ------------ | ------------ |
     * | `0`   | `main`       | `1..64`      |
     * | `1`   | `main`       | `65..128`    |
     * | `2`   | `additional` | `1..64`      |
     * | `3`   | `additional` | `65..128`    |
     */
    displayMode: types.TUint8;
}


export const id: types.TCommandId = 0x5e;
export const name: types.TCommandName = 'getDisplayParam';
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
            displayMode: 1
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
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( [displayMode]: types.TBytes ): IGetDisplayParamParameters => ({displayMode});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDisplayParamParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setUint8(parameters.displayMode);

    return command.toBytes(id, buffer.data);
};
