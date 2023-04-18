import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directionTypes.js';
import * as deviceParameters from '../../constants/deviceParameters.js';


/**
 * GetParameter command parameters
 *
 * @example
 * import {constants} from 'jooby-codec';
 * {id: constants.deviceParameters.INITIAL_DATA}
 */
interface IDownlinkGetParameterParameters {
    /**
     * Parameter id - one of `constants/deviceParameters`.
     */
    id: number
}


const COMMAND_ID = 0x04;
const COMMAND_TITLE = 'GET_PARAMETER';
const COMMAND_BODY_SIZE = 1;

const examples: TCommandExampleList = [
    {
        name: 'request initial data from device',
        parameters: {id: deviceParameters.INITIAL_DATA},
        hex: {
            header: '04 01',
            body: '17'
        }
    },
    {
        name: 'request status of data type sending, absolute or another',
        parameters: {id: deviceParameters.ABSOLUTE_DATA_STATUS},
        hex: {
            header: '04 01',
            body: '18'
        }
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import {constants} from 'jooby-codec';
 * import GetParameter from 'jooby-codec/commands/downlink/GetParameter';
 *
 * const command = new GetParameter({id: constants.deviceParameters.INITIAL_DATA});
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 04 01 17
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetParameter.md#request)
 */
class GetParameter extends Command {
    constructor ( public parameters: IDownlinkGetParameterParameters ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly title = COMMAND_TITLE;

    static readonly examples = examples;

    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetParameter({id: buffer.getUint8()});
    }

    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

        buffer.setUint8(this.parameters.id);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetParameter;
