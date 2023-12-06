import Command, {TCommandExampleList} from '../../Command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


interface IGetVersionResponseParameters {
    version: string
}


const COMMAND_ID = 0x28;
const COMMAND_SIZE = 10;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            version: '104.25.003'
        },
        hex: {header: '28 0a', body: '31 30 34 2e 32 35 2e 30 30 33'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetVersionResponse from 'jooby-codec/obis-observer/commands/uplink/GetVersionResponse.js';
 *
 * const commandBody = new Uint8Array([0x31, 0x30, 0x34, 0x2e, 0x32, 0x35, 0x2e, 0x30, 0x30, 0x33]);
 * const command = GetVersionResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     version: '104.25.003'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetVersion.md#response)
 */
class GetVersionResponse extends Command {
    constructor ( public parameters: IGetVersionResponseParameters ) {
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
        return new GetVersionResponse({
            version: String.fromCharCode.apply(null, [...data])
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const version = parameters.version.split('').map(char => char.charCodeAt(0));

        return new Uint8Array([
            COMMAND_ID,
            size,
            ...version
        ]);
    }
}


export default GetVersionResponse;
