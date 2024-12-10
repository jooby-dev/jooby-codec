/**
 * Signal quality for NB-IoT modules
 *
 * Used as a response to a downlink command or as an addition command to each uplink message if parameter 0x39 is enabled.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as signalQuality from 'jooby-codec/analog/commands/uplink/signalQuality.js';
 *
 * // response for signal quality
 * const bytes = [0x1f, 0x34, 0x06, 0xb7, 0xb3, 0xfc, 0x12, 0x01, 0x00];
 *
 * // decoded payload
 * const parameters = signalQuality.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     rssi: -73,
 *     rsrp: -77,
 *     rsrq: -4,
 *     sinr: 18,
 *     txPower: 1,
 *     ecl: 0,
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/SignalQuality.md)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {signalQuality as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export interface IGetSignalQualityResponseParameters {
    rssi: types.TInt8;
    rsrp: types.TInt8;
    rsrq: types.TInt8;
    sinr: types.TInt8;
    txPower: types.TInt8;
    ecl: types.TInt8;
}

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

const COMMAND_BODY_SIZE = 6;

export const examples: command.TCommandExamples = {
    'response for signal quality': {
        id,
        name,
        headerSize,
        parameters: {
            rssi: -73,
            rsrp: -77,
            rsrq: -4,
            sinr: 18,
            txPower: 1,
            ecl: 0
        },
        bytes: [
            0x1f, 0x34, 0x06,
            0xb7, 0xb3, 0xfc, 0x12, 0x01, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetSignalQualityResponseParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(data, false);
    const parameters = {
        rssi: buffer.getInt8(),
        rsrp: buffer.getInt8(),
        rsrq: buffer.getInt8(),
        sinr: buffer.getInt8(),
        txPower: buffer.getInt8(),
        ecl: buffer.getInt8()
    };

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return parameters;
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetSignalQualityResponseParameters ): types.TBytes => {
    const {
        rssi,
        rsrp,
        rsrq,
        sinr,
        txPower,
        ecl
    } = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setInt8(rssi);
    buffer.setInt8(rsrp);
    buffer.setInt8(rsrq);
    buffer.setInt8(sinr);
    buffer.setInt8(txPower);
    buffer.setInt8(ecl);

    return command.toBytes(id, buffer.data);
};
