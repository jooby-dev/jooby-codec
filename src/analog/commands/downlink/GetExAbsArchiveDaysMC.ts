import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer, {IChannel} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {getTime2000FromDate, getDateFromTime2000, TTime2000} from '../../../utils/time.js';


/**
 * GetExAbsArchiveDaysMC command parameters
 */
interface IGetExAbsArchiveDaysMCParameters {
    /** the number of days to retrieve */
    days: number,
    startTime2000: TTime2000,
    /** array of channelList index numbers */
    channelList: Array<number>
}


// TODO: rework extended headers detection
const COMMAND_ID = 0x0d1f;
const COMMAND_BODY_SIZE = 4;

const examples: TCommandExampleList = [
    {
        name: '1 day absolute value for 1 channel from 2023.12.24 00:00:00 GMT',
        parameters: {startTime2000: 756691200, days: 1, channelList: [1]},
        hex: {header: '1f 0d 04', body: '2f 98 01 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetExAbsArchiveDaysMC from 'jooby-codec/analog/commands/downlink/GetExAbsArchiveDaysMC.js';
 *
 * const parameters = {startTime2000: 756691200, days: 1, channelList: [1]};
 * const command = new GetExAbsArchiveDaysMC(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 0d 04 2f 98 01 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetExAbsArchiveDaysMC.md#request)
 */
class GetExAbsArchiveDaysMC extends Command {
    constructor ( public parameters: IGetExAbsArchiveDaysMCParameters ) {
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
        const channelList = buffer.getChannels();
        const days = buffer.getUint8();

        if ( !buffer.isEmpty ) {
            throw new Error('BinaryBuffer is not empty.');
        }

        return new GetExAbsArchiveDaysMC({startTime2000: getTime2000FromDate(date), days, channelList});
    }

    toBinary (): ICommandBinary {
        const {startTime2000, days, channelList} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        const date = getDateFromTime2000(startTime2000);

        buffer.setDate(date);
        buffer.setChannels(channelList.map(index => ({index} as IChannel)));
        buffer.setUint8(days);

        return Command.toBinary(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetExAbsArchiveDaysMC;
