import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * ISetupMeterProfileParameters command parameters
 */
interface ISetupMeterProfileParameters extends ICommandParameters {
    meterProfileId: number,
    archive1Period: number,
    archive2Period: number
}


const COMMAND_ID = 0x60;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1 + 2 + 2;

const examples: TCommandExampleList = [
    {
        name: 'setup meter profile with id 8',
        parameters: {
            requestId: 68,
            meterProfileId: 8,
            archive1Period: 2880,
            archive2Period: 30
        },
        hex: {header: '60 06', body: '44 08 0b 40 00 1e'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetupMeterProfile from 'jooby-codec/obis-observer/commands/downlink/SetupMeterProfile.js';
 * const parameters = {
 *     requestId: 68,
 *     meterProfileId: 8,
 *     archive1Period: 2880,
 *     archive2Period: 30
 * };
 * const command = new SetupMeterProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 60 06 08 44 0b 40 00 1e
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetupMeterProfile.md#request)
 */
class SetupMeterProfile extends Command {
    constructor ( public parameters: ISetupMeterProfileParameters ) {
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

        return new SetupMeterProfile({
            requestId: buffer.getUint8(),
            meterProfileId: buffer.getUint8(),
            archive1Period: buffer.getUint16(),
            archive2Period: buffer.getUint16()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {requestId, meterProfileId, archive1Period, archive2Period} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(meterProfileId);
        buffer.setUint16(archive1Period);
        buffer.setUint16(archive2Period);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetupMeterProfile;
