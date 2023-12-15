import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer, {IChannel} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {getTime2000FromDate, getDateFromTime2000, TTime2000} from '../../../utils/time.js';


/**
 * GetExAbsArchiveHoursMC command parameters
 */
interface IGetExAbsArchiveHoursMCParameters {
    /** the number of hours to retrieve */
    hours: number,
    startTime2000: TTime2000,
    /** array of channelList index numbers */
    channelList: Array<number>
}


// TODO: rework extended headers detection
const COMMAND_ID = 0x0c1f;
const COMMAND_BODY_SIZE = 4;

const examples: TCommandExampleList = [
    {
        name: '1 hour absolute values for 1 channel from 2023.12.23 12:00:00 GMT',
        parameters: {startTime2000: 756648000, hours: 1, channelList: [1]},
        hex: {header: '1f 0c 04', body: '2f 97 0c 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetExAbsArchiveHoursMC from 'jooby-codec/analog/commands/downlink/GetExAbsArchiveHoursMC.js';
 *
 * const parameters = {startTime2000: 756648000, hours: 1, channelList: [1]};
 * const command = new GetExAbsArchiveHoursMC(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 0c 04 2f 97 0c 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetExAbsArchiveHoursMC.md#request)
 */
class GetExAbsArchiveHoursMC extends Command {
    constructor ( public parameters: IGetExAbsArchiveHoursMCParameters ) {
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
        const {hour, hours} = buffer.getHours();
        const channelList = buffer.getChannels();

        date.setUTCHours(hour);

        if ( !buffer.isEmpty ) {
            throw new Error('BinaryBuffer is not empty.');
        }

        return new GetExAbsArchiveHoursMC({channelList, hours, startTime2000: getTime2000FromDate(date)});
    }

    toBinary (): ICommandBinary {
        const {channelList, hours, startTime2000} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();

        buffer.setDate(date);
        buffer.setHours(hour, hours);
        buffer.setChannels(channelList.map(index => ({index} as IChannel)));

        return Command.toBinary(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetExAbsArchiveHoursMC;
