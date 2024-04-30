/**
 * Downlink command to get special day information for the given tariff table.
 *
 * @example
 * ```js
 * import * as getSpecialDay from 'jooby-codec/mtx/commands/downlink/getSpecialDay.js';
 *
 * const parameters = {
 *     tariffTable: 0,
 *     index: 5,
 *     isActive: false
 * };
 * const bytes = getSpecialDay.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [61, 3, 0, 5, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetSpecialDay.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


interface IGetSpecialDayParameters {
    /**
     * tariff table identifier
     * (`0` - table `A+`, `1` – table `A-`)
     */
    tariffTable: types.TUint8;
    /**
     * Special day index in a list of all tariff special days (max `26`).
     */
    index: types.TUint8;
    /**
     * Is it active or passive table.
     */
    isActive: boolean;
}


export const id: types.TCommandId = 0x3d;
export const name: types.TCommandName = 'getSpecialDay';
export const headerSize = 2;
export const maxSize = 3;
export const accessLevel: types.TAccessLevel = READ_ONLY;

export const examples: command.TCommandExamples = {
    'request for passive tariff table A+': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            tariffTable: 0,
            index: 5,
            isActive: false
        },
        bytes: [
            0x3d, 0x03,
            0x00, 0x05, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( [tariffTable, index, isActive]: types.TBytes ): IGetSpecialDayParameters => (
    {tariffTable, index, isActive: isActive === 0}
);


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetSpecialDayParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setUint8(parameters.tariffTable);
    buffer.setUint8(parameters.index);
    buffer.setUint8(parameters.isActive ? 0 : 1);

    return command.toBytes(id, buffer.data);
};
