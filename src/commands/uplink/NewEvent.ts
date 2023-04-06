import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import * as events from '../../constants/events.js';
import getHexFromBytes from '../../utils/getHexFromBytes.js';
import getBytesFromHex from '../../utils/getBytesFromHex.js';


const COMMAND_ID = 0x15;
const COMMAND_TITLE = 'NEW_EVENT';
// ACTIVATE_MTX are biggest,1 byte event id, 1 byte sequence number, 4 bytes time, 8 bytes mtx address
const COMMAND_BODY_MAX_SIZE = 14;
const MTX_ADDRESS_SIZE = 8;

const getVoltage = ( buffer: CommandBinaryBuffer ): number => buffer.getUint16(false);
const setVoltage = ( buffer: CommandBinaryBuffer, value: number ): void => buffer.setUint16(value, false);

const getDeviceId = ( buffer: CommandBinaryBuffer ): string => {
    const bytes = [];

    for ( let i = 0; i < MTX_ADDRESS_SIZE; ++i ) {
        bytes.push(buffer.getUint8());
    }

    return getHexFromBytes(new Uint8Array(bytes));
};

const setDeviceId = ( buffer: CommandBinaryBuffer, value: string ): void => {
    const bytes = getBytesFromHex(value);

    bytes.forEach(byte => buffer.setUint8(byte));
};


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEventBase {}

interface IEventTime extends IEventBase {
    time: number
}

interface IEventBatteryAlarm extends IEventBase {
    voltage: number
}

/**
 * MTX meters activation event.
 *
 * deviceId - hex string (like '00 1A 79 88 17 01 23 56'), 8 bytes contain unique meter id
 */
interface IEventActivateMtx extends IEventTime {
    deviceId: string
}

interface IEventConnection extends IEventBase {
    channel: number,
    value: number
}

interface IEventMtx extends IEventBase {
    status1: number,
    status2: number
}

/**
 * NewEvent command parameters
 *
 * @example
 * ```js
 * import {constants} from 'jooby-codec'
 *
 * // `Magnet On` event at 2023-04-05 13:17:20 GMT
 * {id: constants.events.MAGNET_ON, sequenceNumber: 1, data: {time: 734015840}}
 */
interface INewEventParameters {
    id: number,
    sequenceNumber: number,
    data: IEventBase
}


/**
 * Uplink command.
 *
 * @example
 * ```js
 * import {constants} from 'jooby-codec'
 * import NewEvent from 'jooby-codec/commands/uplink/NewEvent';
 *
 * // `Magnet On` event at 2023-04-05 13:17:20 GMT
 * const parameters = {id: constants.events.MAGNET_ON, sequenceNumber: 3, data: {time: 734015840}}
 * const command = new NewEvent(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 15 06 01 03 2b c0 31 60
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/uplink/NewEvent.md)
 */
class NewEvent extends Command {
    constructor ( public parameters: INewEventParameters ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly isUplink = true;

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): NewEvent {
        const buffer = new CommandBinaryBuffer(data);
        const id = buffer.getUint8();
        const sequenceNumber = buffer.getUint8();
        let eventData;

        switch ( id ) {
            case events.MAGNET_ON:
            case events.MAGNET_OFF:
            case events.ACTIVATE:
            case events.DEACTIVATE:
            case events.CAN_OFF:
            case events.INSERT:
            case events.REMOVE:
            case events.COUNTER_OVER:
            case events.EV_OPTOLOW:
            case events.EV_OPTOFLASH:
            case events.EV_REJOIN:
                eventData = {time: buffer.getTime()} as IEventTime;
                break;

            case events.BATTERY_ALARM:
                eventData = {voltage: getVoltage(buffer)} as IEventBatteryAlarm;
                break;

            case events.ACTIVATE_MTX:
                eventData = {time: buffer.getTime(), deviceId: getDeviceId(buffer)} as IEventActivateMtx;
                break;

            case events.CONNECT:
            case events.DISCONNECT:
                eventData = {channel: buffer.getUint8(), value: buffer.getExtendedValue()} as IEventConnection;
                break;

            case events.EV_MTX:
                eventData = {status1: buffer.getUint8(), status2: buffer.getUint8()} as IEventMtx;
                break;

            default:
                throw new Error(`${this.getId()}: event ${id} not supported`);
        }

        return new NewEvent({id, sequenceNumber, data: eventData});
    }

    toBytes (): Uint8Array {
        const {id, sequenceNumber, data} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE, false);
        let eventData;

        buffer.setUint8(id);
        buffer.setUint8(sequenceNumber);

        switch ( id ) {
            case events.MAGNET_ON:
            case events.MAGNET_OFF:
            case events.ACTIVATE:
            case events.DEACTIVATE:
            case events.CAN_OFF:
            case events.INSERT:
            case events.REMOVE:
            case events.COUNTER_OVER:
            case events.EV_OPTOLOW:
            case events.EV_OPTOFLASH:
            case events.EV_REJOIN:
                eventData = data as IEventTime;
                buffer.setTime(eventData.time);
                break;

            case events.BATTERY_ALARM:
                eventData = data as IEventBatteryAlarm;
                setVoltage(buffer, eventData.voltage);
                break;

            case events.ACTIVATE_MTX:
                eventData = data as IEventActivateMtx;
                buffer.setTime(eventData.time);
                setDeviceId(buffer, eventData.deviceId);
                break;

            case events.CONNECT:
            case events.DISCONNECT:
                eventData = data as IEventConnection;
                buffer.setUint8(eventData.channel);
                buffer.setExtendedValue(eventData.value);
                break;

            case events.EV_MTX:
                eventData = data as IEventMtx;
                buffer.setUint8(eventData.status1);
                buffer.setUint8(eventData.status2);
                break;

            default:
                throw new Error(`${NewEvent.getId()}: event ${id} not supported`);
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default NewEvent;
