import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * ISetShortNameResponseParameters command parameters
 */
interface ISetShortNameResponseParameters {
    shortName: number,
    resultCode: number
}


const COMMAND_ID = 0x04;
const COMMAND_SIZE = 2;

const examples: TCommandExampleList = [
    {
        name: 'set short name - succeed',
        parameters: {
            shortName: 44,
            resultCode: resultCodes.OK
        },
        hex: {header: '04', body: '2c 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetShortNameResponse from 'jooby-codec/obis-observer/commands/uplink/SetShortNameResponse.js';
 *
 * const commandBody = new Uint8Array([0x2c, 0x00]);
 * const command = SetShortNameResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     shortName: 32,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetShortName.md#response)
 */
class SetShortNameResponse extends Command {
    constructor ( public parameters: ISetShortNameResponseParameters ) {
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

        return new SetShortNameResponse({shortName: buffer.getUint8(), resultCode: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {shortName, resultCode} = this.parameters;

        buffer.setUint8(shortName);
        buffer.setUint8(resultCode);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetShortNameResponse;
