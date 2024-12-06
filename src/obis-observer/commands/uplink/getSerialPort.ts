/**
 * Uplink command to get the information about serial port settings.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getSerialPort from 'jooby-codec/obis-observer/commands/uplink/getSerialPort.js';
 *
 * // response to getSerialPort
 * const bytes = [0x07, 0x05, 0x08, 0x01];
 *
 * // decoded payload
 * const parameters = getSerialPort.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 7,
 *     baudRate: 5,
 *     dataBits: 8,
 *     parity: parityTypes.ODD
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetSerialPort.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer, ICommandParameters, ISerialPortParameters, REQUEST_ID_SIZE
} from '../../utils/CommandBinaryBuffer.js';
import {getSerialPort as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE + 3;

export const examples: command.TCommandExamples = {
    'response to GetSerialPort': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 7,
            baudRate: 5,
            dataBits: 8,
            parity: 1
        },
        bytes: [
            0x08, 0x04,
            0x07, 0x05, 0x08, 0x01
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
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        requestId: buffer.getUint8(),
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

    return command.toBytes(id, buffer.toUint8Array());
};
