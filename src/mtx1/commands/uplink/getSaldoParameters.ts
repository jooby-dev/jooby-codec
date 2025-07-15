/**
 * Uplink command to get device current saldo parameters information.
 *
 * The corresponding downlink command: `getSaldoParameters`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getSaldoParameters from 'jooby-codec/mtx1/commands/uplink/getSaldoParameters.js';
 *
 * // response to getSaldoParameters downlink command
 * const bytes = [
 *     0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x05, 0x06, 0x00, 0x00,
 *     0x00, 0x07, 0x00, 0x00, 0x00, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x00, 0x00, 0x00, 0x0d, 0x00, 0x00, 0x00, 0x0e,
 * ];
 *
 * // decoded payload
 * const parameters = getSaldoParameters.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
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
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetSaldoParameters.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {
    ISaldoParameters,
    getSaldoParameters,
    setSaldoParameters
} from '../../utils/CommandBinaryBuffer.js';
import {getSaldoParameters as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 37;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'default response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            coefficients: [0, 0, 0, 0],
            decimalPointTariff: 0,
            indicationThreshold: 0,
            relayThreshold: 0,
            mode: 0,
            saldoOffTimeBegin: 0,
            saldoOffTimeEnd: 0,
            decimalPointIndication: 0,
            powerThreshold: 0,
            creditThreshold: 0
        },
        bytes: [
            0x2e, 0x25,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]
    },
    'test response': {
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
            0x2e, 0x25,
            0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x05,
            0x06, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x00, 0x00, 0x00,
            0x0d, 0x00, 0x00, 0x00, 0x0e
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISaldoParameters => {
    if ( bytes.length !== maxSize ) {
        throw new Error('Invalid getSaldoParameters data size.');
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getSaldoParameters(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISaldoParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    setSaldoParameters(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
