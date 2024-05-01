/**
 * Downlink command to set special day information for the given tariff table.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setSpecialDay from 'jooby-codec/mtx/commands/downlink/setSpecialDay.js';
 *
 * const parameters = {
 *     tariffTable: 1,
 *     index: 5,
 *     month: 1,
 *     date: 9,
 *     dayIndex: 3,
 *     isPeriodic: true
 * };
 * const bytes = setSpecialDay.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [0x12, 0x06, 0x01, 0x05, 0x01, 0x09, 0x03, 0x00]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetSpecialDay.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ISpecialDay} from '../../utils/CommandBinaryBuffer.js';


interface ISetSpecialDayParameters extends ISpecialDay {
    /**
     * tariff table identifier
     * (`0` - table `A+`, `1` – table `A-`)
     */
    tariffTable: types.TUint8;

    /**
     * Special day index in a list of all tariff special days (max `26`).
     */
    index: types.TUint8;
}


export const id: types.TCommandId = 0x12;
export const name: types.TCommandName = 'setSpecialDay';
export const headerSize = 2;
export const maxSize = 6;
export const accessLevel: types.TAccessLevel = READ_WRITE;

export const examples: command.TCommandExamples = {
    'set special day': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            tariffTable: 1,
            index: 5,
            month: 1,
            date: 9,
            dayIndex: 3,
            isPeriodic: true
        },
        bytes: [
            0x12, 0x06,
            0x01, 0x05, 0x01, 0x09, 0x03, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ISetSpecialDayParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        tariffTable: buffer.getUint8(),
        index: buffer.getUint8(),
        ...buffer.getSpecialDay()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetSpecialDayParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setUint8(parameters.tariffTable);
    buffer.setUint8(parameters.index);
    buffer.setSpecialDay(parameters);

    return command.toBytes(id, buffer.data);
};
