import Command, {TCommandExampleList} from '../../Command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../constants/directions.js';


interface IGetDeviceIdResponseParameters {
    id: Array<number>
}


const COMMAND_ID = 0x05;
const COMMAND_SIZE = 8;

const examples: TCommandExampleList = [
    {
        name: 'mode with order',
        parameters: {
            id: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        hex: {header: '05 08', body: '01 02 03 04 05 06 07 08'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetDeviceIdResponse from 'jooby-codec/obis-observer/commands/uplink/GetDeviceIdResponse.js';
 *
 * const commandBody = new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
 * const command = GetDeviceIdResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     id: [1, 2, 3, 4, 5, 6, 7, 8]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetDeviceIdResponse.md)
 */
class GetDeviceIdResponse extends Command {
    constructor ( public parameters: IGetDeviceIdResponseParameters ) {
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
        if ( data?.length !== COMMAND_SIZE ) {
            throw new Error('Invalid GetDeviceIdResponse data size.');
        }

        const [...id] = data;

        return new GetDeviceIdResponse({id});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;

        return new Uint8Array([
            COMMAND_ID,
            size,
            ...parameters.id
        ]);
    }
}


export default GetDeviceIdResponse;
