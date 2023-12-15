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
            case hardwareTypes.ELIMP:
            default:
                throw new Error(`${Status.getId()}: hardware type ${hardware.type} is not supported`);
        }

        return Command.toBinary(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default Status;
