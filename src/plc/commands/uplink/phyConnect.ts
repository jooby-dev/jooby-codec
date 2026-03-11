/**
 * Uplink command to connect to the PLC network.
 *
 * The corresponding downlink command: `phyConnectRequest`.
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
 * [6, 10, 0, 1, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1]
 * ```
 */

import * as types from '../../types.js';
import * as command from '../../../mtx1/utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {phyConnect as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IPhyConnectParameters {
    longAddress: types.TBytes,
    shortAddress: types.TUint16
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 10;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'phyConnect response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            longAddress: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07],
            shortAddress: 0x0001
        },
        bytes: [
            0x06, 0x0a,
            0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
            0x00, 0x01
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

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        longAddress: buffer.getBytes(8),
        shortAddress: buffer.getUint16()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IPhyConnectParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    buffer.setBytes(parameters.longAddress);
    buffer.setUint16(parameters.shortAddress);

    return command.toBytes(id, buffer.data);
};
