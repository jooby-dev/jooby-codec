import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetObisProfileParameters command parameters
 */
interface IGetObisProfileParameters extends ICommandParameters {
    meterProfileId: number,
    obisId: number
}


const COMMAND_ID = 0x48;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1 + 1;

const examples: TCommandExampleList = [
    {
        name: 'get OBIS profile for obisId 128 in meter profile 3',
        parameters: {
            requestId: 4,
            meterProfileId: 3,
            obisId: 128
        },
        hex: {header: '48 03', body: '04 03 80'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetObisIdProfile from 'jooby-codec/obis-observer/commands/downlink/GetObisIdProfile.js';
 *
 * const parameters = {
 *     requestId: 4,
 *     meterProfileId: 3,
 *     obisId: 128
 * };
 * const command = new GetObisIdProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 48 03 04 03 80
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisIdProfile.md#request)
 */
class GetObisProfile extends Command {
    constructor ( public parameters: IGetObisProfileParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterProfileId, obisId]: Uint8Array ) {
        return new GetObisProfile({requestId, meterProfileId, obisId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.meterProfileId, this.parameters.obisId])
        );
    }
}


export default GetObisProfile;
