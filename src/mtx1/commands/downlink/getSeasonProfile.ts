/**
 * Downlink command to get season profile information for the given tariff table.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getSeasonProfile from 'jooby-codec/mtx1/commands/downlink/getSeasonProfile.js';
 *
 * const parameters = {
 *     tariffTable: 0,
 *     index: 5,
 *     isActive: false
 * };
 *
 * const bytes = getSeasonProfile.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [60, 3, 0, 5, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetSeasonProfile.md#request)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getSeasonProfile as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetSeasonProfileParameters {
    /**
     * tariff table identifier
     *
     * `0` – table `A+`, `1` – table `A-` (for `MTX1`)</br>
     * `0` – table `A+`, `1` – table `P+`, `2` – table `A-` (for `MTX3`)
     */
    tariffTable: types.TUint8;

    /**
     * Season profile index in a list of all tariff seasons (max `14`).
     */
    index: types.TUint8;

    /**
     * Is it active or passive table (`false` - active, `true` - passive).
     */
    isActive: boolean;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 3;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

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
            0x3c, 0x03,
            0x00, 0x05, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetSeasonProfileParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const [tariffTable, index, isActive] = bytes;

    return {
        tariffTable,
        index,
        isActive: isActive === 0
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetSeasonProfileParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    buffer.setUint8(parameters.tariffTable);
    buffer.setUint8(parameters.index);
    buffer.setUint8(parameters.isActive ? 0 : 1);

    return command.toBytes(id, buffer.data);
};
