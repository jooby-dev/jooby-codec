/**
 * Downlink command to set season profile information for the given tariff table.
 *
 * @example
 * ```js
 * import * as setSeasonProfile from 'jooby-codec/mtx/commands/downlink/setSeasonProfile.js';
 *
 * const parameters = {
 *     tariffTable: 1,
 *     index: 8,
 *     month: 1,
 *     date: 1,
 *     dayIndexes: [0, 0, 0, 0, 0, 0, 0]
 * };
 * const bytes = setSeasonProfile.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [17, 11, 1, 8, 1, 1, 0, 0, 0, 0, 0, 0, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetSeasonProfile.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ISeasonProfile, SEASON_PROFILE_SIZE} from '../../utils/CommandBinaryBuffer.js';


interface ISetSeasonProfileParameters extends ISeasonProfile {
    /**
     * tariff table identifier
     * (`0` - table `A+`, `1` – table `A-`)
     */
    tariffTable: types.TUint8;
    /**
     * Season profile index in a list of all tariff seasons (max `14`).
     */
    index: types.TUint8;
}


export const id: types.TCommandId = 0x11;
export const name: types.TCommandName = 'setSeasonProfile';
export const headerSize = 2;
export const maxSize = SEASON_PROFILE_SIZE;
export const accessLevel: types.TAccessLevel = READ_WRITE;

export const examples: command.TCommandExamples = {
    'set default season profile': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            tariffTable: 1,
            index: 8,
            month: 1,
            date: 1,
            dayIndexes: [0, 0, 0, 0, 0, 0, 0]
        },
        bytes: [
            0x11, 0x0b,
            0x01, 0x08, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]
    },
    'set some season profile': {
        id,
        name,
        maxSize,
        accessLevel,
        parameters: {
            tariffTable: 0,
            index: 2,
            month: 5,
            date: 9,
            dayIndexes: [0, 1, 2, 3, 4, 5, 6]
        },
        bytes: [
            0x11, 0x0b,
            0x00, 0x02, 0x05, 0x09, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ISetSeasonProfileParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        tariffTable: buffer.getUint8(),
        index: buffer.getUint8(),
        ...buffer.getSeasonProfile()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetSeasonProfileParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setUint8(parameters.tariffTable);
    buffer.setUint8(parameters.index);
    buffer.setSeasonProfile(parameters);

    return command.toBytes(id, buffer.data);
};
