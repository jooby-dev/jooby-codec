import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetArchiveProfileResponseParameters command parameters
 */
interface IGetArchiveProfileResponseParameters {
    summaryArchivePeriod?: number,
    detailedArchivePeriod?: number
}


const COMMAND_ID = 0x07;
const COMMAND_SIZE = 4;

const examples: TCommandExampleList = [
    {
        name: 'default periods',
        parameters: {
            summaryArchivePeriod: 600,
            detailedArchivePeriod: 45
        },
        hex: {header: '07', body: '02 58 00 2d'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetArchiveProfileResponse from 'jooby-codec/obis-observer/commands/uplink/GetArchiveProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x02, 0x58, 0x00, 0x2d]);
 * const command = GetArchiveProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
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
            summaryArchivePeriod: buffer.getUint16(false),
            detailedArchivePeriod: buffer.getUint16(false)
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {summaryArchivePeriod, detailedArchivePeriod} = this.parameters;

        buffer.setUint16(summaryArchivePeriod ?? 0, false);
        buffer.setUint16(detailedArchivePeriod ?? 0, false);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveProfileResponse;
