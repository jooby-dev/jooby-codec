import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * GetArchiveEvents command parameters
 *
 * @example
 * // request 4 events from 2023-04-03T14:01:17.000Z
 * {startTime2000: 733845677, events: 4}
 */
interface IGetArchiveEventsParameters {
    startTime2000: TTime2000,
    events: number
}


const COMMAND_ID = 0x0b;
const COMMAND_BODY_SIZE = 5;

const examples: TCommandExampleList = [
    {
        name: 'request 4 events from 2023.04.03 14:01:17 GMT',
        parameters: {startTime2000: 733845677, events: 4},
        hex: {header: '0b 05', body: '2b bd 98 ad 04'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetArchiveEvents from 'jooby-codec/analog/commands/downlink/GetArchiveEvents.js';
 *
 * const command = new GetArchiveEvents({startTime2000: 733845677, events: 4});
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0b 05 2b bd 98 ad 04
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveEvents.md#request)
 */
class GetArchiveEvents extends Command {
    constructor ( public parameters: IGetArchiveEventsParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const startTime2000 = buffer.getTime();
        const events = buffer.getUint8();

        return new GetArchiveEvents({events, startTime2000});
    }

    toBinary (): ICommandBinary {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        const {startTime2000, events} = this.parameters;

        buffer.setTime(startTime2000);
        buffer.setUint8(events);

        return Command.toBinary(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveEvents;
