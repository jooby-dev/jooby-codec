import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObisProfile, OBIS_PROFILE_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {contentTypes} from '../../constants/index.js';


/**
 * ISetObisProfileParameters command parameters
 */
interface ISetObisProfileParameters extends ICommandParameters {
    meterProfileId: number,
    obisId: number,
    obisProfile: IObisProfile
}


const COMMAND_ID = 0x46;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1 + 1 + OBIS_PROFILE_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'set OBIS profile for obisId 32 in meter profile 2',
        parameters: {
            requestId: 3,
            meterProfileId: 2,
            obisId: 32,
            obisProfile: {
                capturePeriod: 244,
                sendingPeriod: 132,
                sendingCounter: 38,
                flags: {
                    contentType: contentTypes.AUTO,
                    sendOnChange: true,
                    archive1: false,
                    archive2: false
                }
            }
        },
        hex: {header: '46 09', body: '03 02 20 00 f4 00 84 26 04'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetObisProfile from 'jooby-codec/obis-observer/commands/downlink/SetObisProfile.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 2,
 *     obisId: 32,
 *     obisProfile: {
 *         capturePeriod: 244,
 *         sendingPeriod: 132,
 *         sendingCounter: 38,
 *         flags: {
 *             contentType: 0,
 *             sendOnChange: true,
 *             archive1: false,
 *             archive2: false
 *         }
 *     }
 * };
 * const command = new SetObisProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 46 09 03 02 20 00 f4 00 84 26 04
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetObisProfile.md#request)
 */
class SetObisProfile extends Command {
    constructor ( public parameters: ISetObisProfileParameters ) {
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

        return new SetObisProfile({
            requestId: buffer.getUint8(),
            meterProfileId: buffer.getUint8(),
            obisId: buffer.getUint8(),
            obisProfile: buffer.getObisProfile()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {requestId, meterProfileId, obisId, obisProfile} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(meterProfileId);
        buffer.setUint8(obisId);
        buffer.setObisProfile(obisProfile);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetObisProfile;
