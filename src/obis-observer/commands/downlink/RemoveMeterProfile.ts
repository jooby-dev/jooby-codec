import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * IRemoveMeterProfileParameters command parameters
 */
interface IRemoveMeterProfileParameters extends ICommandParameters {
    meterProfileId: number
}


const COMMAND_ID = 0x62;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'remove meter profile 17',
        parameters: {
            requestId: 3,
            meterProfileId: 17
        },
        hex: {header: '62 02', body: '03 11'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import RemoveMeterProfile from 'jooby-codec/obis-observer/commands/downlink/RemoveMeterProfile.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 17
 * };
 * const command = new RemoveMeterProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 62 02 03 11
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveMeterProfile.md#request)
 */
class RemoveMeterProfile extends Command {
    constructor ( public parameters: IRemoveMeterProfileParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterProfileId]: Uint8Array ) {
        return new RemoveMeterProfile({requestId, meterProfileId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters} = this;

        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array(
                [parameters.requestId, parameters.meterProfileId]
            )
        );
    }
}


export default RemoveMeterProfile;
