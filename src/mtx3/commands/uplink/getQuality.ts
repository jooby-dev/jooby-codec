/**
 * Uplink command to get power-off information for a specific year and month.
 *
 * The corresponding downlink command: `getSaldoParameters`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getQuality from 'jooby-codec/mtx3/commands/uplink/getQuality.js';
 *
 * // response to getQuality downlink command
 * const bytes = [
 *     0x1a, 0x01, 0x00, 0x08, 0xa0, 0x44, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x22, 0x00, 0x00, 0x00, 0x00
 * ];
 *
 * // decoded payload
 * const parameters = getQuality.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     year: 26,
 *     month: 1,
 *     powerOffSaidiMinutes: 565316,
 *     powerOffSaidiCount: 3,
 *     powerOffMaidiMinutes: 0,
 *     powerOffMaifiCount: 3,
 *     badVoltagePhaseAMinutes: 34
 *     badVoltagePhaseAMinutes: 0
 *     badVoltagePhaseAMinutes: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/getQuality.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../../mtx1/utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import {getQuality as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetQualityResponseParameters {
    year: types.TYear2000,
    month: types.TMonth,
    powerOffSaidiMinutes: types.TUint32,
    powerOffSaidiCount: types.TUint16,
    powerOffMaidiMinutes: types.TUint32,
    powerOffMaifiCount: types.TUint16,
    badVoltagePhaseAMinutes: types.TUint16,
    badVoltagePhaseBMinutes: types.TUint16,
    badVoltagePhaseCMinutes: types.TUint16
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 20;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'response for 2026.01': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            year: 26,
            month: 1,
            powerOffSaidiMinutes: 565316,
            powerOffSaidiCount: 3,
            powerOffMaidiMinutes: 0,
            powerOffMaifiCount: 3,
            badVoltagePhaseAMinutes: 34,
            badVoltagePhaseBMinutes: 0,
            badVoltagePhaseCMinutes: 0
        },
        bytes: [
            0x73, 0x14,
            0x1a, 0x01,
            0x00, 0x08, 0xa0, 0x44,
            0x00, 0x03,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x03,
            0x00, 0x22,
            0x00, 0x00,
            0x00, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetQualityResponseParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        year: buffer.getUint8() as unknown as types.TYear2000,
        month: buffer.getUint8() as unknown as types.TMonth,
        powerOffSaidiMinutes: buffer.getUint32(),
        powerOffSaidiCount: buffer.getUint16(),
        powerOffMaidiMinutes: buffer.getUint32(),
        powerOffMaifiCount: buffer.getUint16(),
        badVoltagePhaseAMinutes: buffer.getUint16(),
        badVoltagePhaseBMinutes: buffer.getUint16(),
        badVoltagePhaseCMinutes: buffer.getUint16()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetQualityResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    buffer.setUint8(parameters.year as unknown as types.TUint8);
    buffer.setUint8(parameters.month as unknown as types.TUint8);
    buffer.setUint32(parameters.powerOffSaidiMinutes);
    buffer.setUint16(parameters.powerOffSaidiCount);
    buffer.setUint32(parameters.powerOffMaidiMinutes);
    buffer.setUint16(parameters.powerOffMaifiCount);
    buffer.setUint16(parameters.badVoltagePhaseAMinutes);
    buffer.setUint16(parameters.badVoltagePhaseBMinutes);
    buffer.setUint16(parameters.badVoltagePhaseCMinutes);

    return command.toBytes(id, buffer.data);
};
