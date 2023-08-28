import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IRemoveMeterParameters command parameters
 */
interface IRemoveMeterParameters extends ICommandParameters {
    meterId: number
}


const COMMAND_ID = 0x72;
const COMMAND_SIZE = 1 + REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'add meter profile with Id 17',
        parameters: {
            requestId: 3,
            meterId: 17
        },
        hex: {header: '72 02', body: '03 11'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import RemoveMeter from 'jooby-codec/obis-observer/commands/downlink/RemoveMeter.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterId: 17
 * };
 * const command = new RemoveMeter(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 72 02 03 11
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveMeter.md#request)
 */
class RemoveMeter extends Command {
    constructor ( public parameters: IRemoveMeterParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterId]: Uint8Array ) {
        return new RemoveMeter({requestId, meterId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.meterId])
        );
    }
}


export default RemoveMeter;
