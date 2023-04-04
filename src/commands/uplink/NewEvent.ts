import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import * as Events from '../../constants/events.js';


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
    eventData: EventBase
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
            case Events.MAGNET_ON:
            case Events.MAGNET_OFF:
            case Events.ACTIVATE:
            case Events.DEACTIVATE:
            case Events.CAN_OFF:
            case Events.INSERT:
            case Events.REMOVE:
            case Events.COUNTER_OVER:
            case Events.EV_OPTOLOW:
            case Events.EV_OPTOFLASH:
            case Events.EV_REJOJN:
                eventData = {time: buffer.getUint8()} as EventTime;
                break;

            case Events.BATTERY_ALARM:
                eventData = {voltage: buffer.getUint8()} as EventBatteryAlarm;
                break;

            case Events.ACTIVATE_MTX:
                eventData = {time: buffer.getUint8(), mtxAddr: buffer.getUint8()} as EventActivateMtx;
                break;

            case Events.CONNECT:
            case Events.DISCONNECT:
                eventData = {channel: buffer.getUint8(), value: buffer.getExtendedValue()} as EventConnection;
                break;

            case Events.EV_MTX:
                eventData = {status1: buffer.getUint8(), status2: buffer.getUint8()} as EventMtx;
                break;

            default:
                throw new Error(`${this.getId()}: event ${id} not supported`);
        }

        return new NewEvent({id, sequenceNumber, eventData});
    }

    toBytes (): Uint8Array {
        const {id, sequenceNumber, eventData} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE, false);
        let data;

        buffer.setUint8(id);
        buffer.setUint8(sequenceNumber);

        switch ( id ) {
            case Events.MAGNET_ON:
            case Events.MAGNET_OFF:
            case Events.ACTIVATE:
            case Events.DEACTIVATE:
            case Events.CAN_OFF:
            case Events.INSERT:
            case Events.REMOVE:
            case Events.COUNTER_OVER:
            case Events.EV_OPTOLOW:
            case Events.EV_OPTOFLASH:
            case Events.EV_REJOJN:
                data = eventData as EventTime;

                buffer.setUint8(data.time);
                break;

            case Events.BATTERY_ALARM:
                data = eventData as EventBatteryAlarm;
                buffer.setUint8(data.voltage);
                break;

            case Events.ACTIVATE_MTX:
                data = eventData as EventActivateMtx;
                buffer.setUint8(data.time);
                buffer.setUint8(data.mtxAddr);
                break;

            case Events.CONNECT:
            case Events.DISCONNECT:
                data = eventData as EventConnection;
                buffer.setUint8(data.channel);
                buffer.setExtendedValue(data.value);
                break;

            case Events.EV_MTX:
                data = eventData as EventMtx;
                buffer.setUint8(data.status1);
                buffer.setExtendedValue(data.status2);
                break;

            default:
                throw new Error(`${NewEvent.getId()}: event ${id} not supported`);
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default NewEvent;
