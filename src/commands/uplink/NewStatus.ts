import Command from '../../Command.js';
import CommandBinaryBuffer, {IBatteryVoltage} from '../../CommandBinaryBuffer.js';
import * as hardwareTypes from '../../constants/hardwareTypes.js';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IStatusBase {}

interface IProduct {
    version: number,
    type: number
}


interface IGasStatus extends IStatusBase {
    voltage: IBatteryVoltage

    /**
     * battery internal resistance, in mΩ
     *
     * 65535 === undefined
     */
    internalResistance: number | undefined

    temperature: number

    /**
     * Remaining battery capacity
     *
     * 254 - 100%
     * 255 - unknown
     *
     * @example
     */
    remindedBatteryCapacity: number | undefined

    lastEventNumber: number
}


const COMMAND_ID = 0x14;
const COMMAND_TITLE = 'NEW_STATUS';
const COMMAND_BODY_MAX_SIZE = 20;
const UNKNOWN_RESISTANT = 65535;
const UNKNOWN_CAPACITY = 255;


/**
 * NewStatus command parameters
 *
 * @example
 * ```js
 * import {constants} from 'jooby-codec'
 *
 * // `Magnet On` event at 2023-04-05 13:17:20 GMT
 * {id: constants.events.MAGNET_ON, sequenceNumber: 1, data: {time: 734015840}}
 */
interface INewStatusParameters {
    software: IProduct,
    hardware: IProduct,
    data: IStatusBase
}


/**
 * Uplink command.
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/uplink/NewStatus.md#response)
 */
class NewStatus extends Command {
    constructor ( public parameters: INewStatusParameters ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly isUplink = true;

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): NewStatus {
        const buffer = new CommandBinaryBuffer(data);

        const software = {type: buffer.getUint8(), version: buffer.getUint8()};
        const hardware = {type: buffer.getUint8(), version: buffer.getUint8()};
        let statusData;

        switch ( hardware.type ) {
            case hardwareTypes.GAZM3:
            case hardwareTypes.GAZM0:
            case hardwareTypes.GAZM0NEW:
            case hardwareTypes.NOVATOR:
            case hardwareTypes.IMP2EU:
            case hardwareTypes.IMP4EU:
            case hardwareTypes.IMP2AS:
            case hardwareTypes.IMP2IN:
            case hardwareTypes.IMP4IN:
            case hardwareTypes.GAZWLE:
            case hardwareTypes.WATER:
            case hardwareTypes.PLC2LORA:
                statusData = {
                    voltage: buffer.getBatterVoltage(),
                    internalResistance: buffer.getUint16(false),
                    temperature: buffer.getUint8(),
                    remindedBatteryCapacity: buffer.getUint8(),
                    lastEventNumber: buffer.getUint8()
                } as IGasStatus;

                if ( statusData.internalResistance === UNKNOWN_RESISTANT ) {
                    statusData.internalResistance = undefined;
                }

                if ( statusData.remindedBatteryCapacity === UNKNOWN_CAPACITY ) {
                    statusData.remindedBatteryCapacity = undefined;
                }

                break;

            case hardwareTypes.MTXLORA:
            case hardwareTypes.ELIMP:
            default:
                throw new Error(`${this.getId()}: hardware type ${hardware.type} not supported`);
        }

        return new NewStatus({software, hardware, data: statusData});
    }

    toBytes (): Uint8Array {
        const {software, hardware, data} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE, false);
        let statusData;

        buffer.setUint8(software.type);
        buffer.setUint8(software.version);
        buffer.setUint8(hardware.type);
        buffer.setUint8(hardware.version);

        switch ( hardware.type ) {
            case hardwareTypes.GAZM3:
            case hardwareTypes.GAZM0:
            case hardwareTypes.GAZM0NEW:
            case hardwareTypes.NOVATOR:
            case hardwareTypes.IMP2EU:
            case hardwareTypes.IMP4EU:
            case hardwareTypes.IMP2AS:
            case hardwareTypes.IMP2IN:
            case hardwareTypes.IMP4IN:
            case hardwareTypes.GAZWLE:
            case hardwareTypes.WATER:
            case hardwareTypes.PLC2LORA:
                statusData = data as IGasStatus;
                buffer.setBatterVoltage(statusData.voltage);

                if ( statusData.internalResistance === undefined ) {
                    buffer.setUint8(UNKNOWN_RESISTANT);
                }

                if ( statusData.remindedBatteryCapacity === undefined ) {
                    buffer.setUint8(UNKNOWN_CAPACITY);
                }

                break;

            case hardwareTypes.MTXLORA:
            case hardwareTypes.ELIMP:
            default:
                throw new Error(`${NewStatus.getId()}: hardware type ${hardware.type} not supported`);
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default NewStatus;
