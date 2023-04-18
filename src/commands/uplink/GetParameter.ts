import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IParameter} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directionTypes.js';
import * as deviceParameters from '../../constants/deviceParameters.js';


const COMMAND_ID = 0x04;
const COMMAND_TITLE = 'GET_PARAMETER';

const examples: TCommandExampleList = [
    {
        name: 'initial data response',
        parameters: {
            id: deviceParameters.INITIAL_DATA,
            data: {value: 2023, meterValue: 204, pulseCoefficient: 100}
        },
        hex: {
            header: '04 0a',
            body: '17 00 00 00 cc 82 00 00 07 e7'
        }
    },
    {
        name: 'device sending absolute data',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_STATUS,
            data: {
                status: 1
            }
        },
        hex: {
            header: '04 02',
            body: '18 01'
        }
    },
    {
        name: 'initial data from 1 channel',
        parameters: {
            id: deviceParameters.INITIAL_DATA_MULTI_CHANNEL,
            data: {value: 2032, meterValue: 402, pulseCoefficient: 1000, channel: 1}
        },
        hex: {
            header: '04 0b',
            body: '1d 01 00 00 01 92 80 00 00 07 f0'
        }
    },
    {
        name: 'absolute data sending is disabled for 2 channel',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_STATUS_MULTI_CHANNEL,
            data: {status: 0, channel: 2}
        },
        hex: {
            header: '04 03',
            body: '1e 02 00'
        }
    }
];


/**
 * Uplink command.
 *
 * @example
 * ```js
 * import GetParameter from 'jooby-codec/commands/uplink/GetParameter';
 * import {constants} from 'jooby-codec';
 *
 * const parameters = [eventList: {id: constants.events.MAGNET_ON, sequenceNumber: 1, seconds: 734015840}];
 * const command = new GetParameter(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0b 06 2b c0 31 60 01 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetParameter.md#response)
 */
class GetParameter extends Command {
    constructor ( public parameters: IParameter ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    static readonly examples = examples;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetParameter(buffer.getParameter());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getParameterSize(this.parameters));

        buffer.setParameter(this.parameters);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetParameter;
