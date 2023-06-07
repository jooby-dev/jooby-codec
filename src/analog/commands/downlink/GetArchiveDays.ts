/**
 * [[include:commands/downlink/GetArchiveDays.md]]
 *
 * @packageDocumentation
 */

import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {getTime2000FromDate, getDateFromTime2000, TTime2000} from '../../../utils/time.js';


/**
 * GetArchiveDays command parameters
 */
interface IGetArchiveDaysParameters {
    /** the number of days to retrieve */
    days: number,
    startTime2000: TTime2000
}


const COMMAND_ID = 0x06;
const COMMAND_BODY_SIZE = 3;

const examples: TCommandExampleList = [
    {
        name: '1 day counter from 2023.03.10 00:00:00 GMT',
        parameters: {days: 1, startTime2000: 731721600},
        hex: {header: '06 03', body: '2e 6a 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetArchiveDays from 'jooby-codec/analog/commands/downlink/GetArchiveDays.js';
 *
 * const parameters = {days: 1, startTime2000: 731721600};
 * const command = new GetArchiveDays(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 06 03 2e 6a 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveDays.md#request)
 */
class GetArchiveDays extends Command {
    constructor ( public parameters: IGetArchiveDaysParameters ) {
        super();
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
        const days = buffer.getUint8();

        if ( !buffer.isEmpty ) {
            throw new Error('BinaryBuffer is not empty.');
        }

        return new GetArchiveDays({days, startTime2000: getTime2000FromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {days, startTime2000} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

        const date = getDateFromTime2000(startTime2000);

        buffer.setDate(date);
        buffer.setUint8(days);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveDays;
