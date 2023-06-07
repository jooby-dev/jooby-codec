import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ILegacyCounter} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {getTime2000FromDate, getDateFromTime2000, TTime2000} from '../../../utils/time.js';


/**
 * GetArchiveHoursResponse command parameters
 */
interface IGetArchiveHoursResponseParameters {
    startTime2000: TTime2000
    counter: ILegacyCounter,
    diff: Array<ILegacyCounter>
}


const COMMAND_ID = 0x05;

// date 2 bytes + 4 bytes of start hour
const COMMAND_BODY_MIN_SIZE = 2 + 4;
const DIFF_COUNTER_SIZE = 2;

const examples: TCommandExampleList = [
    {
        name: '1 hour archive from 2023.12.23 12:00:00 GMT',
        parameters: {
            startTime2000: 756648000,
            counter: {isMagneticInfluence: true, value: 163},
            diff: [
                {isMagneticInfluence: true, value: 10}
            ]
        },
        hex: {header: '05 08', body: '2f 97 8c 00 00 a3 80 0a'}
    }
];

const getDiff = ( buffer: CommandBinaryBuffer ): ILegacyCounter => {
    const bytes = [buffer.getUint8(), buffer.getUint8()];

    return {
        isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(bytes[0]),
        value: ((bytes[0] & 0x1f) << 8) | bytes[1]
    };
};

const setDiff = ( buffer: CommandBinaryBuffer, diff: ILegacyCounter ): void => {
    const bytes = [diff.value >> 8, diff.value & 0xff];

    bytes[0] = CommandBinaryBuffer.setMagneticInfluenceBit(bytes[0], diff.isMagneticInfluence);

    bytes.forEach(byte => buffer.setUint8(byte));
};


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetArchiveHoursResponse from 'jooby-codec/analog/commands/uplink/GetArchiveHoursResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x2f, 0x97, 0x0c, 0x8c, 0x00, 0x00, 0xa3, 0x80, 0x0a
 * ]);
 * const command = GetArchiveHoursResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     counter: {isMagneticInfluence: true, value: 163},
 *     diff: [
 *         {isMagneticInfluence: true, value: 10}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveHoursMC.md#response)
 */
class GetArchiveHoursResponse extends Command {
    constructor ( public parameters: IGetArchiveHoursResponseParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetArchiveHoursResponse {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const byte = buffer.getUint8();
        const {hour} = buffer.getHours(byte);
        const counter = {
            isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(byte),
            value: buffer.getLegacyCounterValue()
        };

        const diff = [];

        while ( buffer.offset < buffer.data.byteLength ) {
            diff.push(getDiff(buffer));
        }

        date.setUTCHours(hour);

        return new GetArchiveHoursResponse({counter, diff, startTime2000: getTime2000FromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {counter, startTime2000, diff} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE + (diff.length * DIFF_COUNTER_SIZE));
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();

        buffer.setDate(date);
        buffer.setHours(hour, 0);

        // reset byte with isMagneticInfluence bit
        buffer.seek(buffer.offset - 1);
        const byte = buffer.getUint8();
        buffer.seek(buffer.offset - 1);
        buffer.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(byte, counter.isMagneticInfluence));

        buffer.setLegacyCounterValue(counter.value);
        diff.forEach(diffItem => setDiff(buffer, diffItem));

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveHoursResponse;
