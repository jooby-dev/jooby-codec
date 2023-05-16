import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetArchiveProfileResponseParameters command parameters
 */
interface IGetArchiveProfileResponseParameters extends ICommandParameters {
    summaryArchivePeriod?: number,
    detailedArchivePeriod?: number
}


const COMMAND_ID = 0x0e;
const COMMAND_SIZE = REQUEST_ID_SIZE + 4;

const examples: TCommandExampleList = [
    {
        name: 'default periods',
        parameters: {
            requestId: 3,
            summaryArchivePeriod: 600,
            detailedArchivePeriod: 45
        },
        hex: {header: '0e', body: '03 02 58 00 2d'}
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
 *     summaryArchivePeriod: 600,
 *     detailedArchivePeriod: 45
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetArchiveProfile.md#response)
 */
class GetArchiveProfileResponse extends Command {
    constructor ( public parameters: IGetArchiveProfileResponseParameters ) {
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

        return new GetArchiveProfileResponse({
            requestId: buffer.getUint8(),
            summaryArchivePeriod: buffer.getUint16(),
            detailedArchivePeriod: buffer.getUint16()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {requestId, summaryArchivePeriod, detailedArchivePeriod} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint16(summaryArchivePeriod ?? 0);
        buffer.setUint16(detailedArchivePeriod ?? 0);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveProfileResponse;
