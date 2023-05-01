import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IParameter} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import * as deviceParameters from '../../constants/deviceParameters.js';


const COMMAND_ID = 0x04;

const examples: TCommandExampleList = [
    {
        name: 'initial data response',
        parameters: {
            id: deviceParameters.INITIAL_DATA,
            data: {value: 2023, meterValue: 204, pulseCoefficient: 100}
        },
        hex: {header: '04 0a', body: '17 00 00 00 cc 82 00 00 07 e7'}
    },
    {
        name: 'device sending absolute data',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_ENABLE,
            data: {status: 1}
        },
        hex: {header: '04 02', body: '18 01'}
    },
    {
        name: 'initial data from 1 channel',
        parameters: {
            id: deviceParameters.INITIAL_DATA_MULTI_CHANNEL,
            data: {value: 2032, meterValue: 402, pulseCoefficient: 1000, channel: 1}
        },
        hex: {header: '04 0b', body: '1d 00 00 00 01 92 80 00 00 07 f0'}
    },
    {
        name: 'absolute data sending is disabled for 2 channel',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL,
            data: {status: 0, channel: 2}
        },
        hex: {header: '04 03', body: '1e 01 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetParameterResponse from 'jooby-codec/commands/uplink/GetParameterResponse';
 *
 * const commandBody = new Uint8Array([
 *     0x1d, 0x01, 0x00, 0x00, 0x01, 0x92, 0x80, 0x00, 0x00, 0x07, 0xf0
 * ]);
 * const command = GetParameterResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     id: 29,
 *     data: {value: 2032, meterValue: 402, pulseCoefficient: 1000, channel: 1}
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetParameter.md#response)
 */
class GetParameterResponse extends Command {
    constructor ( public parameters: IParameter ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetParameterResponse(buffer.getParameter());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getParameterSize(this.parameters));

        buffer.setParameter(this.parameters);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetParameterResponse;
