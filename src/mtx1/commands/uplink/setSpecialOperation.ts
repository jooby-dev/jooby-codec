/**
 * Uplink command to set special parameters (resetting screens of magnetic and electromagnetic influence).
 *
 * The corresponding downlink command: `setSpecialOperation`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setSpecialOperation from 'jooby-codec/mtx1/commands/uplink/setSpecialOperation.js';
 *
 * // empty response
 * const bytes = [0x03];
 *
 * // decoded payload
 * const parameters = setSpecialOperation.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {electroMagneticIndication: true, magneticIndication: true}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/setSpecialOperation.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {setSpecialOperation as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface ISetSpecialOperationResponseParameters {
    /** if screen is present */
    electroMagneticIndication: boolean,

    /** if screen is present */
    magneticIndication: boolean
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 1;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'electro-magnetic screen is present': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            electroMagneticIndication: true,
            magneticIndication: false
        },
        bytes: [
            0x64, 0x01,
            0x01
        ]
    },
    'magnetic screen is present': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            electroMagneticIndication: false,
            magneticIndication: true
        },
        bytes: [
            0x64, 0x01,
            0x02
        ]
    },
    'both screens are present': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            electroMagneticIndication: true,
            magneticIndication: true
        },
        bytes: [
            0x64, 0x01,
            0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetSpecialOperationResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    const flags = buffer.getUint8();

    const electroMagneticIndication = !!(flags & 1);
    const magneticIndication = !!(flags & 2);

    return {
        electroMagneticIndication,
        magneticIndication
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetSpecialOperationResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);
    let flags = 0;

    if ( parameters.electroMagneticIndication ) {
        flags |= 1;
    }
    if ( parameters.magneticIndication ) {
        flags |= 2;
    }

    buffer.setUint8(flags);

    return command.toBytes(id, buffer.data);
};
