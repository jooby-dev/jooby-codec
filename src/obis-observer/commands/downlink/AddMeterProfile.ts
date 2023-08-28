import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IAddMeterProfileParameters command parameters
 */
interface IAddMeterProfileParameters extends ICommandParameters {
    meterProfileId: number
}


const COMMAND_ID = 0x60;
const COMMAND_SIZE = 1 + REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'add meter profile with Id 17',
        parameters: {
            requestId: 3,
            meterProfileId: 17
        },
        hex: {header: '60', body: '03 11'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import AddMeterProfile from 'jooby-codec/obis-observer/commands/downlink/AddMeterProfile.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 17
 * };
 * const command = new AddMeterProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 60 02 03 11
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/AddMeterProfile.md#request)
 */
class AddMeterProfile extends Command {
    constructor ( public parameters: IAddMeterProfileParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterProfileId]: Uint8Array ) {
        return new AddMeterProfile({requestId, meterProfileId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array(
                [this.parameters.requestId, this.parameters.meterProfileId]
            )
        );
    }
}


export default AddMeterProfile;
