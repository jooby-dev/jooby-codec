/**
 * Downlink command to get halfhours energies by 4 tariffs (`T1`-`T4`).
 *
 * **This command can be transmitted only via Lora.**
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getHalfHourEnergies from 'jooby-codec/mtx1/commands/downlink/getHalfHourEnergies.js';
 *
 * const parameters = {
 *     date: {
 *         year: 21,
 *         month: 2,
 *         date: 3,
 *     },
 *     firstHalfhour: 5,
 *     halfhoursNumber: 4,
 *     energies: {
 *         'A+': true,
 *         'A+R+': true,
 *     }
 *};
 *
 * const bytes = getHalfHourEnergies.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [111, 5, 42, 67, 3, 5, 4]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetHalfHourEnergies.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, TEnergiesFlags} from '../../utils/LoraCommandBinaryBuffer.js';
import {UNENCRYPTED} from '../../constants/accessLevels.js';
import {getHalfHourEnergies as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetHalfHourEnergiesParameters {
    /**
      * Date.
      */
    date: types.IDate;

    /**
      * Energies flags.
      */
    energies: TEnergiesFlags;

    /**
      * First halfhour.
      */
    firstHalfhour: number;

    /**
      * Number of halfhours.
      */
    halfhoursNumber: number;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 5;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = true;

export const examples: command.TCommandExamples = {
    'request for halfhours energies': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            energies: {
                'A+': true,
                'A+R+': true,
                'A+R-': false,
                'A-': false,
                'A-R+': false,
                'A-R-': false
            },
            firstHalfhour: 5,
            halfhoursNumber: 3
        },
        bytes: [
            0x6f, 0x05,
            0x2a, 0x43, 0x03, 0x05, 0x03
        ]
    }
};


/**
  * Decode command parameters.
  *
  * @param bytes - command body bytes
  * @returns decoded parameters
  */
export const fromBytes = ( bytes: types.TBytes ): IGetHalfHourEnergiesParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        date: buffer.getDate(),
        energies: buffer.getEnergiesFlags(),
        firstHalfhour: buffer.getUint8(),
        halfhoursNumber: buffer.getUint8()
    };
};


/**
  * Encode command parameters.
  *
  * @param parameters - command payload
  * @returns full message (header with body)
  */
export const toBytes = ( parameters: IGetHalfHourEnergiesParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setDate(parameters.date);
    buffer.setEnergiesFlags(parameters.energies);
    buffer.setUint8(parameters.firstHalfhour);
    buffer.setUint8(parameters.halfhoursNumber);

    return command.toBytes(id, buffer.data);
};
