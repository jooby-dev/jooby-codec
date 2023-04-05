import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import * as events from '../../constants/events.js';


const COMMAND_ID = 0x15;
const COMMAND_TITLE = 'NEW_EVENT';
// connect/disconnect events are biggest
const COMMAND_BODY_MAX_SIZE = 6;


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEventBase {}

interface IEventTime extends IEventBase {
    time: number
}

interface IEventBatteryAlarm extends IEventBase {
    voltage: number
}

interface IEventActivateMtx extends IEventTime {
    mtxAddress: number
}

interface IEventConnection extends IEventBase {
    channel: number,
    value: number
}

interface IEventMtx extends IEventBase {
    status1: number,
    status2: number
}

interface INewEventParameters {
    id: number,
    sequenceNumber: number,
    data: IEventBase
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
            case events.EV_REJOIN:
                eventData = {time: buffer.getUint8()} as IEventTime;
                break;

            case events.BATTERY_ALARM:
                eventData = {voltage: buffer.getUint8()} as IEventBatteryAlarm;
                break;

            case events.ACTIVATE_MTX:
                eventData = {time: buffer.getUint8(), mtxAddress: buffer.getUint8()} as IEventActivateMtx;
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
                buffer.setUint8(eventData.time);
                break;

            case events.BATTERY_ALARM:
                eventData = data as IEventBatteryAlarm;
                buffer.setUint8(eventData.voltage);
                break;

            case events.ACTIVATE_MTX:
                eventData = data as IEventActivateMtx;
                buffer.setUint8(eventData.time);
                buffer.setUint8(eventData.mtxAddress);
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
                buffer.setExtendedValue(eventData.status2);
                break;

            default:
                throw new Error(`${NewEvent.getId()}: event ${id} not supported`);
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default NewEvent;
