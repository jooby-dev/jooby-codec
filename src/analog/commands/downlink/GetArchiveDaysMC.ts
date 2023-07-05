/**
 * [[include:commands/downlink/GetArchiveDaysMC.md]]
 *
 * @packageDocumentation
 */

import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IChannel} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {getTime2000FromDate, getDateFromTime2000, TTime2000} from '../../../utils/time.js';


/**
 * GetArchiveDaysMC command parameters
 */
interface IGetArchiveDaysMCParameters {
    startTime2000: TTime2000,
    /** the number of days to retrieve */
    days: number,
    /** array of channelList index numbers */
    channelList: Array<number>
}


const COMMAND_ID = 0x1b;
const COMMAND_BODY_SIZE = 4;

const examples: TCommandExampleList = [
    {
        name: '1 day pulse counter for 1 channel from 2023.03.10 00:00:00 GMT',
        parameters: {startTime2000: 731721600, days: 1, channelList: [1]},
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
 * const parameters = {startTime2000: 731721600, days: 1, channelList: [1]};
 * const command = new GetArchiveDaysMC(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1b 04 2e 6a 01 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveDaysMC.md#request)
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

        return new GetArchiveDaysMC({startTime2000: getTime2000FromDate(date), days, channelList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {startTime2000, days, channelList} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        const date = getDateFromTime2000(startTime2000);

        buffer.setDate(date);
        buffer.setChannels(channelList.map(index => ({index} as IChannel)));
        buffer.setUint8(days);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveDaysMC;
