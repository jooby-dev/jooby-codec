import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * ISetObserverSingleModeParameters command parameters
 */
interface ISetObserverSingleModeParameters extends ICommandParameters {
    singleMode: boolean
}


const COMMAND_ID = 0x0b;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'set observer single mode',
        parameters: {
            requestId: 3,
            singleMode: true
        },
        hex: {header: '0b 02', body: '03 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetObserverSingleMode from 'jooby-codec/obis-observer/commands/downlink/SetObserverSingleMode.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     singleMode: true
 * };
 * const command = new SetObserverSingleMode(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0b 02 03 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetObserverSingleMode.md#request)
 */
class SetObserverSingleMode extends Command {
    constructor ( public parameters: ISetObserverSingleModeParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, singleMode]: Uint8Array ) {
        return new SetObserverSingleMode({requestId, singleMode: singleMode !== 0});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters} = this;

        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array(
                [parameters.requestId, parameters.singleMode ? 1 : 0]
            )
        );
    }
}


export default SetObserverSingleMode;
