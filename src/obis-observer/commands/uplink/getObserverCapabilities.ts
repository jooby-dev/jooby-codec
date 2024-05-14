/**
 * Uplink command to get the information about observer, like name, software and hardware version.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getObserverCapabilities from 'jooby-codec/obis-observer/commands/uplink/getObserverCapabilities.js';
 *
 * // response to getObserverCapabilities
 * const bytes = [0x07, 0x08, 0x08, 0xff, 0x01];
 *
 * // decoded payload
 * const parameters = getObserverCapabilities.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 7,
 *     maxMeterProfilesNumber: 8,
 *     maxMetersNumber: 8,
 *     maxObisProfilesNumber: 255,
 *     isMultiModeSupported: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverCapabilities.md#response)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


/**
 * IGetObserverCapabilitiesResponseParameters command parameters
 */
interface IGetObserverCapabilitiesResponseParameters extends ICommandParameters {
    maxMeterProfilesNumber: types.TUint8,
    maxMetersNumber: types.TUint8,
    maxObisProfilesNumber: types.TUint8,
    isMultiModeSupported: boolean
}


export const id: types.TCommandId = 0x04;
export const name: types.TCommandName = 'getObserverCapabilities';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getObserverCapabilities': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 7,
            maxMeterProfilesNumber: 8,
            maxMetersNumber: 8,
            maxObisProfilesNumber: 255,
            isMultiModeSupported: true
        },
        bytes: [
            0x04, 0x05,
            0x07, 0x08, 0x08, 0xff, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetObserverCapabilitiesResponseParameters => {
    const [
        requestId,
        maxMeterProfilesNumber,
        maxMetersNumber,
        maxObisProfilesNumber,
        isMultiModeSupported
    ] = bytes;

    return {
        requestId,
        maxMeterProfilesNumber,
        maxMetersNumber,
        maxObisProfilesNumber,
        isMultiModeSupported: isMultiModeSupported !== 0
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetObserverCapabilitiesResponseParameters ): types.TBytes => {
    const {
        requestId,
        maxMeterProfilesNumber,
        maxMetersNumber,
        maxObisProfilesNumber,
        isMultiModeSupported
    } = parameters;

    return command.toBytes(
        id,
        [
            requestId,
            maxMeterProfilesNumber,
            maxMetersNumber,
            maxObisProfilesNumber,
            isMultiModeSupported ? 1 : 0
        ]
    );
};
