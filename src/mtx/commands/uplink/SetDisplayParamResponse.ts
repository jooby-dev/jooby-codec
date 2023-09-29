import Command, {TCommandExampleList} from '../../Command.js';
//import CommandBinaryBuffer, {ILegacyCounter} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


const COMMAND_ID = 0x5d;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        hex: {header: '5d 00', body: ''}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetDisplayParamResponse from 'jooby-codec/mtx/commands/uplink/SetDisplayParamResponse.js';
 *
 * const command = SetDisplayParamResponse.fromBytes();
 *
 * console.log(command.parameters);
 * // output:
 * undefined
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/TurnRelayOn.md#response)
 */
class SetDisplayParamResponse extends Command {
    constructor () {
        super();

        this.size = COMMAND_SIZE;
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;

    static readonly accessLevel = READ_WRITE;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes (): SetDisplayParamResponse {
        return new SetDisplayParamResponse();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default SetDisplayParamResponse;
