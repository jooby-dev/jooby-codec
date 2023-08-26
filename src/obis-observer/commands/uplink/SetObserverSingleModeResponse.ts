import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * ISetObserverSingleModeResponseParameters command parameters
 */
interface ISetObserverSingleModeResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x0c;
const COMMAND_SIZE = 1 + REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'set observer single mode - succeed',
        parameters: {
            requestId: 7,
            resultCode: resultCodes.OK
        },
        hex: {header: '0c', body: '07 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetObserverSingleModeResponse from 'jooby-codec/obis-observer/commands/uplink/SetObserverSingleModeResponse.js';
 *
 * const commandBody = new Uint8Array([0x07, 0x00]);
 * const command = SetObserverSingleModeResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetObserverSingleMode.md#response)
 */
class SetObserverSingleModeResponse extends Command {
    constructor ( public parameters: ISetObserverSingleModeResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetObserverSingleModeResponse({
            requestId: buffer.getUint8(),
            resultCode: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array(
                [this.parameters.requestId, this.parameters.resultCode]
            )
        );
    }
}


export default SetObserverSingleModeResponse;
