import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {DATE_TIME_SIZE, IShortNameFloat} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IObservationReportParameters command parameters
 */
interface IObservationReportParameters {
    /** number of seconds that have elapsed since the year 2000 */
    time: number,
    shortNameList: Array<IShortNameFloat>
}


const COMMAND_ID = 0x1a;

const examples: TCommandExampleList = [
    {
        name: 'get observation report from 2023-12-22 23:40:00 GMT',
        parameters: {
            time: 756604800,
            shortNameList: [
                {code: 50, content: 34.33},
                {code: 56, content: 45.33}
            ]
        },
        hex: {
            header: '1a',
            body: '0e 2d 18 df 80 32 42 09 51 ec 38 42 35 51 ec'
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
 * const commandBody = new Uint8Array([0x0e, 0x2d, 0x18, 0xdf, 0x80, 0x32, 0x42, 0x09, 0x51, 0xec, 0x38, 0x42, 0x35, 0x51, 0xec]);
 * const command = ObservationReport.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     time: 756604800,
 *     shortNameList: [
 *         {code: 50, content: 45.33},
 *         {code: 56, content: 34.33}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/uplink/ObservationReport.md)
 */
class ObservationReport extends Command {
    constructor ( public parameters: IObservationReportParameters ) {
        super();

        // real size - 1 size byte + others
        let size = 1 + DATE_TIME_SIZE;

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

        let size = buffer.getUint8() - DATE_TIME_SIZE;
        const time = buffer.getUint32();
        const shortNameList = [];

        while ( size > 0 ) {
            const shortName = buffer.getShortNameFloat();

            size -= CommandBinaryBuffer.getShortNameContentSize(shortName);
            shortNameList.push(shortName);
        }

        return new ObservationReport({time, shortNameList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {time, shortNameList} = this.parameters;

        // subtract size byte
        buffer.setUint8(this.size - 1);
        buffer.setUint32(time);
        shortNameList.forEach(shortName => buffer.setShortNameFloat(shortName));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ObservationReport;
