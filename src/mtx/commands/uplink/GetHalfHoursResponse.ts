import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {IPeriod} from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';
import {IDate} from '../../utils/dateTime.js';
import {TUint8} from '../../../types.js';


interface IGetHalfHoursResponseParameters {
    date: IDate,
    periods: Array<IPeriod>,
    /** if DST start/end of this day, contain DST hour */
    dst?: TUint8
}


const COMMAND_ID = 0x15;
const MIN_PERIODS = 48;
const MIN_COMMAND_SIZE = 3 + (MIN_PERIODS * 2);
const MAX_PERIODS = 50;
const MAX_COMMAND_SIZE = 4 + (MAX_PERIODS * 2);

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            date: {
                year: 24,
                month: 3,
                date: 22
            },
            periods: [
                {tariff: 1, energy: 1111},
                {tariff: 1, energy: 1222},
                {tariff: 1, energy: 1333},
                {tariff: 1, energy: 1444},
                {tariff: 1, energy: 1555},
                {tariff: 1, energy: 1666},
                {tariff: 1, energy: 1777},
                {tariff: 1, energy: 1888},
                {tariff: 1, energy: 1999},
                {tariff: 1, energy: 2000},
                {tariff: 1, energy: 2111},
                {tariff: 1, energy: 2222},
                {tariff: 1, energy: 2333},
                {tariff: 1, energy: 2444},
                {tariff: 1, energy: 2555},
                {tariff: 1, energy: 2666},
                {tariff: 1, energy: 2777},
                {tariff: 1, energy: 2888},
                {tariff: 1, energy: 2999},
                {tariff: 1, energy: 3000},
                {tariff: 1, energy: 3111},
                {tariff: 1, energy: 3222},
                {tariff: 1, energy: 3333},
                {tariff: 1, energy: 3444},
                {tariff: 1, energy: 3555},
                {tariff: 1, energy: 3666},
                {tariff: 1, energy: 3777},
                {tariff: 1, energy: 3888},
                {tariff: 1, energy: 3999},
                {tariff: 1, energy: 4000},
                {tariff: 1, energy: 4111},
                {tariff: 1, energy: 4222},
                {tariff: 1, energy: 4333},
                {tariff: 1, energy: 4444},
                {tariff: 1, energy: 4555},
                {tariff: 1, energy: 4666},
                {tariff: 1, energy: 4777},
                {tariff: 1, energy: 4888},
                {tariff: 1, energy: 4999},
                {tariff: 1, energy: 5000},
                {tariff: 1, energy: 5222},
                {tariff: 1, energy: 5333},
                {tariff: 1, energy: 5444},
                {tariff: 1, energy: 5555},
                {tariff: 1, energy: 5666},
                {tariff: 1, energy: 5777},
                {tariff: 1, energy: 5888},
                {tariff: 1, energy: 5999}
            ]
        },
        hex: {
            header: '15 63',
            body: `18 03 16 44 57 44 c6 45 35 45 a4 46 13 46 82 46 f1 47 60 47 cf
                   47 d0 48 3f 48 ae 49 1d 49 8c 49 fb 4a 6a 4a d9 4b 48 4b b7 4b
                   b8 4c 27 4c 96 4d 05 4d 74 4d e3 4e 52 4e c1 4f 30 4f 9f 4f a0
                   50 0f 50 7e 50 ed 51 5c 51 cb 52 3a 52 a9 53 18 53 87 53 88 54
                   66 54 d5 55 44 55 b3 56 22 56 91 57 00 57 6f`
        }
    },
    {
        name: 'empty/invalid data',
        parameters: {
            date: {
                year: 22,
                month: 6,
                date: 18
            },
            periods: [
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined}
            ]
        },
        hex: {
            header: '15 63',
            body: `16 06 12 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
                   ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
                   ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
                   ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
                   ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff`
        }
    },
    {
        name: 'response for day when DST start/end',
        parameters: {
            date: {
                year: 24,
                month: 2,
                date: 31
            },
            periods: [
                {tariff: 1, energy: 1111},
                {tariff: 1, energy: 1222},
                {tariff: 1, energy: 1333},
                {tariff: 1, energy: 1444},
                {tariff: 1, energy: 1555},
                {tariff: 1, energy: 1666},
                {tariff: 1, energy: 1777},
                {tariff: 1, energy: 1888},
                {tariff: 1, energy: 1999},
                {tariff: 1, energy: 2000},
                {tariff: 1, energy: 2111},
                {tariff: 1, energy: 2222},
                {tariff: 1, energy: 2333},
                {tariff: 1, energy: 2444},
                {tariff: 1, energy: 2555},
                {tariff: 1, energy: 2666},
                {tariff: 1, energy: 2777},
                {tariff: 1, energy: 2888},
                {tariff: 1, energy: 2999},
                {tariff: 1, energy: 3000},
                {tariff: 1, energy: 3111},
                {tariff: 1, energy: 3222},
                {tariff: 1, energy: 3333},
                {tariff: 1, energy: 3444},
                {tariff: 1, energy: 3555},
                {tariff: 1, energy: 3666},
                {tariff: 1, energy: 3777},
                {tariff: 1, energy: 3888},
                {tariff: 1, energy: 3999},
                {tariff: 1, energy: 4000},
                {tariff: 1, energy: 4111},
                {tariff: 1, energy: 4222},
                {tariff: 1, energy: 4333},
                {tariff: 1, energy: 4444},
                {tariff: 1, energy: 4555},
                {tariff: 1, energy: 4666},
                {tariff: 1, energy: 4777},
                {tariff: 1, energy: 4888},
                {tariff: 1, energy: 4999},
                {tariff: 1, energy: 5000},
                {tariff: 1, energy: 5222},
                {tariff: 1, energy: 5333},
                {tariff: 1, energy: 5444},
                {tariff: 1, energy: 5555},
                {tariff: 1, energy: 5666},
                {tariff: 1, energy: 5777},
                {tariff: 1, energy: 5888},
                {tariff: 1, energy: 5999},
                {tariff: 1, energy: 6000},
                {tariff: 1, energy: 6111}
            ],
            dst: 3
        },
        hex: {
            header: '15 68',
            body: `18 02 1f 44 57 44 c6 45 35 45 a4 46 13 46 82 46 f1 47 60 47 cf
                   47 d0 48 3f 48 ae 49 1d 49 8c 49 fb 4a 6a 4a d9 4b 48 4b b7 4b
                   b8 4c 27 4c 96 4d 05 4d 74 4d e3 4e 52 4e c1 4f 30 4f 9f 4f a0
                   50 0f 50 7e 50 ed 51 5c 51 cb 52 3a 52 a9 53 18 53 87 53 88 54
                   66 54 d5 55 44 55 b3 56 22 56 91 57 00 57 6f 57 70 57 df 03`
        }
    }
];


/**
 * Uplink command to get active energy for a previous day by 4 tariffs (T1-T4).
 *
 * The corresponding downlink command: `GetHalfHours`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetHalfHoursResponse from 'jooby-codec/obis-observer/commands/uplink/GetHalfHoursResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x18, 0x03, 0x16, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46,
 *     0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49,
 *     0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d,
 *     0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50,
 *     0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53,
 *     0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57,
 *     0x00, 0x57, 0x6f
 * ]);
 * const command = GetHalfHoursResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     },
 *     periods: [
 *         {tariff: 1, energy: 1111},
 *         {tariff: 1, energy: 1222},
 *         {tariff: 1, energy: 1333},
 *         {tariff: 1, energy: 1444},
 *         {tariff: 1, energy: 1555},
 *         {tariff: 1, energy: 1666},
 *         {tariff: 1, energy: 1777},
 *         {tariff: 1, energy: 1888},
 *         {tariff: 1, energy: 1999},
 *         {tariff: 1, energy: 2000},
 *         {tariff: 1, energy: 2111},
 *         {tariff: 1, energy: 2222},
 *         {tariff: 1, energy: 2333},
 *         {tariff: 1, energy: 2444},
 *         {tariff: 1, energy: 2555},
 *         {tariff: 1, energy: 2666},
 *         {tariff: 1, energy: 2777},
 *         {tariff: 1, energy: 2888},
 *         {tariff: 1, energy: 2999},
 *         {tariff: 1, energy: 3000},
 *         {tariff: 1, energy: 3111},
 *         {tariff: 1, energy: 3222},
 *         {tariff: 1, energy: 3333},
 *         {tariff: 1, energy: 3444},
 *         {tariff: 1, energy: 3555},
 *         {tariff: 1, energy: 3666},
 *         {tariff: 1, energy: 3777},
 *         {tariff: 1, energy: 3888},
 *         {tariff: 1, energy: 3999},
 *         {tariff: 1, energy: 4000},
 *         {tariff: 1, energy: 4111},
 *         {tariff: 1, energy: 4222},
 *         {tariff: 1, energy: 4333},
 *         {tariff: 1, energy: 4444},
 *         {tariff: 1, energy: 4555},
 *         {tariff: 1, energy: 4666},
 *         {tariff: 1, energy: 4777},
 *         {tariff: 1, energy: 4888},
 *         {tariff: 1, energy: 4999},
 *         {tariff: 1, energy: 5000},
 *         {tariff: 1, energy: 5222},
 *         {tariff: 1, energy: 5333},
 *         {tariff: 1, energy: 5444},
 *         {tariff: 1, energy: 5555},
 *         {tariff: 1, energy: 5666},
 *         {tariff: 1, energy: 5777},
 *         {tariff: 1, energy: 5888},
 *         {tariff: 1, energy: 5999}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetHalfHours.md#response)
 */
class GetHalfHoursResponse extends Command {
    constructor ( public parameters: IGetHalfHoursResponseParameters ) {
        super();

        if ( parameters.periods.length > MIN_PERIODS ) {
            this.size = MAX_COMMAND_SIZE;
        } else {
            this.size = MIN_COMMAND_SIZE;
        }
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = MAX_COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const hasDst = data.byteLength > MIN_COMMAND_SIZE;
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const periods = buffer.getEnergyPeriods(hasDst ? MAX_PERIODS : MIN_PERIODS);

        if ( hasDst ) {
            const dst = buffer.getUint8();

            return new GetHalfHoursResponse({
                date,
                periods,
                dst
            });
        }

        return new GetHalfHoursResponse({
            date,
            periods
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + this.size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setDate(parameters.date);
        buffer.setEnergyPeriods(parameters.periods);

        if ( parameters.dst ) {
            buffer.setUint8(parameters.dst);
        }

        return buffer.toUint8Array();
    }
}


export default GetHalfHoursResponse;
