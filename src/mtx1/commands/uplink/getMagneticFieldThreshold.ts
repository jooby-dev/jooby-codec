/**
 * Uplink command to get the magnetic induction sensor parameters and the magnetic induction value.
 *
 * The corresponding downlink command: `getMagneticFieldThreshold`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMagneticFieldThreshold from 'jooby-codec/mtx1/commands/uplink/getMagneticFieldThreshold.js';
 *
 * // simple response
 * const bytes = [0x00, 0x0a, 0x00, 0x05, 0x00, 0x7b, 0xff, 0xff, 0xff, 0xff];
 *
 * // decoded payload
 * const parameters = getMagneticFieldThreshold.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     induction: 10,
 *     threshold: 5,
 *     inductionCoefficient: 1.23,
 *     reserved: 0xffffffff
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetMagneticFieldThreshold.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getMagneticFieldThreshold as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetMagneticFieldThresholdParameters {
    /**
     * Magnetic induction value, mT.
     */
    induction: types.TUint16,

    /**
     * Minimum magnetic induction value for registering magnetic impact (1-127).
     */
    threshold: types.TUint16,

    /**
     * Magnetic induction coefficient, accurate to hundredths.
     */
    inductionCoefficient: types.TUint16,

    /**
     * Reserved bytes.
     */
    reserved: types.TUint32
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 10;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            induction: 10,
            threshold: 5,
            inductionCoefficient: 1.23,
            reserved: 0xffffffff
        },
        bytes: [
            0x6d, 0x0a,
            0x00, 0x0a, 0x00, 0x05, 0x00, 0x7b, 0xff, 0xff, 0xff, 0xff
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMagneticFieldThresholdParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        induction: buffer.getUint16(),
        threshold: buffer.getUint16(),
        inductionCoefficient: buffer.getUint16() / 100,
        reserved: buffer.getUint32()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMagneticFieldThresholdParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    buffer.setUint16(parameters.induction);
    buffer.setUint16(parameters.threshold);
    buffer.setUint16(parameters.inductionCoefficient * 100);
    buffer.setUint32(parameters.reserved);

    return command.toBytes(id, buffer.data);
};
