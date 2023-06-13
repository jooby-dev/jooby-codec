import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {getTime2000FromDate, getDateFromTime2000, TTime2000} from '../../../utils/time.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * Day command parameters.
 */
interface IDayParameters {
    startTime2000: TTime2000,
    isMagneticInfluence: boolean,
    value: number
}


const COMMAND_ID = 0x20;
const COMMAND_BODY_SIZE = 6;

const examples: TCommandExampleList = [
    {
        name: 'day value for 2023.12.23 00:00:00 GMT',
        parameters: {
            startTime2000: 756604800,
            isMagneticInfluence: true,
            value: 122
        },
        hex: {header: '26', body: '2f 97 80 00 00 7a'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import Day from 'jooby-codec/analog/commands/uplink/Day.js';
 *
 * const commandBody = new Uint8Array([0x2f, 0x97, 0x80, 0x00, 0x00, 0x7a]);
 * const command = Day.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 756604800,
 *     isMagneticInfluence: true,
 *     value: 122
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/Day.md)
 */
class Day extends Command {
    constructor ( public parameters: IDayParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): Day {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const byte = buffer.getUint8();
        const {hour} = buffer.getHours(byte);
        const isMagneticInfluence = CommandBinaryBuffer.getMagneticInfluenceBit(byte);
        const value = buffer.getLegacyCounterValue();

        date.setUTCHours(hour);

        return new Day({value, isMagneticInfluence, startTime2000: getTime2000FromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        const {value, isMagneticInfluence, startTime2000} = this.parameters;
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();

        buffer.setDate(date);
        buffer.setHours(hour, 0);

        // reset byte with isMagneticInfluence bit
        buffer.seek(buffer.offset - 1);
        const byte = buffer.getUint8();
        buffer.seek(buffer.offset - 1);
        buffer.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(byte, isMagneticInfluence));
        buffer.setLegacyCounterValue(value);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array(), false);
    }
}


export default Day;
