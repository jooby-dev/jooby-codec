import Command, {TCommandExampleList} from '../../Command.js';
//import CommandBinaryBuffer, {ILegacyCounter} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x18;
const COMMAND_SIZE = 0;
//const COMMAND_BODY_MAX_SIZE = 4;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        //parameters: {isMagneticInfluence: true, value: 342},
        hex: {header: '18 00', body: ''}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import TurnRelayOnResponse from 'jooby-codec/mtx/commands/uplink/TurnRelayOnResponse.js';
 *
 * const commandBody = new Uint8Array([0x80, 0x00, 0x01, 0x56]);
 * const command = TurnRelayOnResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     isMagneticInfluence: true,
 *     value: 342
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/TurnRelayOn.md#response)
 */
class TurnRelayOnResponse extends Command {
    constructor () {
        super();

        this.size = COMMAND_SIZE;
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes (): TurnRelayOnResponse {
        return new TurnRelayOnResponse();
    }

    // returns full message - header with body
    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default TurnRelayOnResponse;
