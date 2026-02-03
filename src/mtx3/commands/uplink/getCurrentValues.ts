/**
 * Uplink command to get current values like voltage, power, etc.
 *
 * The corresponding downlink command: `getCurrentValues`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getCurrentValues from 'jooby-codec/mtx3/commands/uplink/getCurrentValues.js';
 *
 * // simple response
 * const bytes = [
 *     0x00, 0x03, 0x82, 0x70, 0x00, 0x03, 0x86, 0x58, 0x00, 0x03, 0x7e, 0x88, 0x00, 0x00, 0x13, 0x88,
 *     0x00, 0x00, 0x13, 0x24, 0x00, 0x00, 0x13, 0xba, 0x00, 0x11, 0x8c, 0x30, 0x00, 0x11, 0x17, 0x00,
 *     0x00, 0x11, 0xb3, 0x40, 0x00, 0x03, 0x0d, 0x40, 0x00, 0x02, 0xf9, 0xb8, 0x00, 0x03, 0x20, 0xc8,
 *     0x00, 0x00, 0x05, 0xdc
 * ];
 *
 * // decoded payload
 * const parameters = getCurrentValues.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     vaRms: 230000,
 *     vbRms: 231000,
 *     vcRms: 229000,
 *     iaRms: 5000,
 *     ibRms: 4900,
 *     icRms: 5050,
 *     powerA: 1150000,
 *     powerB: 1120000,
 *     powerC: 1160000,
 *     varA: 200000,
 *     varB: 195000,
 *     varC: 205000,
 *     iNeutral: 1500
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetCurrentValues.md#response)
 */

import * as types from '../../types.js';
import * as command from '../../../mtx1/utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import * as dlms from '../../constants/dlms.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {getCurrentValues as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export interface IGetCurrentValuesResponseParameters {
    /**
     * Voltage in phase `A` (`32.7.0`).
     */
    vaRms: types.TInt32,

    /**
     * Voltage in phase `B` (`52.7.0`).
     */
    vbRms: types.TInt32,

    /**
     * Voltage in phase `C` (`72.7.0`).
     */
    vcRms: types.TInt32,

    /**
     * Current in phase `A` (`31.7.0`).
     */
    iaRms: types.TInt32,

    /**
     * Current in phase `B` (`51.7.0`).
     */
    ibRms: types.TInt32,

    /**
     * Current in phase `C` (`71.7.0`).
     */
    icRms: types.TInt32,

    /**
     * Active power in channel `A` (`1.21.7.0`).
     */
    powerA: types.TInt32,

    /**
     * Active power in channel `B` (`1.41.7.0`).
     */
    powerB: types.TInt32,

    /**
     * Active power in channel `C` (`1.61.7.0`).
     */
    powerC: types.TInt32,

    /**
     * Reactive power in channel `A` (`1.23.7.0` if `varA >= 0`; `1.24.7.0` if `varA < 0`).
     */
    varA: types.TInt32,

    /**
     * Reactive power in channel `B` (`1.43.7.0` if `varB >= 0`; `1.44.7.0` if `varB < 0`).
     */
    varB: types.TInt32,

    /**
     * Reactive power in channel `C` (`1.63.7.0` if `varC >= 0`; `1.64.7.0` if `varC < 0`).
     */
    varC: types.TInt32,

    /**
     * Current in neutral (`91.7.0`).
     */
    iNeutral: types.TInt32
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 52;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        maxSize,
        headerSize,
        accessLevel,
        parameters: {
            vaRms: 230000,
            vbRms: 231000,
            vcRms: 229000,
            iaRms: 5000,
            ibRms: 4900,
            icRms: 5050,
            powerA: 1150000,
            powerB: 1120000,
            powerC: 1160000,
            varA: 200000,
            varB: 195000,
            varC: 205000,
            iNeutral: 1500
        },
        bytes: [
            0x0d, 0x34,
            0x00, 0x03, 0x82, 0x70,
            0x00, 0x03, 0x86, 0x58,
            0x00, 0x03, 0x7e, 0x88,
            0x00, 0x00, 0x13, 0x88,
            0x00, 0x00, 0x13, 0x24,
            0x00, 0x00, 0x13, 0xba,
            0x00, 0x11, 0x8c, 0x30,
            0x00, 0x11, 0x17, 0x00,
            0x00, 0x11, 0xb3, 0x40,
            0x00, 0x03, 0x0d, 0x40,
            0x00, 0x02, 0xf9, 0xb8,
            0x00, 0x03, 0x20, 0xc8,
            0x00, 0x00, 0x05, 0xdc
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetCurrentValuesResponseParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        vaRms: buffer.getInt32(),
        vbRms: buffer.getInt32(),
        vcRms: buffer.getInt32(),
        iaRms: buffer.getInt32(),
        ibRms: buffer.getInt32(),
        icRms: buffer.getInt32(),
        powerA: buffer.getInt32(),
        powerB: buffer.getInt32(),
        powerC: buffer.getInt32(),
        varA: buffer.getInt32(),
        varB: buffer.getInt32(),
        varC: buffer.getInt32(),
        iNeutral: buffer.getInt32()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetCurrentValuesResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    buffer.setInt32(parameters.vaRms);
    buffer.setInt32(parameters.vbRms);
    buffer.setInt32(parameters.vcRms);
    buffer.setInt32(parameters.iaRms);
    buffer.setInt32(parameters.ibRms);
    buffer.setInt32(parameters.icRms);
    buffer.setInt32(parameters.powerA);
    buffer.setInt32(parameters.powerB);
    buffer.setInt32(parameters.powerC);
    buffer.setInt32(parameters.varA);
    buffer.setInt32(parameters.varB);
    buffer.setInt32(parameters.varC);
    buffer.setInt32(parameters.iNeutral);

    return command.toBytes(id, buffer.data);
};


export const toJson = ( parameters: IGetCurrentValuesResponseParameters, options: dlms.IJsonOptions = dlms.defaultJsonOptions ) => {
    if ( !options.dlms ) {
        return JSON.stringify(parameters);
    }

    const result: Record<string, number> = {
        '32.7.0': parameters.vaRms,
        '52.7.0': parameters.vbRms,
        '72.7.0': parameters.vcRms,
        '31.7.0': parameters.iaRms,
        '51.7.0': parameters.ibRms,
        '71.7.0': parameters.icRms,
        '1.21.7.0': parameters.powerA,
        '1.41.7.0': parameters.powerB,
        '1.61.7.0': parameters.powerC,
        '91.7.0': parameters.iNeutral
    };

    const varAKey = parameters.varA >= 0 ? '1.23.7.0' : '1.24.7.0';
    const varBKey = parameters.varB >= 0 ? '1.43.7.0' : '1.44.7.0';
    const varCKey = parameters.varC >= 0 ? '1.63.7.0' : '1.64.7.0';

    result[varAKey] = parameters.varA;
    result[varBKey] = parameters.varB;
    result[varCKey] = parameters.varC;

    return JSON.stringify(result);
};
