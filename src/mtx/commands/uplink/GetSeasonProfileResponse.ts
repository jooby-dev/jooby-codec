import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {ISeasonProfile} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


const COMMAND_ID = 0x3c;
const COMMAND_SIZE = 9;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            month: 1,
            date: 2,
            dayIndexes: [0, 1, 0, 1, 0, 1, 0]
        },
        hex: {header: '3c 09', body: '01 02 00 01 00 01 00 01 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetSeasonProfileResponse from 'jooby-codec/mtx/commands/uplink/GetSeasonProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x3c, 0x09, 0x01, 0x02, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00]);
 * const command = GetSeasonProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     month: 1,
 *     date: 2,
 *     dayIndexes: [0, 1, 0, 1, 0, 1, 0]
 * };
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetSeasonProfile.md#response)
 */
class GetSeasonProfileResponse extends Command {
    constructor ( public parameters: ISeasonProfile ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetSeasonProfileResponse {
        const buffer = new CommandBinaryBuffer(data);

        return new GetSeasonProfileResponse(buffer.getSeasonProfile());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setSeasonProfile(parameters);

        return buffer.toUint8Array();
    }
}


export default GetSeasonProfileResponse;
