/**
 * Command to manually depassivate device battery.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as depassivateBattery from 'jooby-codec/analog/commands/downlink/depassivateBattery.js';
 *
 * // request current values
 * const parameters = {
 *     duration: 30000
 * };
 *
 * const bytes = depassivateBattery.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [31, 6, 2, 117, 48]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/DepassivateBattery.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {depassivateBattery as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IDepassivateBatteryParameters {
    /** depassivation duration in milliseconds */
    duration: types.TUint16;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

// only data (without length byte)
const COMMAND_BODY_SIZE: number = 2;

export const examples = {
    'request for current values': {
        id,
        headerSize,
        parameters: {
            duration: 30000
        },
        bytes: [
            0x1f, 0x06, 0x02,
            0x75, 0x30
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IDepassivateBatteryParameters => {
    validateCommandPayload(name, bytes, COMMAND_BODY_SIZE);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        duration: buffer.getUint16()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDepassivateBatteryParameters ): types.TBytes => {
    const {duration} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint16(duration);

    return command.toBytes(id, buffer.data);
};
