/**
 * Downlink command to set depassivation configuration for the device.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setDepassivationConfig from 'jooby-codec/analog-ultrasound/commands/downlink/setDepassivationConfig.js';
 *
 * const parameters = {
 *     resistanceStartThreshold: 24000,
 *     resistanceStopThreshold: 20000
 * };
 * const bytes = setDepassivationConfig.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [7, 34, 25, 192, 93, 32, 78]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog-ultrasound/commands/SetDepassivationConfig.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {setDepassivationConfig as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';
import {IDepassivationConfigParameters} from '../uplink/getDepassivationConfig.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

const COMMAND_BODY_SIZE: number = 4;

export const examples: command.TCommandExamples = {
    'simple request #1': {
        id,
        name,
        headerSize,
        parameters: {
            resistanceStartThreshold: 24000,
            resistanceStopThreshold: 20000
        },
        bytes: [
            0x07, 0x22, 0x19,
            0xc0, 0x5d, 0x20, 0x4e
        ]
    },
    'simple request #2': {
        id,
        name,
        headerSize,
        parameters: {
            resistanceStartThreshold: 35000,
            resistanceStopThreshold: 25000
        },
        bytes: [
            0x07, 0x22, 0x19,
            0xb8, 0x88, 0xa8, 0x61
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IDepassivationConfigParameters => {
    validateCommandPayload(name, bytes, COMMAND_BODY_SIZE);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes);

    return {
        resistanceStartThreshold: buffer.getUint16(),
        resistanceStopThreshold: buffer.getUint16()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDepassivationConfigParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE);

    buffer.setUint16(parameters.resistanceStartThreshold);
    buffer.setUint16(parameters.resistanceStopThreshold);

    return command.toBytes(id, buffer.data);
};
