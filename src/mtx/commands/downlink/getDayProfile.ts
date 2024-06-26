/**
 * Downlink command to get day profile information for the given tariff table.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDayProfile from 'jooby-codec/mtx/commands/downlink/getDayProfile.js';
 *
 * const parameters = {
 *     tariffTable: 0,
 *     index: 5,
 *     isActive: true
 * };
 * const bytes = getDayProfile.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [59, 3, 0, 5, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDayProfile.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


interface IGetDayProfileParameters {
    /**
     * tariff table identifier
     *
     * `0` – table `A+`, `1` – table `A-` (for `MTX1`)</br>
     * `0` – table `A+`, `1` – table `P+`, `2` – table `A-` (for `MTX3`)
     */
    tariffTable: types.TUint8;

    /**
     * Day profile index in a list of all tariff days (max `32`).
     */
    index: types.TUint8;

    /**
     * Is it active or passive table (`false` - active, `true` - passive).
     */
    isActive: boolean;
}


export const id: types.TCommandId = 0x3b;
export const name: types.TCommandName = 'getDayProfile';
export const headerSize = 2;
export const maxSize = 3;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request for active tariff table A+': {
        id,
        name,
        maxSize,
        headerSize,
        accessLevel,
        parameters: {
            tariffTable: 0,
            index: 3,
            isActive: true
        },
        bytes: [
            0x3b, 0x03,
            0x00, 0x03, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( [tariffTable, index, isActive]: types.TBytes ): IGetDayProfileParameters => (
    {tariffTable, index, isActive: isActive === 0}
);


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayProfileParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setUint8(parameters.tariffTable);
    buffer.setUint8(parameters.index);
    buffer.setUint8(parameters.isActive ? 0 : 1);

    return command.toBytes(id, buffer.data);
};
