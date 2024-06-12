/**
 * Downlink command to set special parameters (resetting screens of magnetic and electromagnetic influence).
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setSpecialOperation from 'jooby-codec/mtx/commands/downlink/setSpecialOperation.js';
 * import * as specialOperationTypes from 'jooby-codec/mtx/constants/specialOperationTypes.js';
 *
 * const parameters = {
 *     type: specialOperationTypes.RESET_INFLUENCE_SCREENS,
 *     readScreensInfo: false,
 *     resetElectroMagneticIndication: true,
 *     resetMagneticIndication: true
 * };
 * const bytes = setSpecialOperation.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [100, 2, 85, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetSpecialOperation.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import * as specialOperationTypes from '../../constants/specialOperationTypes.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


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


export const id: types.TCommandId = 0x64;
export const name: types.TCommandName = 'setSpecialOperation';
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
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ISetSpecialOperationParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

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
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);
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
