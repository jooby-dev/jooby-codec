/**
 * Downlink command to set special day information for the given tariff table.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setSpecialDay from 'jooby-codec/mtx1/commands/downlink/setSpecialDay.js';
 *
 * const parameters = {
 *     tariffTable: 1,
 *     index: 5,
 *     month: 1,
 *     date: 9,
 *     dayIndex: 3,
 *     isPeriodic: true
 * };
 *
 * const bytes = setSpecialDay.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [18, 6, 1, 5, 1, 9, 3, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/SetSpecialDay.md#request)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {
    ISpecialDay,
    getSpecialDay,
    setSpecialDay
} from '../../utils/binary/buffer.js';
import {setSpecialDay as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface ISetSpecialDayParameters extends ISpecialDay {
    /**
     * tariff table identifier
     *
     * `0` – table `A+`, `1` – table `A-` (for `MTX1`)</br>
     * `0` – table `A+`, `1` – table `P+`, `2` – table `A-` (for `MTX3`)
     */
    tariffTable: types.TUint8;

    /**
     * Special day index in a list of all tariff special days (max `26`).
     */
    index: types.TUint8;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 6;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

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
            year: 0
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
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetSpecialDayParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        tariffTable: buffer.getUint8(),
        index: buffer.getUint8(),
        ...getSpecialDay(buffer)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetSpecialDayParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    buffer.setUint8(parameters.tariffTable);
    buffer.setUint8(parameters.index);
    setSpecialDay(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
