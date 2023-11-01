import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {IDayProfile} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


interface ISetDayProfileParameters {
    tariffTable: number,
    index: number,
    periods: Array<IDayProfile>
}


const COMMAND_ID = 0x10;
const MAX_PERIODS_NUMBER = 8;
const PERIODS_FINAL_BYTE = 0xff;

const examples: TCommandExampleList = [
    {
        name: 'set day profile with 1 period',
        parameters: {
            tariffTable: 0,
            index: 3,
            periods: [
                {tariff: 0, isFirstHalfHour: true, hour: 2}
            ]
        },
        hex: {header: '10 04', body: '00 03 10 ff'}
    },
    {
        name: 'set day profile with 4 periods',
        parameters: {
            tariffTable: 0,
            index: 5,
            periods: [
                {tariff: 0, isFirstHalfHour: true, hour: 2},
                {tariff: 1, isFirstHalfHour: false, hour: 3},
                {tariff: 2, isFirstHalfHour: true, hour: 4},
                {tariff: 3, isFirstHalfHour: false, hour: 5}
            ]
        },
        hex: {header: '10 07', body: '00 05 10 1d 22 2f ff'}
    },
    {
        name: 'set day profile with max periods',
        parameters: {
            tariffTable: 0,
            index: 3,
            periods: [
                {tariff: 0, isFirstHalfHour: true, hour: 2},
                {tariff: 1, isFirstHalfHour: false, hour: 3},
                {tariff: 2, isFirstHalfHour: true, hour: 4},
                {tariff: 3, isFirstHalfHour: false, hour: 5},
                {tariff: 0, isFirstHalfHour: true, hour: 6},
                {tariff: 1, isFirstHalfHour: false, hour: 7},
                {tariff: 2, isFirstHalfHour: false, hour: 8},
                {tariff: 3, isFirstHalfHour: true, hour: 9}
            ]
        },
        hex: {header: '10 0a', body: '00 03 10 1d 22 2f 30 3d 46 4b'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetDayProfile from 'jooby-codec/mtx/commands/downlink/SetDayProfile.js';
 *
 * const parameters = {
 *     tariffTable: 0,
 *     index: 5,
 *     periods: [
 *         {tariff: 0, isFirstHalfHour: true, hour: 2},
 *         {tariff: 1, isFirstHalfHour: false, hour: 3},
 *         {tariff: 2, isFirstHalfHour: true, hour: 4},
 *         {tariff: 3, isFirstHalfHour: false, hour: 5}
 *     ]
 * };
 * const command = new SetDayProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 10 07 00 05 10 1d 22 2f ff
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetDayProfile.md#request)
 */
class SetDayProfile extends Command {
    constructor ( public parameters: ISetDayProfileParameters ) {
        super();

        const hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER;

        // tariffTable + index + periods + final byte
        this.size = 2 + parameters.periods.length + +hasPeriodsFinalByte;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_WRITE;

    static readonly maxSize = 2 + MAX_PERIODS_NUMBER;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const hasPeriodsFinalByte = data.includes(PERIODS_FINAL_BYTE);
        // ignore final byte if present
        const cleanData = data.slice(0, data.length - +hasPeriodsFinalByte);
        const buffer = new CommandBinaryBuffer(cleanData);

        return new SetDayProfile({
            tariffTable: buffer.getUint8(),
            index: buffer.getUint8(),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            periods: [...cleanData.slice(buffer.offset)].map(CommandBinaryBuffer.getDayProfileFromByte)
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);

        // periods
        parameters.periods.forEach(period => buffer.setDayProfile(period));
        // add final byte if not full period set
        if ( hasPeriodsFinalByte ) {
            buffer.setUint8(PERIODS_FINAL_BYTE);
        }

        return buffer.toUint8Array();
    }
}


export default SetDayProfile;
