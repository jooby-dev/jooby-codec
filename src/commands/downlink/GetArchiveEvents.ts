import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directionTypes.js';


/**
 * GetArchiveEvents command parameters
 *
 * @example
 * // request 4 events from 2023-04-03T14:01:17.000Z
 * {seconds: 733845677, events: 4}
 */
interface IDownlinkGetArchiveEventsParameters {
    seconds: number,
    events: number
}


const COMMAND_ID = 0x0b;
const COMMAND_TITLE = 'GET_ARCHIVE_EVENTS';
const COMMAND_BODY_SIZE = 5;

const examples: TCommandExampleList = [
    {
        name: 'request 4 events from 2023-04-03T14:01:17.000Z',
        parameters: {seconds: 733845677, events: 4},
        hex: {
            header: '0b 05',
            body: '2b bd 98 ad 04'
        }
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetArchiveEvents from 'jooby-codec/commands/downlink/GetArchiveEvents';
 *
 * const command = new GetArchiveEvents({seconds: 733845677, events: 4});
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0b 05 2b bd 98 ad 04
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetArchiveEvents.md#request)
 */
class GetArchiveEvents extends Command {
    constructor ( public parameters: IDownlinkGetArchiveEventsParameters ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly title = COMMAND_TITLE;

    static readonly examples = examples;

    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const seconds = buffer.getTime();
        const events = buffer.getUint8();

        return new GetArchiveEvents({events, seconds});
    }

    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        const {seconds, events} = this.parameters;

        buffer.setTime(seconds);
        buffer.setUint8(events);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveEvents;
