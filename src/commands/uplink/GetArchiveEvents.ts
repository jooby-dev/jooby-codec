import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import * as events from '../../constants/events.js';
import {TTime2000} from '../../utils/time.js';


interface IArchiveEvent {
    time: TTime2000,
    id: number,
    sequenceNumber: number,
}

/**
 * GetArchiveEvents command parameters
 *
 * @example
 * ```js
 * import {constants} from 'jooby-codec';
 *
 * // one `MAGNET_ON` event at 2023-04-05 13:17:20 GMT
 * [events: {id: constants.events.MAGNET_ON, sequenceNumber: 1, time: 734015840}]
 */
interface IUplinkGetArchiveEventsParameters {
    eventList: Array<IArchiveEvent>
}


const COMMAND_ID = 0x0b;
const COMMAND_TITLE = 'GET_ARCHIVE_EVENTS';
// 4 bytes for event seconds, 1 byte for event id, 1 byte for sequence number
const COMMAND_BODY_MIN_SIZE = 4 + 1 + 1;

const examples: TCommandExampleList = [
    {
        name: '1 event - "MAGNET_ON" at 2023-04-05 13:17:20 GMT',
        parameters: {
            eventList: [
                {
                    time: 734015840,
                    id: events.MAGNET_ON,
                    sequenceNumber: 1
                }
            ]
        },
        hex: {header: '0b 06', body: '2b c0 31 60 01 01'}
    },
    {
        name: '4 events example',
        parameters: {
            eventList: [
                {
                    time: 734015840,
                    id: events.MAGNET_OFF,
                    sequenceNumber: 1
                },
                {
                    time: 734025840,
                    id: events.MAGNET_ON,
                    sequenceNumber: 2
                },
                {
                    time: 734035840,
                    id: events.ACTIVATE,
                    sequenceNumber: 3
                },
                {
                    time: 734045840,
                    id: events.DEACTIVATE,
                    sequenceNumber: 4
                }
            ]
        },
        hex: {header: '0b 18', body: '2b c0 31 60 02 01 2b c0 58 70 01 02 2b c0 7f 80 03 03 2b c0 a6 90 04 04'}
    }
];


const getEvent = ( buffer: CommandBinaryBuffer ): IArchiveEvent => ({
    time: buffer.getTime(),
    id: buffer.getUint8(),
    sequenceNumber: buffer.getUint8()
});

const setEvent = ( buffer: CommandBinaryBuffer, event: IArchiveEvent ): void => {
    buffer.setTime(event.time);
    buffer.setUint8(event.id);
    buffer.setUint8(event.sequenceNumber);
};


/**
 * Uplink command.
 *
 * @example
 * ```js
 * import GetArchiveEvents from 'jooby-codec/commands/uplink/GetArchiveEvents';
 * import {constants} from 'jooby-codec';
 *
 * const parameters = [eventList: {id: constants.events.MAGNET_ON, sequenceNumber: 1, time: 734015840}];
 * const command = new GetArchiveEvents(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0b 06 2b c0 31 60 01 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetArchiveEvents.md#response)
 */
class GetArchiveEvents extends Command {
    constructor ( public parameters: IUplinkGetArchiveEventsParameters ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    static readonly examples = examples;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const eventList: Array<IArchiveEvent> = [];

        while ( buffer.bytesLeft > 0 ) {
            eventList.push(getEvent(buffer));
        }

        return new GetArchiveEvents({eventList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {eventList} = this.parameters;
        const buffer = new CommandBinaryBuffer(eventList.length * COMMAND_BODY_MIN_SIZE);

        eventList.forEach(event => setEvent(buffer, event));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveEvents;
