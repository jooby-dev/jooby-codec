import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ILegacyCounter} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x07;
const COMMAND_BODY_MAX_SIZE = 4;

const examples: TCommandExampleList = [
    {
        name: 'simple response channels',
        parameters: {isMagneticInfluence: true, value: 342},
        hex: {header: '07 04', body: '80 00 01 56'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import Current from 'jooby-codec/analog/commands/uplink/Current.js';
 *
 * const commandBody = new Uint8Array([0x80, 0x00, 0x01, 0x56]);
 * const command = Current.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     isMagneticInfluence: true,
 *     value: 342
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetCurrent.md#response)
 */
class Current extends Command {
    constructor ( public parameters: ILegacyCounter ) {
        super();
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): Current {
        const buffer = new CommandBinaryBuffer(data);

        return new Current(buffer.getLegacyCounter());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);

        buffer.setLegacyCounter(this.parameters);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default Current;
