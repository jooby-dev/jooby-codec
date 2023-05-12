/**
 * [[include:commands/downlink/GetArchiveDaysMC.md]]
 *
 * @packageDocumentation
 */

import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IChannel} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {getSecondsFromDate, getDateFromSeconds, TTime2000} from '../../../utils/time.js';


/**
 * GetArchiveDaysMC command parameters
 */
interface IGetArchiveDaysMCParameters {
    /** the number of days to retrieve */
    days: number,
    startTime: TTime2000,
    /** array of channelList index numbers */
    channelList: Array<number>
}


const COMMAND_ID = 0x1b;
const COMMAND_BODY_SIZE = 4;

const examples: TCommandExampleList = [
    {
        name: '1 day pulse counter for 1 channel from 2023.03.10 00:00:00 GMT',
        parameters: {channelList: [1], days: 1, startTime: 731721600},
        hex: {header: '1b 04', body: '2e 6a 01 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetArchiveDaysMC from 'jooby-codec/analog/commands/downlink/GetArchiveDaysMC.js';
 *
 * const parameters = {channelList: [1], days: 1, startTime: 731721600};
 * const command = new GetArchiveDaysMC(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1b 04 2e 6a 01 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetArchiveDaysMC.md#request)
 */
class GetArchiveDaysMC extends Command {
    constructor ( public parameters: IGetArchiveDaysMCParameters ) {
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

        return new GetArchiveDaysMC({channelList, days, startTime: getSecondsFromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {channelList, days, startTime} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

        const date = getDateFromSeconds(startTime);

        buffer.setDate(date);
        buffer.setChannels(channelList.map(index => ({index} as IChannel)));
        buffer.setUint8(days);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveDaysMC;
