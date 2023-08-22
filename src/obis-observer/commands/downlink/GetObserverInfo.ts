import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x20;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            requestId: 7
        },
        hex: {header: '20', body: '07'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetObserverInfo from 'jooby-codec/obis-observer/commands/downlink/GetObserverInfo.js';
 *
 * const parameters = {
 *     requestId: 7
 * };
 * const command = new GetObserverInfo(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 20 01 07
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverInfo.md#request)
 */
class GetObserverInfo extends Command {
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

        return new GetObserverInfo({requestId: buffer.getUint8()});
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


export default GetObserverInfo;
