import Command, {TCommandExampleList} from '../../Command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';
import {IDate} from '../../../types.js';


interface IGetBuildVersionResponseParameters {
    /**
     * firmware build date
     */
    date: IDate,

    /**
     * firmware build version
     */
    version: string
}


const COMMAND_ID = 0x70;
const COMMAND_SIZE = 6;

const examples: TCommandExampleList = [
    {
        name: '2021.09.16/0.0.9',
        parameters: {
            date: {
                date: 16,
                month: 9,
                year: 21
            },
            version: '0.0.9'
        },
        hex: {header: '70 06', body: '10 09 15 00 00 09'}
    }
];


/**
 * Uplink command to get firmware build date and version from device.
 *
 * The corresponding downlink command: `GetBuildVersion`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetBuildVersionResponse from 'jooby-codec/obis-observer/commands/uplink/GetBuildVersionResponse.js';
 *
 * const commandBody = new Uint8Array([0x10, 0x09, 0x15, 0x00, 0x00, 0x09]);
 * const command = GetBuildVersionResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output for 2021.09.16/0.0.9:
 * {
 *     date: {
 *         date: 16,
 *         month: 9,
 *         year: 21
 *     },
 *     version: '0.0.9'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetBuildVersion.md#response)
 */
class GetBuildVersionResponse extends Command {
    constructor ( public parameters: IGetBuildVersionResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const [date, month, year, n3, n2, n1] = data;

        return new GetBuildVersionResponse({
            date: {
                date,
                month,
                year
            },
            version: `${n3}.${n2}.${n1}`
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const version = parameters.version.split('.').map(part => parseInt(part, 10));

        return new Uint8Array([
            COMMAND_ID,
            size,
            parameters.date.date,
            parameters.date.month,
            parameters.date.year,
            ...version
        ]);
    }
}


export default GetBuildVersionResponse;
