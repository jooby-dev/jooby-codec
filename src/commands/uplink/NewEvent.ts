import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import * as events from '../../constants/events.js';


const COMMAND_ID = 0x15;
const COMMAND_TITLE = 'NEW_EVENT';
// connect/disconnect events are biggest
const COMMAND_BODY_MAX_SIZE = 6;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EventBase {}

type EventTime = EventBase & {
    time: number
};

type EventBatteryAlarm = EventBase & {
    voltage: number
};

type EventActivateMtx = EventTime & {
    mtxAddr: number
};

type EventConnection = EventBase & {
    channel: number,
    value: number
};

type EventMtx = EventBase & {
    status1: number,
    status2: number
};

interface INewEventParameters {
    id: number,
    sequenceNumber: number,
    data: EventBase
}


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
            case events.EV_REJOJN:
                eventData = {time: buffer.getUint8()} as EventTime;
                break;

            case events.BATTERY_ALARM:
                eventData = {voltage: buffer.getUint8()} as EventBatteryAlarm;
                break;

            case events.ACTIVATE_MTX:
                eventData = {time: buffer.getUint8(), mtxAddr: buffer.getUint8()} as EventActivateMtx;
                break;

            case events.CONNECT:
            case events.DISCONNECT:
                eventData = {channel: buffer.getUint8(), value: buffer.getExtendedValue()} as EventConnection;
                break;

            case events.EV_MTX:
                eventData = {status1: buffer.getUint8(), status2: buffer.getUint8()} as EventMtx;
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
            case events.EV_REJOJN:
                eventData = data as EventTime;

                buffer.setUint8(eventData.time);
                break;

            case events.BATTERY_ALARM:
                eventData = data as EventBatteryAlarm;
                buffer.setUint8(eventData.voltage);
                break;

            case events.ACTIVATE_MTX:
                eventData = data as EventActivateMtx;
                buffer.setUint8(eventData.time);
                buffer.setUint8(eventData.mtxAddr);
                break;

            case events.CONNECT:
            case events.DISCONNECT:
                eventData = data as EventConnection;
                buffer.setUint8(eventData.channel);
                buffer.setExtendedValue(eventData.value);
                break;

            case events.EV_MTX:
                eventData = data as EventMtx;
                buffer.setUint8(eventData.status1);
                buffer.setExtendedValue(eventData.status2);
                break;

            default:
                throw new Error(`${NewEvent.getId()}: event ${id} not supported`);
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default NewEvent;
