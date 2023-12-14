import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer, {IRequestParameter} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import * as deviceParameters from '../../constants/deviceParameters.js';


const COMMAND_ID = 0x04;

const examples: TCommandExampleList = [
    {
        name: 'request absolute data (not multichannel device)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA,
            data: null
        },
        hex: {header: '04 01', body: '17'}
    },
    {
        name: 'request for state of absolute data (not multichannel device)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_ENABLE,
            data: null
        },
        hex: {header: '04 01', body: '18'}
    },
    {
        name: 'request for state of absolute for multichannel device (1 channel)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL,
            data: {channel: 1}
        },
        hex: {header: '04 02', body: '1d 00'}
    },
    {
        name: 'request for state of absolute data for multichannel device (1 channel)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL,
            data: {channel: 1}
        },
        hex: {header: '04 02', body: '1e 00'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import {constants} from 'jooby-codec';
 * import GetParameter from 'jooby-codec/analog/commands/downlink/GetParameter.js';
 *
 * const command = new GetParameter({id: constants.deviceParameters.ABSOLUTE_DATA});
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 04 01 17
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetParameter.md#request)
 */
class GetParameter extends Command {
    constructor ( public parameters: IRequestParameter ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetParameter(buffer.getRequestParameter());
    }

    toBinary (): ICommandBinary {
        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getRequestParameterSize(this.parameters));

        buffer.setRequestParameter(this.parameters);

        return Command.toBinary(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetParameter;
