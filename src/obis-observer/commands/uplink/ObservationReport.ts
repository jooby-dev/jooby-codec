import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {DATE_TIME_SIZE, IShortNameFloat} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IObservationReportParameters command parameters
 */
interface IObservationReportParameters {
    /** number of seconds that have elapsed since the year 2000 */
    dateTime: number,
    shortNameList: Array<IShortNameFloat>
}


const COMMAND_ID = 0x0b;

const examples: TCommandExampleList = [
    {
        name: 'get observation report from 2023-12-22 23:40:00 GMT',
        parameters: {
            dateTime: 756604800,
            shortNameList: [
                {
                    code: 50,
                    content: 34.33
                },
                {
                    code: 56,
                    content: 45.33
                }
            ]
        },
        hex: {
            header: '0b',
            body: '0f 80 df 18 2d 32 ec 51 09 42 38 ec 51 35 42'
        }
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ObservationReport from 'jooby-codec/obis-observer/commands/uplink/ObservationReport.js';
 *
 * const commandBody = new Uint8Array([0x0f, 0x80, 0xdf, 0x18, 0x2d, 0x32, 0xec, 0x51, 0x09, 0x42, 0x38, 0xec, 0x51, 0x35, 0x42]);
 * const command = ObservationReport.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     dateTime: 756604800,
 *     shortNameList: [
 *         {
 *             code: 50,
 *             content: 45.33
 *         },
 *         {
 *             code: 56,
 *             content: 34.33
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/uplink/ObservationReport.md)
 */
class ObservationReport extends Command {
    constructor ( public parameters: IObservationReportParameters ) {
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
            const shortName = buffer.getShortNameFloat();

            size -= CommandBinaryBuffer.getShortNameContentSize(shortName);
            shortNameList.push(shortName);
        }

        return new ObservationReport({dateTime, shortNameList});
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
        shortNameList.forEach(shortName => buffer.setShortNameFloat(shortName));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ObservationReport;
