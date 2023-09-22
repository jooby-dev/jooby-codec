import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * ISetLorawanActivationMethodParameters command parameters
 */
interface ISetLorawanActivationMethodParameters extends ICommandParameters {
    activationMethod: number
}


const COMMAND_ID = 0x24;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'set lorawan activation mode to ABP',
        parameters: {
            requestId: 3,
            activationMethod: 1
        },
        hex: {header: '24 02', body: '03 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetLorawanActivationMethod from 'jooby-codec/obis-observer/commands/downlink/SetLorawanActivationMethod.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     activationMethod: 1
 * };
 * const command = new SetLorawanActivationMethod(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 24 02 03 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetLorawanActivationMethod.md#request)
 */
class SetLorawanActivationMethod extends Command {
    constructor ( public parameters: ISetLorawanActivationMethodParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, activationMethod]: Uint8Array ) {
        return new SetLorawanActivationMethod({requestId, activationMethod});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array(
                [this.parameters.requestId, this.parameters.activationMethod]
            )
        );
    }
}


export default SetLorawanActivationMethod;
