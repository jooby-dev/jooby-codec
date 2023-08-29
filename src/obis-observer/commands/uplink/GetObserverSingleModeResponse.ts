import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetObserverSingleModeResponseParameters command parameters
 */
interface IGetObserverSingleModeResponseParameters extends ICommandParameters {
    isSingleMode: boolean
}

const COMMAND_ID = 0x0e;

const examples: TCommandExampleList = [
    {
        name: 'response to GetObserverSingleMode',
        parameters: {
            requestId: 7,
            isSingleMode: true
        },
        hex: {header: '0e 02', body: '07 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObserverSingleModeResponse from 'jooby-codec/obis-observer/commands/uplink/GetObserverSingleModeResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x07, 0x01
 * ]);
 * const command = GetObserverSingleModeResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 *     singleMode: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverSingleMode.md#response)
 */
class GetObserverSingleModeResponse extends Command {
    constructor ( public parameters: IGetObserverSingleModeResponseParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 4;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, isSingleMode]: Uint8Array ) {
        return new GetObserverSingleModeResponse({requestId, isSingleMode: isSingleMode !== 0});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.isSingleMode ? 1 : 0])
        );
    }
}


export default GetObserverSingleModeResponse;
