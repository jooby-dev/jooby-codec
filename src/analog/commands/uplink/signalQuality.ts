/**
 * Signal quality for NB-IoT modules.
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
    /**
     * RSSI (Received Signal Strength Indicator):
     * The total power of all received signals, including both desired signals and interference, measured in dBm.
     * It provides a general indication of the signal strength but does not differentiate between useful and interfering signals.
     */
    rssi: types.TInt8;

    /**
     * RSRP (Reference Signal Received Power):
     * The average power level of the received reference signal, measured in dBm.
     * It indicates the signal strength specifically from the serving cell.
     */
    rsrp: types.TInt8;

    /**
     * RSRQ (Reference Signal Received Quality):
     * A ratio of RSRP to the total received power, measured in dB.
     * It reflects signal quality by considering interference and noise levels, affecting data transmission reliability.
     */
    rsrq: types.TInt8;

    /**
     * SINR (Signal-to-Interference-plus-Noise Ratio):
     * The ratio of the desired signal strength to the sum of interference and noise, measured in dB.
     * A higher SINR indicates better signal quality and higher data throughput.
     */
    sinr: types.TInt8;

    /**
     * Tx Power (Transmission Power):
     * The power level at which the device transmits signals to the network, measured in dBm.
     * It adjusts dynamically based on network conditions to ensure effective communication while conserving energy.
     */
    txPower: types.TInt8;

    /**
     * ECL (Energy Consumption Level):
     * Indicates the coverage enhancement level, which can be:
     * 0: Normal coverage.
     * 1: Extended coverage.
     * 2: Ultra-extended coverage.
     * Typically indicating whether the device is operating in normal, extended, or ultra-extended coverage areas.
     * It influences the power consumption and communication reliability.
     * With higher levels used in areas with weaker signals to improve connectivity at the cost of increased power consumption.
     */
    ecl: types.TUint8;
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
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetSignalQualityResponseParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const parameters = {
        rssi: buffer.getInt8(),
        rsrp: buffer.getInt8(),
        rsrq: buffer.getInt8(),
        sinr: buffer.getInt8(),
        txPower: buffer.getInt8(),
        ecl: buffer.getUint8()
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
    buffer.setUint8(ecl);

    return command.toBytes(id, buffer.data);
};
