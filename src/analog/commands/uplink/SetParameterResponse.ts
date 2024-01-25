import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';
import * as deviceParameters from '../../constants/deviceParameters.js';


/**
 * SetParameterResponse command parameters
 */
interface ISetParameterResponseParameters {
    id: number,
    status: number
}

const COMMAND_ID = 0x03;
const COMMAND_BODY_SIZE = 2;

const examples: TCommandExampleList = [
    {
        name: 'activation method set successfully',
        parameters: {
            id: deviceParameters.ACTIVATION_METHOD,
            status: 1
        },
        hex: {header: '03 02', body: '09 01'}
    },
    {
        name: 'configuration for battery depassivation set successfully',
        parameters: {
            id: deviceParameters.BATTERY_DEPASSIVATION_CONFIG,
            status: 1
        },
        hex: {header: '03 02', body: '21 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetParameterResponse from 'jooby-codec/analog/commands/uplink/SetParameterResponse.js';
 *
 * const commandBody = new Uint8Array([0x09, 0x01]);
 * const command = SetTime2000Response.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {id: 9, status: 1}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SetParameter.md#response)
 */
class SetParameterResponse extends Command {
    constructor ( public parameters: ISetParameterResponseParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new CommandBinaryBuffer(data);
        const parameters = {
            id: buffer.getUint8(),
            status: buffer.getUint8()
        };

        if ( !buffer.isEmpty ) {
            throw new Error('BinaryBuffer is not empty.');
        }

        return new SetParameterResponse(parameters);
    }

    toBinary (): ICommandBinary {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        const {id, status} = this.parameters;

        buffer.setUint8(id);
        buffer.setUint8(status);

        return Command.toBinary(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetParameterResponse;
