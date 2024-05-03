/**
 * Downlink command to set device current saldo parameters information.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setSaldoParameters from 'jooby-codec/mtx/commands/downlink/setSaldoParameters.js';
 *
 * const parameters = {
 *     coefficients: [2, 3, 4, 5],
 *     decimalPointTariff: 6,
 *     indicationThreshold: 7,
 *     relayThreshold: 8,
 *     mode: 9,
 *     saldoOffTimeBegin: 10,
 *     saldoOffTimeEnd: 11,
 *     decimalPointIndication: 12,
 *     powerThreshold: 13,
 *     creditThreshold: 14
 * };
 * const bytes = setSaldoParameters.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [47, 37, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 5, 6, 0, 0, 0, 7, 0, 0, 0, 8, 9, 10, 11, 12, 0, 0, 0, 13, 0, 0, 0, 14]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetSaldoParameters.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ISaldoParameters} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x2f;
export const name: types.TCommandName = 'setSaldoParameters';
export const headerSize = 2;
export const maxSize = 37;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'test parameters': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            coefficients: [2, 3, 4, 5],
            decimalPointTariff: 6,
            indicationThreshold: 7,
            relayThreshold: 8,
            mode: 9,
            saldoOffTimeBegin: 10,
            saldoOffTimeEnd: 11,
            decimalPointIndication: 12,
            powerThreshold: 13,
            creditThreshold: 14
        },
        bytes: [
            0x2f, 0x25,
            0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04,
            0x00, 0x00, 0x00, 0x05, 0x06, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00,
            0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x00, 0x00, 0x00, 0x0d, 0x00, 0x00, 0x00,
            0x0e
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ISaldoParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getSaldoParameters();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISaldoParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setSaldoParameters(parameters);

    return command.toBytes(id, buffer.data);
};
