import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ILegacyHourCounterWithDiff} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x05;

const examples: TCommandExampleList = [
    {
        name: '1 hour archive from 2023.12.23 12:00:00 GMT',
        parameters: {
            startTime2000: 756648000,
            counter: {isMagneticInfluence: true, value: 163},
            diff: [
                {isMagneticInfluence: true, value: 10}
            ]
        },
        hex: {header: '05 08', body: '2f 97 8c 00 00 a3 80 0a'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetArchiveHoursResponse from 'jooby-codec/analog/commands/uplink/GetArchiveHoursResponse.js';
 *
 * const commandBody = new Uint8Array([0x2f, 0x97, 0x8c, 0x8c, 0x00, 0x00, 0xa3, 0x80, 0x0a]);
 * const command = GetArchiveHoursResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     counter: {isMagneticInfluence: true, value: 163},
 *     diff: [
 *         {isMagneticInfluence: true, value: 10}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveHoursMC.md#response)
 */
class GetArchiveHoursResponse extends Command {
    constructor ( public parameters: ILegacyHourCounterWithDiff ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetArchiveHoursResponse {
        const buffer = new CommandBinaryBuffer(data);

        return new GetArchiveHoursResponse(buffer.getLegacyHourCounterWithDiff());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getLegacyHourCounterSize(this.parameters));

        buffer.setLegacyHourCounterWithDiff(this.parameters);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveHoursResponse;
