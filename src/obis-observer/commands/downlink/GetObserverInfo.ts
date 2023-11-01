import Command, {TCommandExampleList} from '../../Command.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x01;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            requestId: 7
        },
        hex: {header: '01 01', body: '07'}
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
 * // 01 01 07
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
    static fromBytes ( [requestId]: Uint8Array ) {
        return new GetObserverInfo({requestId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId])
        );
    }
}


export default GetObserverInfo;
