import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IObisProfile} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {archiveTypes, contentTypes} from '../../constants/index.js';


/**
 * IAddShortNameProfileParameters command parameters
 */
interface IAddShortNameProfileParameters {
    shortName: number,
    obisProfile: IObisProfile
}


const COMMAND_ID = 0x03;
const COMMAND_SIZE = 7;

const examples: TCommandExampleList = [
    {
        name: 'add profile for short name 32',
        parameters: {
            shortName: 32,
            obisProfile: {
                capturePeriod: 244,
                sendingPeriod: 132,
                sendingCounter: 38,
                flags: {
                    contentType: contentTypes.AUTO,
                    sendingOnlyIfChange: 1,
                    archiveType: archiveTypes.NONE
                }
            }
        },
        hex: {header: '03', body: '20 f4 00 84 00 26 04'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import AddShortNameProfile from 'jooby-codec/obis-observer/commands/downlink/AddShortNameProfile';
 *
 * const parameters = {
 *     shortName: 32,
 *     obisProfile: {
 *         capturePeriod: 244,
 *         sendingPeriod: 132,
 *         sendingCounter: 38,
 *         flags: {
 *             contentType: 0,
 *             sendingOnlyIfChange: 1,
 *             archiveType: 0
 *         }
 *     }
 * };
 * const command = new AddShortNameProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 03 20 f4 00 84 00 26 04
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

        return new AddShortNameProfile({shortName: buffer.getUint8(), obisProfile: buffer.getObisProfile()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {shortName, obisProfile} = this.parameters;

        buffer.setUint8(shortName);
        buffer.setObisProfile(obisProfile);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default AddShortNameProfile;
