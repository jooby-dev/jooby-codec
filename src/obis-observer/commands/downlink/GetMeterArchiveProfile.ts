import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetMeterArchiveProfileParameters command parameters
 */
interface IGetMeterArchiveProfileParameters extends ICommandParameters {
    meterProfileId: number
}


const COMMAND_ID = 0x66;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'get meter archive profile',
        parameters: {
            requestId: 3,
            meterProfileId: 4
        },
        hex: {header: '66 02', body: '03 04'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetMeterArchiveProfile from 'jooby-codec/obis-observer/commands/downlink/GetMeterArchiveProfile.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 4
 * };
 * const command = new GetMeterArchiveProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 66 02 03 04
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterArchiveProfile.md#request)
 */
class GetMeterArchiveProfile extends Command {
    constructor ( public parameters: IGetMeterArchiveProfileParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterProfileId]: Uint8Array ) {
        return new GetMeterArchiveProfile({requestId, meterProfileId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.meterProfileId])
        );
    }
}


export default GetMeterArchiveProfile;
