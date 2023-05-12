import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IShortNameString, DATE_TIME_SIZE} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IObservationReportStrParameters command parameters
 */
interface IObservationReportStrParameters {
    /** number of seconds that have elapsed since the year 2000 */
    dateTime: number,
    shortNameList: Array<IShortNameString>
}


const COMMAND_ID = 0x0e;

const examples: TCommandExampleList = [
    {
        name: 'get observation report from 2023-12-22 23:40:00 GMT',
        parameters: {
            dateTime: 756604800,
            shortNameList: [
                {
                    code: 50,
                    content: 'reactive power QI, average'
                },
                {
                    code: 56,
                    content: 'reactive power QI, total'
                }
            ]
        },
        hex: {
            header: '0e',
            body: '3b 80 df 18 2d 32 1a 72 65 61 63 74 69 76 65 20 70 6f 77 65 72 20 51 49 2c 20 61 76 65'
                + '72 61 67 65 38 18 72 65 61 63 74 69 76 65 20 70 6f 77 65 72 20 51 49 2c 20 74 6f 74 61 6c'
        }
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ObservationReportStr from 'jooby-codec/obis-observer/commands/uplink/ObservationReportStr.js';
 *
 * const commandBody = new Uint8Array([
 *     0x3b, 0x80, 0xdf, 0x18, 0x2d, 0x32, 0x1a, 0x72, 0x65, 0x61, 0x63, 0x74, 0x69,
 *     0x76, 0x65, 0x20, 0x70, 0x6f, 0x77, 0x65, 0x72, 0x20, 0x51, 0x49, 0x2c, 0x20,
 *     0x61, 0x76, 0x65, 0x72, 0x61, 0x67, 0x65, 0x38, 0x18, 0x72, 0x65, 0x61, 0x63,
 *     0x74, 0x69, 0x76, 0x65, 0x20, 0x70, 0x6f, 0x77, 0x65, 0x72, 0x20, 0x51, 0x49,
 *     0x2c, 0x20, 0x74, 0x6f, 0x74, 0x61, 0x6c
 * ]);
 * const command = ObservationReportStr.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     dateTime: 756604800,
 *     shortNameList: [
 *         {
 *             code: 50,
 *             content: 'reactive power QI, average'
 *         },
 *         {
 *             code: 56,
 *             content: 'reactive power QI, total'
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/uplink/ObservationReportStr.md)
 */
class ObservationReportStr extends Command {
    constructor ( public parameters: IObservationReportStrParameters ) {
        super();

        let size = DATE_TIME_SIZE + 1;

        this.parameters.shortNameList.forEach(shortName => {
            size += CommandBinaryBuffer.getShortNameContentSize(shortName);
        });

        this.size = size;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        let size = buffer.getUint8() - DATE_TIME_SIZE - 1;
        const dateTime = buffer.getUint32();
        const shortNameList = [];

        while ( size > 0 ) {
            const shortName = buffer.getShortNameString();

            size -= CommandBinaryBuffer.getShortNameContentSize(shortName);
            shortNameList.push(shortName);
        }

        return new ObservationReportStr({dateTime, shortNameList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {dateTime, shortNameList} = this.parameters;

        buffer.setUint8(this.size);
        buffer.setUint32(dateTime);
        shortNameList.forEach(shortName => buffer.setShortNameString(shortName));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ObservationReportStr;
