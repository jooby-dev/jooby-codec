import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {DATE_TIME_SIZE, IObisValueFloat} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * IObservationReportParameters command parameters
 */
interface IObservationReportParameters {
    /** number of seconds that have elapsed since the year 2000 */
    time2000: TTime2000,
    obisValueList: Array<IObisValueFloat>
}


const COMMAND_ID = 0x51;

const examples: TCommandExampleList = [
    {
        name: 'observation report from 2023.12.23 00:00:00 GMT',
        parameters: {
            time2000: 756604800,
            obisValueList: [
                {code: 50, content: 34.33},
                {code: 56, content: 45.33}
            ]
        },
        hex: {header: '51 0e', body: '2d 18 df 80 32 42 09 51 ec 38 42 35 51 ec'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ObservationReport from 'jooby-codec/obis-observer/commands/uplink/ObservationReport.js';
 *
 * const commandBody = new Uint8Array([0x2d, 0x18, 0xdf, 0x80, 0x32, 0x42, 0x09, 0x51, 0xec, 0x38, 0x42, 0x35, 0x51, 0xec]);
 * const command = ObservationReport.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     time2000: 756604800,
 *     obisValueList: [
 *         {code: 50, content: 45.33},
 *         {code: 56, content: 34.33}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/uplink/ObservationReport.md#event-with-float-content)
 */
class ObservationReport extends Command {
    constructor ( public parameters: IObservationReportParameters ) {
        super();

        let size = DATE_TIME_SIZE;

        this.parameters.obisValueList.forEach(obisValue => {
            size += CommandBinaryBuffer.getObisContentSize(obisValue);
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

        let size = data.length - DATE_TIME_SIZE;
        const time2000 = buffer.getUint32();
        const obisValueList = [];

        while ( size > 0 ) {
            const obisValue = buffer.getObisValueFloat();

            size -= CommandBinaryBuffer.getObisContentSize(obisValue);
            obisValueList.push(obisValue);
        }

        return new ObservationReport({time2000, obisValueList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {time2000, obisValueList} = this.parameters;

        buffer.setUint32(time2000);
        obisValueList.forEach(obisValue => buffer.setObisValueFloat(obisValue));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ObservationReport;
