import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IObisValueString, DATE_TIME_SIZE} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * IObservationReportStringParameters command parameters
 */
interface IObservationReportStringParameters {
    /** number of seconds that have elapsed since the year 2000 */
    time2000: TTime2000,
    obisValueList: Array<IObisValueString>
}


const COMMAND_ID = 0x52;

const examples: TCommandExampleList = [
    {
        name: 'get observation report from 2023.12.23 00:00:00 GMT',
        parameters: {
            time2000: 756604800,
            obisValueList: [
                {code: 50, content: 'reactive power QI, average'},
                {code: 56, content: 'reactive power QI, total'}
            ]
        },
        hex: {
            header: '52',
            body: '2d 18 df 80 32 1a 72 65 61 63 74 69 76 65 20 70 6f 77 65'
                + ' 72 20 51 49 2c 20 61 76 65 72 61 67 65 38 18 72 65 61 63 74 69 76'
                + ' 65 20 70 6f 77 65 72 20 51 49 2c 20 74 6f 74 61 6c'
        }
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ObservationReportString from 'jooby-codec/obis-observer/commands/uplink/ObservationReportString.js';
 *
 * const commandBody = new Uint8Array([
 *     0x2d, 0x18, 0xdf, 0x80, 0x32, 0x1a, 0x72, 0x65, 0x61, 0x63, 0x74, 0x69,
 *     0x76, 0x65, 0x20, 0x70, 0x6f, 0x77, 0x65, 0x72, 0x20, 0x51, 0x49, 0x2c, 0x20,
 *     0x61, 0x76, 0x65, 0x72, 0x61, 0x67, 0x65, 0x38, 0x18, 0x72, 0x65, 0x61, 0x63,
 *     0x74, 0x69, 0x76, 0x65, 0x20, 0x70, 0x6f, 0x77, 0x65, 0x72, 0x20, 0x51, 0x49,
 *     0x2c, 0x20, 0x74, 0x6f, 0x74, 0x61, 0x6c
 * ]);
 * const command = ObservationReportString.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     time2000: 756604800,
 *     obisValueList: [
 *         {code: 50, content: 'reactive power QI, average'},
 *         {code: 56, content: 'reactive power QI, total'}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/uplink/ObservationReport.md#event-with-string-content)
 */
class ObservationReportString extends Command {
    constructor ( public parameters: IObservationReportStringParameters ) {
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
            const obisValue = buffer.getObisValueString();

            size -= CommandBinaryBuffer.getObisContentSize(obisValue);
            obisValueList.push(obisValue);
        }

        return new ObservationReportString({time2000, obisValueList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {time2000, obisValueList} = this.parameters;

        buffer.setUint32(time2000);
        obisValueList.forEach(obisValue => buffer.setObisValueString(obisValue));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ObservationReportString;
