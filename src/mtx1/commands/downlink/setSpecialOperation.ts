/**
 * Downlink command to set special parameters (resetting screens of magnetic and electromagnetic influence).
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setSpecialOperation from 'jooby-codec/mtx1/commands/downlink/setSpecialOperation.js';
 * import * as specialOperationTypes from 'jooby-codec/mtx1/constants/specialOperationTypes.js';
 *
 * const parameters = {
 *     type: specialOperationTypes.RESET_INFLUENCE_SCREENS,
 *     readScreensInfo: false,
 *     resetElectroMagneticIndication: true,
 *     resetMagneticIndication: true
 * };
 *
 * const bytes = setSpecialOperation.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [100, 2, 85, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/SetSpecialOperation.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import * as specialOperationTypes from '../../constants/specialOperationTypes.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {setSpecialOperation as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface ISetSpecialOperationParameters {
    /** Operation type */
    type: types.TUint8;

    /** Reading information about the presence of electromagnetic influence screens */
    readScreensInfo: boolean,

    /** Resetting the electromagnetic influence screen */
    resetElectroMagneticIndication: boolean,

    /** Resetting the magnetic influence screen */
    resetMagneticIndication: boolean
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 2;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'read screens info': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            type: specialOperationTypes.RESET_INFLUENCE_SCREENS,
            readScreensInfo: true,
            resetElectroMagneticIndication: false,
            resetMagneticIndication: false
        },
        bytes: [
            0x64, 0x02,
            0x55, 0x80
        ]
    },
    'reset both screens': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            type: specialOperationTypes.RESET_INFLUENCE_SCREENS,
            readScreensInfo: false,
            resetElectroMagneticIndication: true,
            resetMagneticIndication: true
        },
        bytes: [
            0x64, 0x02,
            0x55, 0x03
        ]
    },
    'reset magnetic screen': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            type: specialOperationTypes.RESET_INFLUENCE_SCREENS,
            readScreensInfo: false,
            resetElectroMagneticIndication: false,
            resetMagneticIndication: true
        },
        bytes: [
            0x64, 0x02,
            0x55, 0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetSpecialOperationParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    const type = buffer.getUint8();
    const flags = buffer.getUint8();

    const readScreensInfo = !!(flags & 0x80);
    const resetElectroMagneticIndication = !!(flags & 1);
    const resetMagneticIndication = !!(flags & 2);

    return {
        type,
        readScreensInfo,
        resetElectroMagneticIndication,
        resetMagneticIndication
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetSpecialOperationParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);
    let flags = 0;

    if ( parameters.readScreensInfo ) {
        flags |= 0x80;
    }
    if ( parameters.resetElectroMagneticIndication ) {
        flags |= 1;
    }
    if ( parameters.resetMagneticIndication ) {
        flags |= 2;
    }

    buffer.setUint8(parameters.type);
    buffer.setUint8(flags);

    return command.toBytes(id, buffer.data);
};
