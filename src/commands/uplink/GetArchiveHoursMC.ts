import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannel} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directionTypes.js';
import {getDateFromSeconds} from '../../utils/time.js';


/**
 * GetArchiveHoursMC command parameters
 *
 * @example
 * // archive hours values from 001-03-10T12:00:00.000Z with 1-hour diff
 * {
 *     channelList: [{value: 101, index: 0, diff: [value: 1]}],
 *     date: '2001-03-10T12:00:00.000Z',
 *     hours: 1
 * }
 */
interface IUplinkGetArchiveHoursMCParameters {
    channelList: Array<IChannel>,
    date: Date | undefined | string,
    hours: number | undefined
}


const COMMAND_ID = 0x1a;
const COMMAND_TITLE = 'GET_ARCHIVE_HOURS_MUL';

// date 2 bytes, hour 1 byte, channelList - 1 byte, so max channelList = 4
// max hours diff - 7 (3 bit value)
// 4 + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 164;


class GetArchiveHoursMC extends Command {
    constructor ( public parameters: IUplinkGetArchiveHoursMCParameters ) {
        super();

        const {date, hours, channelList} = this.parameters;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if ( date === undefined ) {
            const [{seconds}] = channelList;

            if ( seconds ) {
                this.parameters.date = getDateFromSeconds(seconds);
            } else {
                throw new Error(`${GetArchiveHoursMC.getName()} can't recognize time`);
            }
        } else if ( typeof date === 'string' ) {
            this.parameters.date = new Date(date);
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if ( hours === undefined ) {
            this.parameters.hours = channelList[0].diff.length;
        }

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): GetArchiveHoursMC {
        const buffer = new CommandBinaryBuffer(data);

        return new GetArchiveHoursMC(buffer.getChannelsValuesWithHourDiff());
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {hours, date, channelList} = this.parameters;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        buffer.setChannelsValuesWithHourDiff(hours!, date as Date, channelList);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveHoursMC;
