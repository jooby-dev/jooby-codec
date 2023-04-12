import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannel} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directionTypes.js';
import {getDateFromSeconds} from '../../utils/time.js';


/**
 * GetArchiveHoursMul command parameters
 *
 * @example
 * // archive hours values from 001-03-10T12:00:00.000Z with 1-hour diff
 * {
 *     channels: [{value: 101, index: 0, diff: [value: 1]}],
 *     date: '2001-03-10T12:00:00.000Z',
 *     hourAmount: 1
 * }
 */
interface IUplinkGetArchiveHoursMulParameters {
    channels: Array<IChannel>,
    date: Date | undefined | string,
    hourAmount: number | undefined
}


const COMMAND_ID = 0x1a;
const COMMAND_TITLE = 'GET_ARCHIVE_HOURS_MUL';

// date 2 bytes, hour 1 byte, channels - 1 byte, so max channels = 4
// max hours diff - 7 (3 bit value)
// 4 + (4 channels * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 164;


class GetArchiveHoursMul extends Command {
    constructor ( public parameters: IUplinkGetArchiveHoursMulParameters ) {
        super();

        const {date, hourAmount, channels} = this.parameters;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if ( date === undefined ) {
            const [{time}] = channels;

            if ( time ) {
                this.parameters.date = getDateFromSeconds(time);
            } else {
                throw new Error(`${GetArchiveHoursMul.getName()} can't recognize time`);
            }
        } else if ( typeof date === 'string' ) {
            this.parameters.date = new Date(date);
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if ( hourAmount === undefined ) {
            this.parameters.hourAmount = channels[0].diff.length;
        }

        this.parameters.channels = this.parameters.channels.sort((a, b) => a.index - b.index);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): GetArchiveHoursMul {
        const buffer = new CommandBinaryBuffer(data);

        return new GetArchiveHoursMul(buffer.getChannelsValuesWithHourDiff());
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {hourAmount, date, channels} = this.parameters;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        buffer.setChannelsValuesWithHourDiff(hourAmount!, date as Date, channels);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveHoursMul;
