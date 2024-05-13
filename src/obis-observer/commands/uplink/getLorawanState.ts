/**
 * Uplink command to get the Lorawan related state and statistic.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getLorawanState from 'jooby-codec/obis-observer/commands/uplink/getLorawanState.js';
 *
 * // response to getLorawanState
 * const bytes = [0x08, 0x01, 0xc1, 0x05, 0x06, 0x00, 0x00, 0x00];
 *
 * // decoded payload
 * const parameters = getLorawanState.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 8,
 *     downlinkQuality: 1,
 *     rssi: 193,
 *     snr: 5,
 *     deviceMargin: 6,
 *     gateMargin: 0,
 *     resetFlag: 0,
 *     senderCollision: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetLorawanState.md#response)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


/**
 * IGetLorawanStateResponseParameters command parameters
 */
interface IGetLorawanStateResponseParameters extends ICommandParameters {
    /** in percent */
    downlinkQuality: types.TUint8,
    /** RSSI of the last frame */
    rssi: types.TUint8,
    /** SNR of the last frame */
    snr: types.TUint8,
    deviceMargin: types.TUint8,
    gateMargin: types.TUint8,
    resetFlag: types.TUint8,
    senderCollision: types.TUint8,
}


export const id: types.TCommandId = 0x23;
export const name: types.TCommandName = 'getLorawanState';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getLorawanState': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 8,
            downlinkQuality: 1,
            rssi: 193,
            snr: 5,
            deviceMargin: 6,
            gateMargin: 0,
            resetFlag: 0,
            senderCollision: 0
        },
        bytes: [
            0x23, 0x08,
            0x08, 0x01, 0xc1, 0x05, 0x06, 0x00, 0x00, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetLorawanStateResponseParameters => {
    const [
        requestId,
        downlinkQuality,
        rssi,
        snr,
        deviceMargin,
        gateMargin,
        resetFlag,
        senderCollision
    ] = bytes;

    return {
        requestId,
        downlinkQuality,
        rssi,
        snr,
        deviceMargin,
        gateMargin,
        resetFlag,
        senderCollision
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetLorawanStateResponseParameters ): types.TBytes => command.toBytes(
    id,
    [
        parameters.requestId,
        parameters.downlinkQuality,
        parameters.rssi,
        parameters.snr,
        parameters.deviceMargin,
        parameters.gateMargin,
        parameters.resetFlag,
        parameters.senderCollision
    ]
);
