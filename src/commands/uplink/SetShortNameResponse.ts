import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * ISetShortNameResponseParameters command parameters
 */
interface ISetShortNameResponseParameters {
    shortName: number,
    resultCode: number
}


const COMMAND_ID = 0x02;
const COMMAND_SIZE = 2;

const examples: TCommandExampleList = [
    {
        name: 'set short name - succeed',
        parameters: {
            shortName: 44,
            resultCode: resultCodes.OK
        },
        hex: {header: '02', body: '2c 00'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetShortNameResponse from 'jooby-codec/obis-observer/commands/downlink/SetShortNameResponse.js';
 *
 * const parameters = {
 *      shortName: 32,
 *      resultCode: resultCodes.OK
 * };
 * const command = new SetShortNameResponse(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 02 2c 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetShortNameResponse.md#request)
 */
class SetShortNameResponse extends Command {
    constructor ( public parameters: ISetShortNameResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

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
