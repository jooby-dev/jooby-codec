import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * ISetArchiveProfileParameters command parameters
 */
interface ISetArchiveProfileParameters extends ICommandParameters {
    summaryArchivePeriod: number,
    detailedArchivePeriod: number
}


const COMMAND_ID = 0x0f;
const COMMAND_SIZE = REQUEST_ID_SIZE + 4;

const examples: TCommandExampleList = [
    {
        name: 'set double default parameters',
        parameters: {
            requestId: 68,
            summaryArchivePeriod: 2880,
            detailedArchivePeriod: 30
        },
        hex: {header: '0f', body: '44 0b 40 00 1e'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetArchiveProfile from 'jooby-codec/obis-observer/commands/downlink/SetArchiveProfile.js';
 * const parameters = {
 *     requestId: 68,
 *     summaryArchivePeriod: 2880,
 *     detailedArchivePeriod: 30
 * };
 * const command = new SetArchiveProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0f 44 0b 40 00 1e
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetArchiveProfile.md#request)
 */
class SetArchiveProfile extends Command {
    constructor ( public parameters: ISetArchiveProfileParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetArchiveProfile({
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
        buffer.setUint16(summaryArchivePeriod);
        buffer.setUint16(detailedArchivePeriod);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetArchiveProfile;
