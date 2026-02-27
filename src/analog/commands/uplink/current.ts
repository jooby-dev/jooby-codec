/**
 * Information about the current pulse counter readings from the sensor.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as current from 'jooby-codec/analog/commands/uplink/current.js';
 *
 * // simple response channels
 * const bytes = [0x80, 0x00, 0x01, 0x56];
 *
 * // decoded payload
 * const parameters = current.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     isMagneticInfluence: true,
 *     value: 342
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetCurrent.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {
    ILegacyCounter,
    getLegacyCounter,
    setLegacyCounter
} from '../../utils/binary/buffer.js';
import {current as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_MAX_SIZE = 4;

export const examples: command.TCommandExamples = {
    'simple response channels': {
        id,
        name,
        headerSize,
        parameters: {isMagneticInfluence: true, value: 342},
        bytes: [
            0x07, 0x04,
            0x80, 0x00, 0x01, 0x56
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ILegacyCounter => {
    if ( bytes.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getLegacyCounter(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ILegacyCounter ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_MAX_SIZE, false);

    setLegacyCounter(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
