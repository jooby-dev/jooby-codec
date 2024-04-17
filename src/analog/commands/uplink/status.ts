/**
 * Device status event.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as status from 'jooby-codec/analog/commands/uplink/status.js';
 *
 * // status for GASI3
 * const bytes = [0x02, 0x0a, 0x03, 0x01, 0xc5, 0x6d, 0xc2, 0x27, 0x32, 0x0e, 0x68, 0x22];
 *
 * // decoded payload
 * const parameters = status.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     software: {type: 2, version: 10},
 *     hardware: {type: 3, version: 1},
 *     data: {
 *         batteryVoltage: {underLowLoad: 3158, underHighLoad: 3522},
 *         batteryInternalResistance: 10034,
 *         temperature: 14,
 *         remainingBatteryCapacity: 41,
 *         lastEventSequenceNumber: 34
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetStatus.md#response)
 */

import CommandBinaryBuffer, {ICommandBinaryBuffer, IBatteryVoltage} from '../../utils/CommandBinaryBuffer.js';
import roundNumber from '../../../utils/roundNumber.js';
import * as types from '../../../types.js';
import * as hardwareTypes from '../../constants/hardwareTypes.js';
import * as command from '../../utils/command.js';


interface IStatusBase {}

interface IProduct {
    version: types.TUint8;
    type: types.TUint8;
}

interface IGasStatus extends IStatusBase {
    batteryVoltage: IBatteryVoltage;
    batteryInternalResistance?: types.TUint16;
    temperature: types.TUint8;
    remainingBatteryCapacity?: types.TUint8;
    lastEventSequenceNumber: types.TUint8;
}

interface IMtxStatus extends IStatusBase {
    time2000: types.TUint32;
    resetReason: types.TUint8;
    rssiLastDownlinkFrame: types.TUint8;
    snrLastDownlinkFrame: types.TUint8;
    downlinkRequestsNumber: types.TUint8;
    downlinkFragmentsNumber: types.TUint8;
    uplinkResponsesNumber: types.TUint8;
    uplinkFragmentsNumber: types.TUint8;
    signalMarginToGateway: types.TUint8;
    signalMarginFromGateway: types.TUint8;
    detectedGatewaysNumber: types.TUint8;
    gatewayDownlinkErrorRate: types.TUint8;
    lastEventSequenceNumber: types.TUint8;
}

/**
 * Status command parameters
 */
interface IStatusParameters {
    /**
     * Software type at the moment is always `2`.
     */
    software: IProduct;

    hardware: IProduct;
    data: IStatusBase;
}


export const id: types.TCommandId = 0x14;
export const name: types.TCommandName = 'status';
export const headerSize = 2;

const COMMAND_BODY_MAX_SIZE = 20;
const UNKNOWN_BATTERY_RESISTANCE = 65535;
const UNKNOWN_BATTERY_CAPACITY = 255;

export const examples: command.TCommandExamples = {
    'status for GASI3': {
        id,
        name,
        headerSize,
        parameters: {
            software: {type: 2, version: 10},
            hardware: {type: hardwareTypes.GASI3, version: 1},
            data: {
                batteryVoltage: {underLowLoad: 3158, underHighLoad: 3522},
                batteryInternalResistance: 10034,
                temperature: 14,
                remainingBatteryCapacity: 41,
                lastEventSequenceNumber: 34
            }
        },
        bytes: [
            0x14, 0x0c,
            0x02, 0x0a, 0x03, 0x01, 0xc5, 0x6d, 0xc2, 0x27, 0x32, 0x0e, 0x68, 0x22
        ]
    },
    'status for MTX': {
        id,
        name,
        headerSize,
        parameters: {
            software: {type: 2, version: 10},
            hardware: {type: hardwareTypes.MTXLORA, version: 1},
            data: {
                time2000: 4444,
                resetReason: 1,
                rssiLastDownlinkFrame: 2,
                snrLastDownlinkFrame: 6,
                downlinkRequestsNumber: 42,
                downlinkFragmentsNumber: 83,
                uplinkResponsesNumber: 143,
                uplinkFragmentsNumber: 2,
                signalMarginToGateway: 5,
                signalMarginFromGateway: 12,
                detectedGatewaysNumber: 10,
                gatewayDownlinkErrorRate: 2,
                lastEventSequenceNumber: 33
            }
        },
        bytes: [
            0x14, 0x14,
            0x02, 0x0a, 0x07, 0x01, 0x5c, 0x11, 0x00, 0x00,
            0x01, 0x02, 0x06, 0x2a, 0x53, 0x8f, 0x02, 0x05,
            0x0c, 0x0a, 0x02, 0x21
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IStatusParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const software = {type: buffer.getUint8(), version: buffer.getUint8()};
    const hardware = {type: buffer.getUint8(), version: buffer.getUint8()};
    let data;

    switch ( hardware.type ) {
        case hardwareTypes.GASI1:
        case hardwareTypes.GASI2:
        case hardwareTypes.GASI3:
        case hardwareTypes.NOVATOR:
        case hardwareTypes.IMP2EU:
        case hardwareTypes.IMP4EU:
        case hardwareTypes.IMP2AS:
        case hardwareTypes.IMP2IN:
        case hardwareTypes.IMP4IN:
        case hardwareTypes.GASIC:
        case hardwareTypes.NBIOT:
            {
                const statusData: IGasStatus = {
                    batteryVoltage: buffer.getBatteryVoltage(),
                    batteryInternalResistance: buffer.getUint16(false),
                    temperature: buffer.getUint8(),
                    remainingBatteryCapacity: buffer.getUint8(),
                    lastEventSequenceNumber: buffer.getUint8()
                };

                if ( statusData.batteryInternalResistance === UNKNOWN_BATTERY_RESISTANCE ) {
                    statusData.batteryInternalResistance = undefined;
                }

                if ( statusData.remainingBatteryCapacity === UNKNOWN_BATTERY_CAPACITY ) {
                    statusData.remainingBatteryCapacity = undefined;
                } else if ( statusData.remainingBatteryCapacity !== undefined ) {
                    statusData.remainingBatteryCapacity = roundNumber(
                        (statusData.remainingBatteryCapacity * 100) / (UNKNOWN_BATTERY_CAPACITY - 1),
                        0
                    );
                }

                data = statusData;
            }
            break;

        case hardwareTypes.MTXLORA:
            data = {
                time2000: buffer.getUint32(),
                resetReason: buffer.getUint8(),
                rssiLastDownlinkFrame: buffer.getUint8(),
                snrLastDownlinkFrame: buffer.getUint8(),
                downlinkRequestsNumber: buffer.getUint8(),
                downlinkFragmentsNumber: buffer.getUint8(),
                uplinkResponsesNumber: buffer.getUint8(),
                uplinkFragmentsNumber: buffer.getUint8(),
                signalMarginToGateway: buffer.getUint8(),
                signalMarginFromGateway: buffer.getUint8(),
                detectedGatewaysNumber: buffer.getUint8(),
                gatewayDownlinkErrorRate: buffer.getUint8(),
                lastEventSequenceNumber: buffer.getUint8()
            } as IMtxStatus;
            break;

        case hardwareTypes.ELIMP:
        default:
            throw new Error(`${id}: hardware type ${hardware.type} is not supported`);
    }

    return {software, hardware, data};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IStatusParameters ): types.TBytes => {
    const {software, hardware, data} = parameters;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);

    buffer.setUint8(software.type);
    buffer.setUint8(software.version);
    buffer.setUint8(hardware.type);
    buffer.setUint8(hardware.version);

    switch ( hardware.type ) {
        case hardwareTypes.GASI1:
        case hardwareTypes.GASI2:
        case hardwareTypes.GASI3:
        case hardwareTypes.NOVATOR:
        case hardwareTypes.IMP2EU:
        case hardwareTypes.IMP4EU:
        case hardwareTypes.IMP2AS:
        case hardwareTypes.IMP2IN:
        case hardwareTypes.IMP4IN:
        case hardwareTypes.GASIC:
            {
                const statusData = data as IGasStatus;
                buffer.setBatteryVoltage(statusData.batteryVoltage);

                if ( statusData.batteryInternalResistance === undefined ) {
                    buffer.setUint16(UNKNOWN_BATTERY_RESISTANCE, false);
                } else {
                    buffer.setUint16(statusData.batteryInternalResistance, false);
                }

                buffer.setUint8(statusData.temperature);

                if ( statusData.remainingBatteryCapacity === undefined ) {
                    buffer.setUint8(UNKNOWN_BATTERY_CAPACITY);
                } else {
                    buffer.setUint8((UNKNOWN_BATTERY_CAPACITY - 1) * (statusData.remainingBatteryCapacity / 100));
                }

                buffer.setUint8(statusData.lastEventSequenceNumber);
            }
            break;

        case hardwareTypes.MTXLORA:
            {
                const statusData = data as IMtxStatus;
                buffer.setUint32(statusData.time2000);
                buffer.setUint8(statusData.resetReason);
                buffer.setUint8(statusData.rssiLastDownlinkFrame);
                buffer.setUint8(statusData.snrLastDownlinkFrame);
                buffer.setUint8(statusData.downlinkRequestsNumber);
                buffer.setUint8(statusData.downlinkFragmentsNumber);
                buffer.setUint8(statusData.uplinkResponsesNumber);
                buffer.setUint8(statusData.uplinkFragmentsNumber);
                buffer.setUint8(statusData.signalMarginToGateway);
                buffer.setUint8(statusData.signalMarginFromGateway);
                buffer.setUint8(statusData.detectedGatewaysNumber);
                buffer.setUint8(statusData.gatewayDownlinkErrorRate);
                buffer.setUint8(statusData.lastEventSequenceNumber);
            }
            break;

        case hardwareTypes.ELIMP:
        default:
            throw new Error(`${id}: hardware type ${hardware.type} is not supported`);
    }

    return command.toBytes(id, buffer.getBytesToOffset());
};
