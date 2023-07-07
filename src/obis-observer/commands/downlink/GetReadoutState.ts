import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x26;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            requestId: 8
        },
        hex: {header: '26', body: '08'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetReadoutState from 'jooby-codec/obis-observer/commands/downlink/GetReadoutState.js';
 *
 * const parameters = {
 *     requestId: 8
 * };
 * const command = new GetReadoutState(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 26 08
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetReadoutState.md#request)
 */
class GetReadoutState extends Command {
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

        return new GetReadoutState({requestId: buffer.getUint8()});
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


export default GetReadoutState;
