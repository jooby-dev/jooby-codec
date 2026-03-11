/**
 * Downlink command to connect to the PLC network.
 *
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as phyConnect from 'jooby-codec/plc/commands/downlink/phyConnect.js';
 *
 * const parameters = {
 *     longAddress: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]
 * };
 *
 * const bytes = phyConnect.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [4, 8, 0, 1, 0, 1, 2, 3, 4, 5, 6, 7]
 * ```
 */

import * as types from '../../types.js';
import * as command from '../../../mtx1/utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {phyConnect as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IPhyConnectParameters {
    longAddress: types.TBytes
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 8;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'phyConnect request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            longAddress: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]
        },
        bytes: [
            0x04, 0x08,
            0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IPhyConnectParameters => {
    validateCommandPayload(name, bytes, maxSize);

    return {
        longAddress: bytes.slice(0, 8)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IPhyConnectParameters ): types.TBytes => (
    command.toBytes(id, parameters.longAddress)
);
