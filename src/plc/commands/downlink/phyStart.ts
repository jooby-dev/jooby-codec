/**
 * Downlink command to start of the PLC network.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as phyStart from 'jooby-codec/plc/commands/downlink/phyStart.js';
 *
 *  const parameters = {
 *     panId: 1,
 *     longAddress: [0, 1, 2, 3, 4, 5, 6, 7]
 * }
 *
 * const bytes = phyStart.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [2, 13, 0, 0, 1, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0]
 * ```
 */

import * as types from '../../types.js';
import * as command from '../../../mtx1/utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {phyStart as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IPhyStartParameters {
    panId: types.TUint8,
    longAddress: types.TBytes
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 13;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'phyStart request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            panId: 1,
            longAddress: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]
        },
        bytes: [
            0x02, 0x0d,
            0x00,
            0x00,
            0x01,
            0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
            0x00,
            0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IPhyStartParameters => {
    validateCommandPayload(name, bytes, maxSize);

    return {
        panId: bytes[2],
        longAddress: bytes.slice(3, 11)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IPhyStartParameters ): types.TBytes => (
    command.toBytes(
        id,
        [
            0, 0, // reserved
            parameters.panId,
            ...parameters.longAddress,
            0, 0 // reserved
        ]
    )
);
