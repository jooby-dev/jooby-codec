import Command, {TCommandExampleList} from '../../Command.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x13;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            requestId: 8
        },
        hex: {header: '13', body: '08'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetLorawanInfo from 'jooby-codec/obis-observer/commands/downlink/GetLorawanInfo.js';
 *
 * const parameters = {
 *     requestId: 8
 * };
 * const command = new GetLorawanInfo(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 13 01 08
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetLorawanInfo.md#request)
 */
class GetLorawanInfo extends Command {
    constructor ( public parameters: ICommandParameters ) {
        super();

        this.size = REQUEST_ID_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId]: Uint8Array ) {
        return new GetLorawanInfo({requestId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId])
        );
    }
}


export default GetLorawanInfo;
