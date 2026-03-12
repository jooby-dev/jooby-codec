/**
 * Uplink command to get the status of PLC pan controller feeders.
 *
 * The corresponding downlink command: `getFeedersStatus`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getFeedersStatus from 'jooby-codec/plc/commands/uplink/getFeedersStatus.js';
 *
 * // get feeders status response
 * const bytes = [
 *     0x0d, 0x03,
 *     0x00,
 *     0x01,
 *     0x01, 0x00, 0x01, 0x00, 0x02, 0x00,
 *     0x03, 0x00, 0x04, 0x00, 0x05, 0x00
 * ];
 *
 * // decoded payload
 * const parameters = getFeedersStatus.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     feeder1SynchronizationStatus: 0,
 *     feeder2SynchronizationStatus: 1,
 *     feeder1Voltage: {
 *         A: 0x0001,
 *         B: 0x0001,
 *         C: 0x0002
 *     },
 *     feeder2Voltage: {
 *         A: 0x0003,
 *         B: 0x0004,
 *         C: 0x0005
 *     }
 * }
 */

import * as types from '../../types.js';
import * as command from '../../../mtx1/utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {validateSetCommandPayload} from '../../../utils/validateCommandPayload.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {getFeedersStatus as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const minSize = 2;
export const maxSize = 14;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'get feeders status short': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            feeder1SynchronizationStatus: 0,
            feeder2SynchronizationStatus: 1
        },
        bytes: [
            0x0d, 0x02,
            0x00, 0x01
        ]
    },
    'get feeders status': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            feeder1SynchronizationStatus: 0,
            feeder2SynchronizationStatus: 1,
            feeder1Voltage: {
                A: 0x0001,
                B: 0x0001,
                C: 0x0002
            },
            feeder2Voltage: {
                A: 0x0003,
                B: 0x0004,
                C: 0x0005
            }
        },
        bytes: [
            0x0d, 0xe,
            0x00, 0x01,
            0x01, 0x00,
            0x01, 0x00,
            0x02, 0x00,
            0x03, 0x00,
            0x04, 0x00,
            0x05, 0x00
        ]
    }

};

interface IFeederVoltage {
    A: types.TUint16,
    B: types.TUint16,
    C: types.TUint16
}

const feederVoltageFromBuffer = ( buffer: IBinaryBuffer ): IFeederVoltage => ({
    A: buffer.getUint16(),
    B: buffer.getUint16(),
    C: buffer.getUint16()
});

const feederVoltageToBuffer = ( buffer: IBinaryBuffer, parameters: IFeederVoltage ) => {
    buffer.setUint16(parameters.A);
    buffer.setUint16(parameters.B);
    buffer.setUint16(parameters.C);
};

export interface IGetFeedersStatusParameters {
    feeder1SynchronizationStatus: types.TUint8,
    feeder2SynchronizationStatus: types.TUint8,
    feeder1Voltage?: IFeederVoltage,
    feeder2Voltage?: IFeederVoltage
}


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetFeedersStatusParameters => {
    validateSetCommandPayload(name, bytes, [minSize, maxSize]);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, true);
    const result = {
        feeder1SynchronizationStatus: buffer.getUint8(),
        feeder2SynchronizationStatus: buffer.getUint8()
    };

    return bytes.length === minSize
        ? result
        : {
            ...result,
            feeder1Voltage: feederVoltageFromBuffer(buffer),
            feeder2Voltage: feederVoltageFromBuffer(buffer)
        };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetFeedersStatusParameters ): types.TBytes => {
    const isItLongVariant = parameters.feeder1Voltage && parameters.feeder2Voltage;
    const buffer: IBinaryBuffer = new BinaryBuffer(isItLongVariant ? maxSize : minSize, true);

    buffer.setUint8(parameters.feeder1SynchronizationStatus);
    buffer.setUint8(parameters.feeder2SynchronizationStatus);

    if ( parameters.feeder1Voltage && parameters.feeder2Voltage ) {
        feederVoltageToBuffer(buffer, parameters.feeder1Voltage);
        feederVoltageToBuffer(buffer, parameters.feeder2Voltage);
    }

    return command.toBytes(id, buffer.data);
};
