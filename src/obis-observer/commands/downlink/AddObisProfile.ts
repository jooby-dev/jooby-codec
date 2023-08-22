import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObisProfile} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {contentTypes} from '../../constants/index.js';


/**
 * IAddObisProfileParameters command parameters
 */
interface IAddObisProfileParameters extends ICommandParameters {
    obisId: number,
    obisProfile: IObisProfile
}


const COMMAND_ID = 0x05;
const COMMAND_SIZE = 7 + REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'add profile for obisId 32',
        parameters: {
            requestId: 3,
            obisId: 32,
            obisProfile: {
                capturePeriod: 244,
                sendingPeriod: 132,
                sendingCounter: 38,
                flags: {
                    contentType: contentTypes.AUTO,
                    sendOnChange: true,
                    archiveProfile1: false,
                    archiveProfile2: false
                }
            }
        },
        hex: {header: '05', body: '03 20 00 f4 00 84 26 04'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import AddObisProfile from 'jooby-codec/obis-observer/commands/downlink/AddObisProfile.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     obisId: 32,
 *     obisProfile: {
 *         capturePeriod: 244,
 *         sendingPeriod: 132,
 *         sendingCounter: 38,
 *         flags: {
 *             contentType: 0,
 *             sendOnChange: true,
 *             archiveProfile1: false,
 *             archiveProfile2: false
 *         }
 *     }
 * };
 * const command = new AddObisProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 05 08 03 20 00 f4 00 84 26 04
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/AddObisProfile.md#request)
 */
class AddObisProfile extends Command {
    constructor ( public parameters: IAddObisProfileParameters ) {
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

        return new AddObisProfile({
            requestId: buffer.getUint8(),
            obisId: buffer.getUint8(),
            obisProfile: buffer.getObisProfile()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {requestId, obisId, obisProfile} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(obisId);
        buffer.setObisProfile(obisProfile);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default AddObisProfile;
