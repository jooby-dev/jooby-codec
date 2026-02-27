/**
 * Uplink command to get current values like voltage, power, etc.
 *
 * The corresponding downlink command: `setCurrentValues`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getCurrentValues from 'jooby-codec/mtx1/commands/uplink/getCurrentValues.js';
 *
 * // simple response
 * const bytes = [
 *     0x00, 0x23, 0xd8, 0xb2, 0x00, 0x3d, 0xfa, 0x53, 0x00, 0x04, 0x9e, 0x89, 0x00, 0x01, 0xa1, 0x25,
 *     0x01, 0xf4, 0x00, 0x04, 0xa6, 0x8b, 0x00, 0x01, 0x9f, 0x28, 0x00, 0x01, 0xa3, 0x1c, 0xfe, 0x0c
 * ];
 *
 * // decoded payload
 * const parameters = getCurrentValues.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     powerA: 2349234,
 *     iaRms: 4061779,
 *     vavbRms: 302729,
 *     varA: 106789,
 *     pfA: 0.5,
 *     ibRms: 304779,
 *     powerB: 106280,
 *     varB: 107292,
 *     pfB: -0.5
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetCurrentValues.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getCurrentValues as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetCurrentValuesResponseParameters {
    /** active power in A channel */
    powerA: types.TInt32,
    /** current in A channel */
    iaRms: types.TInt32,
    /** voltage in A and B channels */
    vavbRms: types.TInt32,
    /** reactive power in A channel */
    varA: types.TInt32,
    /** power factor (cos φ) in  A channel */
    pfA: types.TInt16,
    /** current in B channel */
    ibRms: types.TInt32,
    /** active power in B channel */
    powerB: types.TInt32,
    /** reactive power in B channel */
    varB: types.TInt32,
    /** power factor (cos φ) in B channel */
    pfB: types.TInt16
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 32;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        maxSize,
        headerSize,
        accessLevel,
        parameters: {
            powerA: 2349234,
            iaRms: 4061779,
            vavbRms: 302729,
            varA: 106789,
            pfA: 0.5,
            ibRms: 304779,
            powerB: 106280,
            varB: 107292,
            pfB: -0.5
        },
        bytes: [
            0x0d, 0x20,
            0x00, 0x23, 0xd8, 0xb2, 0x00, 0x3d, 0xfa, 0x53, 0x00, 0x04, 0x9e, 0x89, 0x00, 0x01, 0xa1, 0x25,
            0x01, 0xf4, 0x00, 0x04, 0xa6, 0x8b, 0x00, 0x01, 0x9f, 0x28, 0x00, 0x01, 0xa3, 0x1c, 0xfe, 0x0c
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
        powerA: buffer.getInt32(),
        iaRms: buffer.getInt32(),
        vavbRms: buffer.getInt32(),
        varA: buffer.getInt32(),
        pfA: buffer.getInt16() / 1000,
        ibRms: buffer.getInt32(),
        powerB: buffer.getInt32(),
        varB: buffer.getInt32(),
        pfB: buffer.getInt16() / 1000
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
    buffer.setInt32(parameters.powerA);
    buffer.setInt32(parameters.iaRms);
    buffer.setInt32(parameters.vavbRms);
    buffer.setInt32(parameters.varA);
    buffer.setInt16(parameters.pfA * 1000);
    buffer.setInt32(parameters.ibRms);
    buffer.setInt32(parameters.powerB);
    buffer.setInt32(parameters.varB);
    buffer.setInt16(parameters.pfB * 1000);

    return command.toBytes(id, buffer.data);
};


export const toJson = ( parameters: IGetCurrentValuesResponseParameters, {dlms}: command.IDlmsJsonOptions = command.defaultDlmsJsonOptions ) => {
    if ( !dlms ) {
        return JSON.stringify(parameters);
    }

    const result: Record<string, number> = {
        '21.7.0': parameters.powerA,
        '31.7.0': parameters.iaRms,
        '32.7.0': parameters.vavbRms,
        '33.7.0': parameters.pfA,
        '51.7.0': parameters.ibRms,
        '41.7.0': parameters.powerB,
        '53.7.0': parameters.pfB
    };

    const varAKey = parameters.varA >= 0 ? '23.7.0' : '24.7.0';
    const varBKey = parameters.varB >= 0 ? '43.7.0' : '44.7.0';

    result[varAKey] = parameters.varA;
    result[varBKey] = parameters.varB;

    return JSON.stringify(result);
};
