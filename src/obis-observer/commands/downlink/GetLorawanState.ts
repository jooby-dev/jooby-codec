import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x24;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            requestId: 8
        },
        hex: {header: '24', body: '08'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetLorawanState from 'jooby-codec/obis-observer/commands/downlink/GetLorawanState.js';
 *
 * const parameters = {
 *     requestId: 8
 * };
 * const command = new GetLorawanState(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 24 01 08
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetLorawanState.md#request)
 */
class GetLorawanState extends Command {
    constructor ( public parameters: ICommandParameters ) {
        super();

        this.size = REQUEST_ID_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetLorawanState({requestId: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId} = this.parameters;

        buffer.setUint8(requestId);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetLorawanState;
