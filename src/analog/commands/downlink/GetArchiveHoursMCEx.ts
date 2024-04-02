import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer, {IChannel} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {getTime2000FromDate, getDateFromTime2000, TTime2000} from '../../../utils/time.js';
import {TUint8} from "../../../types";


/**
 * GetArchiveHoursMCEx command parameters
 */
interface IGetArchiveHoursMCExParameters {
    hour: TUint8,
    /** the number of hours to retrieve */
    hours: TUint8,
    startTime2000: TTime2000,
    /** array of channelList index numbers */
    channelList: Array<number>
}


// TODO: rework extended headers detection
const COMMAND_ID = 0x301f;
const COMMAND_BODY_SIZE = 5;

const examples: TCommandExampleList = [
    {
        name: 'hour pulse counter and 48 hour diff for 1 channel from 2023.12.23 12:00:00 GMT',
        parameters: {startTime2000: 756648000, hour: 12, hours: 2, channelList: [1]},
        hex: {header: '1f 30 05', body: '2f 97 0c 02 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetArchiveHoursMCEx from 'jooby-codec/analog/commands/downlink/GetArchiveHoursMCEx.js';
 *
 * const parameters = {startTime2000: 756648000, hour: 12, hours: 2, channelList: [1]};
 * const command = new GetArchiveHoursMC(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 30 05 2f 97 0c 02 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveHoursMCEx.md#request)
 */
class GetArchiveHoursMCEx extends Command {
    constructor ( public parameters: IGetArchiveHoursMCExParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a - b);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const hour = buffer.getUint8();
        const hours = buffer.getUint8();
        const channelList = buffer.getChannels();

        date.setUTCHours(hour);

        if ( !buffer.isEmpty ) {
            throw new Error('BinaryBuffer is not empty.');
        }

        return new GetArchiveHoursMCEx({startTime2000: getTime2000FromDate(date), hour, hours, channelList});
    }

    toBinary (): ICommandBinary {
        const {channelList, hour, hours, startTime2000} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        const date = getDateFromTime2000(startTime2000);

        buffer.setDate(date);
        buffer.setUint8(hour);
        buffer.setUint8(hours);
        buffer.setChannels(channelList.map(index => ({index} as IChannel)));

        return Command.toBinary(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveHoursMCEx;
