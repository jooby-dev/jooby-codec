import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * IAddShortNameProfileResponseParameters command parameters
 */
interface IAddShortNameProfileResponseParameters {
    shortName: number,
    resultCode: number
}


const COMMAND_ID = 0x03;
const COMMAND_SIZE = 2;

const examples: TCommandExampleList = [
    {
        name: 'add short name profile - succeed',
        parameters: {
            shortName: 32,
            resultCode: resultCodes.OK
        },
        hex: {header: '03', body: '20 00'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import AddShortNameProfileResponse from 'jooby-codec/obis-observer/commands/downlink/AddShortNameProfileResponse.js';
 *
 * const parameters = {
 *      shortName: 32,
 *      resultCode: resultCodes.OK
 * };
 * const command = new AddShortNameProfileResponse(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 03 20 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/AddShortNameProfileResponse.md#request)
 */
class AddShortNameProfileResponse extends Command {
    constructor ( public parameters: IAddShortNameProfileResponseParameters ) {
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

        return new AddShortNameProfileResponse({shortName: buffer.getUint8(), resultCode: buffer.getUint8()});
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


export default AddShortNameProfileResponse;
