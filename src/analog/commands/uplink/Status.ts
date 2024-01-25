import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer, {IBatteryVoltage} from '../../CommandBinaryBuffer.js';
import roundNumber from '../../../utils/roundNumber.js';
import * as hardwareTypes from '../../constants/hardwareTypes.js';
import {UPLINK} from '../../../constants/directions.js';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IStatusBase {}

interface IProduct {
    version: number,
    type: number
}

interface IGasStatus extends IStatusBase {
    batteryVoltage: IBatteryVoltage,

    /**
     * battery internal resistance, in mΩ
     *
     * `65535` - unknown value and becomes `undefined`
     */
    batteryInternalResistance: number | undefined,

    /** signed value in degrees Celsius */
    temperature: number,

    /**
     * remaining battery capacity in percents
     *
     * `undefined` - unknown value
     */
    remainingBatteryCapacity: number | undefined,

    lastEventSequenceNumber: number
}

interface IMtxStatus extends IStatusBase {
    /* device time since 2000 year in seconds */
    time2000: number,
    /* reset indicator and its cause. */
    resetReason: number,
    /* `dBm` represents the Received Signal Strength Indicator (RSSI) of the last received frame */
    rssiLastDWFrame: number,
    /* `dBm` value of the Signal-to-Noise Ratio (SNR) of the last received frame */
    snrLastDWFrame: number,
    /* number of received downlink requests */
    downlinkRequestsNumber: number,
    /* number of received downlink frames */
    downlinkFragmentsNumber: number,
    /* number of sended uplink requests */
    uplinkResponsesNumber: number,
    /* number of sended uplink frames */
    uplinkFragmentsNumber: number,
    /* signal margin indicator during Mote to Gateway transmission in `dB`. 0 indicates no margin, 255 is reserved */
    signalMarginIndicatorFromMoteToGW: number,
    /* signal margin indicator during GW to Mote transmission in `dB`. 0 indicates no margin, 255 is reserved */
    signalMarginIndicatorFromGWToMote: number,
    /* indicates how many base stations the module can detect */
    detectedGatewaysNumber: number,
    /* indicates the error rate in communication with the base station in percentage (downlink frames) */
    gatewayDownlinkErrorRate: number,

    lastEventSequenceNumber: number
}

/**
 * Status command parameters
 */
interface IStatusParameters {
    software: IProduct,
    hardware: IProduct,
    data: IStatusBase
}


const COMMAND_ID = 0x14;
const COMMAND_BODY_MAX_SIZE = 20;
const UNKNOWN_BATTERY_RESISTANCE = 65535;

// max battery capacity, 254 - 100%
const UNKNOWN_BATTERY_CAPACITY = 255;

const examples: TCommandExampleList = [
    {
        name: 'status for GASI3',
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
        hex: {header: '14 0c', body: '02 0a 03 01 c5 6d c2 27 32 0e 68 22'}
    },
    {
        name: 'status for MTX',
        parameters: {
            software: {type: 2, version: 10},
            hardware: {type: hardwareTypes.MTXLORA, version: 1},
            data: {
                time2000: 4444,
                resetReason: 1,
                rssiLastDWFrame: 2,
                snrLastDWFrame: 6,
                downlinkRequestsNumber: 42,
                downlinkFragmentsNumber: 83,
                uplinkResponsesNumber: 143,
                uplinkFragmentsNumber: 2,
                signalMarginIndicatorFromMoteToGW: 5,
                signalMarginIndicatorFromGWToMote: 12,
                detectedGatewaysNumber: 10,
                gatewayDownlinkErrorRate: 2,
                lastEventSequenceNumber: 33
            }
        },
        hex: {header: '14 14', body: '02 0a 07 01 5c 11 00 00 01 02 06 2a 53 8f 02 05 0c 0a 02 21'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import Status from 'jooby-codec/analog/commands/uplink/Status.js';
 *
 * const commandBody = new Uint8Array([
 *     0x02, 0x0a, 0x03, 0x01, 0xc5, 0x6d, 0xc2, 0x27, 0x32, 0x0e, 0x68, 0x22
 * ]);
 * const command = Status.fromBytes(commandBody);
 *
 * console.log(command.parameters);
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
class Status extends Command {
    constructor ( public parameters: IStatusParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): Status {
        const buffer = new CommandBinaryBuffer(data);
        const software = {type: buffer.getUint8(), version: buffer.getUint8()};
        const hardware = {type: buffer.getUint8(), version: buffer.getUint8()};
        let statusData;

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
                statusData = {
                    batteryVoltage: buffer.getBatteryVoltage(),
                    batteryInternalResistance: buffer.getUint16(false),
                    temperature: buffer.getUint8(),
                    remainingBatteryCapacity: buffer.getUint8(),
                    lastEventSequenceNumber: buffer.getUint8()
                } as IGasStatus;

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

                break;

            case hardwareTypes.MTXLORA:
                statusData = {
                    time2000: buffer.getUint32(),
                    resetReason: buffer.getUint8(),
                    rssiLastDWFrame: buffer.getUint8(),
                    snrLastDWFrame: buffer.getUint8(),
                    downlinkRequestsNumber: buffer.getUint8(),
                    downlinkFragmentsNumber: buffer.getUint8(),
                    uplinkResponsesNumber: buffer.getUint8(),
                    uplinkFragmentsNumber: buffer.getUint8(),
                    signalMarginIndicatorFromMoteToGW: buffer.getUint8(),
                    signalMarginIndicatorFromGWToMote: buffer.getUint8(),
                    detectedGatewaysNumber: buffer.getUint8(),
                    gatewayDownlinkErrorRate: buffer.getUint8(),
                    lastEventSequenceNumber: buffer.getUint8()
                } as IMtxStatus;
                break;

            case hardwareTypes.ELIMP:
            default:
                throw new Error(`${this.getId()}: hardware type ${hardware.type} is not supported`);
        }

        return new Status({software, hardware, data: statusData});
    }

    toBinary (): ICommandBinary {
        const {software, hardware, data} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        let statusData;

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
                statusData = data as IGasStatus;
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

                break;

            case hardwareTypes.MTXLORA:
                statusData = data as IMtxStatus;
                buffer.setUint32(statusData.time2000);
                buffer.setUint8(statusData.resetReason);
                buffer.setUint8(statusData.rssiLastDWFrame);
                buffer.setUint8(statusData.snrLastDWFrame);
                buffer.setUint8(statusData.downlinkRequestsNumber);
                buffer.setUint8(statusData.downlinkFragmentsNumber);
                buffer.setUint8(statusData.uplinkResponsesNumber);
                buffer.setUint8(statusData.uplinkFragmentsNumber);
                buffer.setUint8(statusData.signalMarginIndicatorFromMoteToGW);
                buffer.setUint8(statusData.signalMarginIndicatorFromGWToMote);
                buffer.setUint8(statusData.detectedGatewaysNumber);
                buffer.setUint8(statusData.gatewayDownlinkErrorRate);
                buffer.setUint8(statusData.lastEventSequenceNumber);
                break;

            case hardwareTypes.ELIMP:
            default:
                throw new Error(`${Status.getId()}: hardware type ${hardware.type} is not supported`);
        }

        return Command.toBinary(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default Status;
