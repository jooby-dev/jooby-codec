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
    ICommandBinaryBuffer, ICommandParameters, REQUEST_ID_SIZE
} from '../../utils/CommandBinaryBuffer.js';


interface ISetSerialPortParameters extends ICommandParameters {
    baudRate: types.TUint8,
    dataBits: types.TUint8,
    parity: types.TUint8
}


export const id: types.TCommandId = 0x09;
export const name: types.TCommandName = 'setSerialPort';
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
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ISetSerialPortParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const baudRate = buffer.getUint8();
    const dataBits = buffer.getUint8();
    const parity = buffer.getUint8();

    return {
        requestId,
        baudRate,
        dataBits,
        parity
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetSerialPortParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
    const {requestId, baudRate, dataBits, parity} = parameters;

    buffer.setUint8(requestId);
    buffer.setUint8(baudRate);
    buffer.setUint8(dataBits);
    buffer.setUint8(parity);

    return command.toBytes(id, buffer.data);
};
