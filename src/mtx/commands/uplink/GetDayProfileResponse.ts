import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {IDayProfile} from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


interface IGetDayProfileResponseParameters {
    periods: Array<IDayProfile>
}


const COMMAND_ID = 0x3b;
const MAX_PERIODS_NUMBER = 8;
const PERIODS_FINAL_BYTE = 0xff;

const examples: TCommandExampleList = [
    {
        name: 'full periods response',
        parameters: {
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
        hex: {header: '3b 08', body: '10 1d 22 2f 30 3d 46 4b'}
    },
    {
        name: 'response with 4 periods',
        parameters: {
            periods: [
                {tariff: 0, isFirstHalfHour: true, hour: 2},
                {tariff: 1, isFirstHalfHour: false, hour: 3},
                {tariff: 2, isFirstHalfHour: true, hour: 4},
                {tariff: 3, isFirstHalfHour: false, hour: 5}
            ]
        },
        hex: {header: '3b 05', body: '10 1d 22 2f ff'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetDayProfileResponse from 'jooby-codec/obis-observer/commands/uplink/GetDayProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x10, 0x1d, 0x22, 0x2f, 0xff]);
 * const command = GetDayProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     periods: [
 *         {tariff: 0, isFirstHalfHour: true, hour: 2},
 *         {tariff: 1, isFirstHalfHour: false, hour: 3},
 *         {tariff: 2, isFirstHalfHour: true, hour: 4},
 *         {tariff: 3, isFirstHalfHour: false, hour: 5}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetDayProfileResponse.md)
 */
class GetDayProfileResponse extends Command {
    constructor ( public parameters: IGetDayProfileResponseParameters ) {
        super();

        const hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER;

        // periods + final byte
        this.size = parameters.periods.length + +hasPeriodsFinalByte;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = MAX_PERIODS_NUMBER;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const hasPeriodsFinalByte = data.includes(PERIODS_FINAL_BYTE);
        // ignore final byte if present
        const cleanData = data.slice(0, data.length - +hasPeriodsFinalByte);
        const buffer = new CommandBinaryBuffer(cleanData);

        return new GetDayProfileResponse({
            periods: [...cleanData.slice(buffer.offset)]
                // eslint-disable-next-line @typescript-eslint/unbound-method
                .map(CommandBinaryBuffer.getDayProfileFromByte)
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

        // periods
        parameters.periods.forEach(period => buffer.setDayProfile(period));
        // add final byte if not full period set
        if ( hasPeriodsFinalByte ) {
            buffer.setUint8(PERIODS_FINAL_BYTE);
        }

        return buffer.toUint8Array();
    }
}


export default GetDayProfileResponse;
