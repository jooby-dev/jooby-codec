/**
 * Uplink command to get extended current values like temperature, frequency etc.
 *
 * The corresponding downlink command: `getExtendedCurrentValues`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getExtendedCurrentValues from 'jooby-codec/mtx3/commands/uplink/getExtendedCurrentValues.js';
 *
 * // simple response
 * const bytes = [
 *     0x00, 0x43, 0x00, 0x3c, 0x00, 0x00, 0x00, 0x1e, 0x00, 0x00, 0x00, 0x2d, 0x01, 0xf4, 0xfe, 0x0c,
 *     0x03, 0xe8, 0x03, 0xb6, 0x00, 0x00, 0x13, 0x88, 0x00, 0x00, 0x11, 0x94, 0x00, 0x00, 0x12, 0xc0,
 *     0x00, 0x00, 0x37, 0xdc, 0x01, 0x52
 * ];
 *
 * // decoded payload
 * const parameters = getExtendedCurrentValues.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     temperature: 67,
 *     frequency: 60,
 *     vPhaseAB: 30,
 *     vPhaseAC: 45,
 *     pfA: 0.5,
 *     pfB: -0.5,
 *     pfC: 1,
 *     pf: 0.95,
 *     vaA: 5000,
 *     vaB: 4500,
 *     vaC: 4800,
 *     vaSum: 14300,
 *     uBatteryRtc: 338
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetExtendedCurrentValues.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as command from '../../../mtx1/utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import * as dlms from '../../constants/dlms.js';
import {getExtendedCurrentValues as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export interface IGetExtendedCurrentValuesResponseParameters {
    /**
     * Device temperature (`0.11.0`).
     */
    temperature: types.TInt16;

    /**
     * The frequency of voltage in the power grid (`14.7.0`).
     */
    frequency: types.TUint16;

    /**
     * Phase angle between voltages of phases `A` and `B`.
     */
    vPhaseAB: types.TInt32;

    /**
     * Phase angle between voltages of phases `B` and `C`.
     */
    vPhaseAC: types.TInt32;

    /**
     * Power factor (`cos φ`) of phase `A` (`33.7.0`).
     */
    pfA: types.TInt16;

    /**
     * Power factor (`cos φ`) of phase `B` (`53.7.0`).
     */
    pfB: types.TInt16;

    /**
     * Power factor (`cos φ`) of phase `C` (`73.7.0`).
     */
    pfC: types.TInt16;

    /**
     * Overall power factor (`cos φ`) (`13.7.0`).
     */
    pf: types.TInt16;

    /**
     * Apparent power of phase `A` (`29.7.0`).
     */
    vaA: types.TInt32;

    /**
     * Apparent power of phase `B` (`49.7.0`).
     */
    vaB: types.TInt32;

    /**
     * Apparent power of phase `C` (`69.7.0`).
     */
    vaC: types.TInt32;

    /**
     * Total apparent power (`9.7.0`).
     */
    vaSum: types.TInt32;

    /**
     * Battery voltage for the real-time clock (RTC) in the device (`96.6.3`).
     */
    uBatteryRtc: types.TInt16;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 38;
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
            temperature: 67,
            frequency: 60,
            vPhaseAB: 30,
            vPhaseAC: 45,
            pfA: 0.5,
            pfB: -0.5,
            pfC: 1,
            pf: 0.95,
            vaA: 5000,
            vaB: 4500,
            vaC: 4800,
            vaSum: 14300,
            uBatteryRtc: 338
        },
        bytes: [
            0x3a, 0x26,
            0x00, 0x43,
            0x00, 0x3c,
            0x00, 0x00, 0x00, 0x1e,
            0x00, 0x00, 0x00, 0x2d,
            0x01, 0xf4,
            0xfe, 0x0c,
            0x03, 0xe8,
            0x03, 0xb6,
            0x00, 0x00, 0x13, 0x88,
            0x00, 0x00, 0x11, 0x94,
            0x00, 0x00, 0x12, 0xc0,
            0x00, 0x00, 0x37, 0xdc,
            0x01, 0x52
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetExtendedCurrentValuesResponseParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        temperature: buffer.getInt16(),
        frequency: buffer.getUint16(),
        vPhaseAB: buffer.getInt32(),
        vPhaseAC: buffer.getInt32(),
        pfA: buffer.getInt16() / 1000,
        pfB: buffer.getInt16() / 1000,
        pfC: buffer.getInt16() / 1000,
        pf: buffer.getInt16() / 1000,
        vaA: buffer.getInt32(),
        vaB: buffer.getInt32(),
        vaC: buffer.getInt32(),
        vaSum: buffer.getInt32(),
        uBatteryRtc: buffer.getInt16()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetExtendedCurrentValuesResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    buffer.setInt16(parameters.temperature);
    buffer.setUint16(parameters.frequency);
    buffer.setInt32(parameters.vPhaseAB);
    buffer.setInt32(parameters.vPhaseAC);
    buffer.setInt16(parameters.pfA * 1000);
    buffer.setInt16(parameters.pfB * 1000);
    buffer.setInt16(parameters.pfC * 1000);
    buffer.setInt16(parameters.pf * 1000);
    buffer.setInt32(parameters.vaA);
    buffer.setInt32(parameters.vaB);
    buffer.setInt32(parameters.vaC);
    buffer.setInt32(parameters.vaSum);
    buffer.setInt16(parameters.uBatteryRtc);

    return command.toBytes(id, buffer.data);
};


export const toJson = ( parameters: IGetExtendedCurrentValuesResponseParameters, options: dlms.IJsonOptions = dlms.defaultJsonOptions ) => {
    if ( !options.dlms ) {
        return JSON.stringify(parameters);
    }

    const result: Record<string, number> = {
        '0.11.0': parameters.temperature,
        '14.7.0': parameters.frequency,
        '33.7.0': parameters.pfA,
        '53.7.0': parameters.pfB,
        '73.7.0': parameters.pfC,
        '13.7.0': parameters.pf,
        '29.7.0': parameters.vaA,
        '49.7.0': parameters.vaB,
        '69.7.0': parameters.vaC,
        '9.7.0': parameters.vaSum,
        '96.6.3': parameters.uBatteryRtc,
        // TODO: Add OBIS codes for vPhaseAB and vPhaseAC once the MTX3 documentation is updated.
        vPhaseAB: parameters.vPhaseAB,
        vPhaseAC: parameters.vPhaseAC
    };

    return JSON.stringify(result);
};
