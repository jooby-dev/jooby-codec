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
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import {getDisplayParam as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import {displayModes} from '../../constants/index.js';


type TDisplayMode = typeof displayModes.MAIN | typeof displayModes.ADDITIONAL;

interface IGetDisplayParamParameters {
    /**
     * {@link displayModes | available modes}.
     */
    displayMode: TDisplayMode;
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
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( [displayMode]: types.TBytes ): IGetDisplayParamParameters => ({
    displayMode: displayMode as TDisplayMode
});


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
