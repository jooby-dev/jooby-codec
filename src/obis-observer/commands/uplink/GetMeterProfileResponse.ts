import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * IGetArchiveProfileResponseParameters command parameters
 */
interface IGetMeterProfileResponseParameters extends ICommandParameters {
    archive1Period: number,
    archive2Period: number
}


const COMMAND_ID = 0x67;
const COMMAND_SIZE = REQUEST_ID_SIZE + 4;

const examples: TCommandExampleList = [
    {
        name: 'response to GetMeterProfile',
        parameters: {
            requestId: 3,
            archive1Period: 600,
            archive2Period: 45
        },
        hex: {header: '67 05', body: '03 02 58 00 2d'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetArchiveProfileResponse from 'jooby-codec/obis-observer/commands/uplink/GetArchiveProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x03, 0x02, 0x58, 0x00, 0x2d]);
 * const command = GetArchiveProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     archive1Period: 600,
 *     archive2Period: 45
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetArchiveProfile.md#response)
 */
class GetMeterProfileResponse extends Command {
    constructor ( public parameters: IGetMeterProfileResponseParameters ) {
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

        return new GetMeterProfileResponse({
            requestId: buffer.getUint8(),
            archive1Period: buffer.getUint16(),
            archive2Period: buffer.getUint16()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, archive1Period, archive2Period} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size as number);

        buffer.setUint8(requestId);
        buffer.setUint16(archive1Period);
        buffer.setUint16(archive2Period);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterProfileResponse;
