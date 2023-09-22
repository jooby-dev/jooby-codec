import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IRemoveObisProfileParameters command parameters
 */
interface IRemoveObisProfileParameters extends ICommandParameters {
    meterProfileId: number,
    obisId: number
}


const COMMAND_ID = 0x48;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'remove obis profile for obisId 28 in meter profile 4',
        parameters: {
            requestId: 5,
            meterProfileId: 4,
            obisId: 28
        },
        hex: {header: '48 03', body: '05 04 1c'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import RemoveObisProfile from 'jooby-codec/obis-observer/commands/downlink/RemoveObisProfile.js';
 *
 * const parameters = {
 *     requestId: 5,
 *     meterProfileId: 04,
 *     obisId: 28
 * };
 * const command = new RemoveObisProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 48 03 05 04 1c
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveObisProfile.md#request)
 */
class RemoveObisProfile extends Command {
    constructor ( public parameters: IRemoveObisProfileParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterProfileId, obisId]: Uint8Array ) {
        return new RemoveObisProfile({requestId, meterProfileId, obisId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.meterProfileId, this.parameters.obisId])
        );
    }
}


export default RemoveObisProfile;
