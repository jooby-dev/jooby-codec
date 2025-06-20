/**
 * Downlink command to set serial port parameters.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setSerialPort from 'jooby-codec/obis-observer/commands/downlink/setSerialPort.js';
 * import * as parityTypes from 'jooby-codec/obis-observer/constants/parityTypes.js';
 *
 * const parameters = {
 *     requestId: 52,
 *     baudRate: 5,
 *     dataBits: 8,
 *     parity: parityTypes.ODD
 * };
 *
 * const bytes = setSerialPort.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [9, 4, 52, 5, 8, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetSerialPort.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer, ICommandParameters, ISerialPortParameters, REQUEST_ID_SIZE
} from '../../utils/CommandBinaryBuffer.js';
import {setSerialPort as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE + 3;

export const examples: command.TCommandExamples = {
    'set fixed settings: 9600, 8, odd': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 52,
            baudRate: 5,
            dataBits: 8,
            parity: 1
        },
        bytes: [
            0x09, 0x04,
            0x34, 0x05, 0x08, 0x01
        ]
    },
    'set settings: 115200, 7, none': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 52,
            baudRate: 12,
            dataBits: 7,
            parity: 0
        },
        bytes: [
            0x09, 0x04,
            0x34, 0x0c, 0x07, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISerialPortParameters & ICommandParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();

    return {
        requestId,
        ...buffer.getSerialPortParameters()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISerialPortParameters & ICommandParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

    buffer.setUint8(parameters.requestId);
    buffer.setSerialPortParameters(parameters);

    return command.toBytes(id, buffer.data);
};
