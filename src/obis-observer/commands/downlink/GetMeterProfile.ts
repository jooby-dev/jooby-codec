import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetMeterProfileParameters command parameters
 */
interface IGetMeterProfileParameters extends ICommandParameters {
    meterProfileId: number
}


const COMMAND_ID = 0x66;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'get meter archive settings from meter profile 4',
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
 * import GetMeterProfile from 'jooby-codec/obis-observer/commands/downlink/GetMeterProfile.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 4
 * };
 * const command = new GetMeterProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 66 02 03 04
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterProfile.md#request)
 */
class GetMeterProfile extends Command {
    constructor ( public parameters: IGetMeterProfileParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterProfileId]: Uint8Array ) {
        return new GetMeterProfile({requestId, meterProfileId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.meterProfileId])
        );
    }
}


export default GetMeterProfile;
