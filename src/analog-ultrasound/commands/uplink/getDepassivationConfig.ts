/**
 * Uplink command for receiving depassivation configuration from the device.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDepassivationConfig from 'jooby-codec/analog-ultrasound/commands/uplink/getDepassivationConfig.js';
 *
 * const bytes = [0xc0, 0x5d, 0x20, 0x4e];
 *
 * // decoded payload
 * const parameters = getDepassivationConfig.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     resistanceStartThreshold: 24000,
 *     resistanceStopThreshold: 20000
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog-ultrasound/commands/GetDepassivationConfig.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {getDepassivationConfig as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export interface IDepassivationConfigParameters {
    /**
     * Internal battery resistance threshold above which the depassivation process is initiated, in `mOhm`.
     * Available range: `1000..65535`. Default value is `35000` `mOhm`.
     */
    resistanceStartThreshold: types.TUint16;

    /**
     * Internal battery resistance threshold below which the depassivation process is terminated, in `mOhm`.
     * Available range: `1000..65535`. Default value is `25000` `mOhm`.
     */
    resistanceStopThreshold: types.TUint16;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

const COMMAND_BODY_SIZE: number = 4;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        parameters: {
            resistanceStartThreshold: 24000,
            resistanceStopThreshold: 20000
        },
        bytes: [
            0x07, 0x22, 0x18,
            0xc0, 0x5d, 0x20, 0x4e
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
