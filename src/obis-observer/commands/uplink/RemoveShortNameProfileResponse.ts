import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * IRemoveShortNameProfileResponseParameters command parameters
 */
interface IRemoveShortNameProfileResponseParameters {
    shortName: number,
    resultCode: number
}


const COMMAND_ID = 0x08;
const COMMAND_SIZE = 2;

const examples: TCommandExampleList = [
    {
        name: 'remove short name profile - not found',
        parameters: {
            shortName: 28,
            resultCode: resultCodes.PROFILE_NOT_FOUND
        },
        hex: {header: '08', body: '1c 04'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import RemoveShortNameProfileResponse from 'jooby-codec/obis-observer/commands/uplink/RemoveShortNameProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x1c, 0x04]);
 * const command = RemoveShortNameProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     shortName: 28,
 *     resultCode: 4
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveShortNameProfileResponse.md#request)
 */
class RemoveShortNameProfileResponse extends Command {
    constructor ( public parameters: IRemoveShortNameProfileResponseParameters ) {
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

        return new RemoveShortNameProfileResponse({shortName: buffer.getUint8(), resultCode: buffer.getUint8()});
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


export default RemoveShortNameProfileResponse;
