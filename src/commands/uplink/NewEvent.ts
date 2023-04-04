/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import EventId from '../../events/id.js';
import EventBase from '../../events/EventBase.js';
import EventMap from '../../events/index.js';


const COMMAND_ID = 0x15;
const COMMAND_TITLE = 'NEW_EVENT';

// 2 bytes for 7 channels + (7 channels * 5 byte for current value of channel)
const COMMAND_BODY_MAX_SIZE = 37;


interface INewEventParameters {
    id: EventId,
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

        const id: EventId = buffer.getUint8();
        const sequenceNumber = buffer.getUint8();
        const Event = EventMap.get(id);
        const eventData: EventBase = Event.fromBytes(buffer);

        return new NewEvent({id, sequenceNumber, eventData});
    }

    toBytes (): Uint8Array {
        const {id, sequenceNumber, eventData} = this.parameters;

        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE, false);

        buffer.setUint8(id);
        buffer.setUint8(sequenceNumber);
        eventData.setBytes(buffer);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default NewEvent;
