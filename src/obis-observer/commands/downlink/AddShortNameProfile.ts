import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObisProfile} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {archiveTypes, contentTypes} from '../../constants/index.js';


/**
 * IAddShortNameProfileParameters command parameters
 */
interface IAddShortNameProfileParameters extends ICommandParameters {
    shortName: number,
    obisProfile: IObisProfile
}


const COMMAND_ID = 0x05;
const COMMAND_SIZE = 7 + REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'add profile for short name 32',
        parameters: {
            requestId: 3,
            shortName: 32,
            obisProfile: {
                capturePeriod: 244,
                sendingPeriod: 132,
                sendingCounter: 38,
                flags: {
                    contentType: contentTypes.AUTO,
                    sendOnlyOnChange: 1,
                    archiveType: archiveTypes.NONE
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
 * import AddShortNameProfile from 'jooby-codec/obis-observer/commands/downlink/AddShortNameProfile.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     shortName: 32,
 *     obisProfile: {
 *     capturePeriod: 244,
 *     sendingPeriod: 132,
 *     sendingCounter: 38,
 *     flags: {
 *         contentType: 0,
 *         sendOnlyOnChange: 1,
 *         archiveType: 0
 *     }
 * };
 * const command = new AddShortNameProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 05 03 20 00 f4 00 84 26 04
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/AddShortNameProfile.md#request)
 */
class AddShortNameProfile extends Command {
    constructor ( public parameters: IAddShortNameProfileParameters ) {
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

        return new AddShortNameProfile({
            requestId: buffer.getUint8(),
            shortName: buffer.getUint8(),
            obisProfile: buffer.getObisProfile()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {requestId, shortName, obisProfile} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(shortName);
        buffer.setObisProfile(obisProfile);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default AddShortNameProfile;
