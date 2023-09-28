import Command, {TCommandExampleList} from '../../Command.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x0d;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            requestId: 7
        },
        hex: {header: '0d 01', body: '07'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetObserverSingleMode from 'jooby-codec/obis-observer/commands/downlink/GetObserverSingleMode.js';
 *
 * const parameters = {
 *     requestId: 7
 * };
 * const command = new GetObserverSingleMode(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0d 01 07
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverSingleMode.md#request)
 */
class GetObserverSingleMode extends Command {
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
        return new GetObserverSingleMode({requestId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId])
        );
    }
}


export default GetObserverSingleMode;
