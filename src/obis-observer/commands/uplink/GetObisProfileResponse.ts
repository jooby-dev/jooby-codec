import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, OBIS_PROFILE_SIZE, ICommandParameters, IObisProfile} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {contentTypes} from '../../constants/index.js';


/**
 * IGetObisProfileResponseParameters command parameters
 */
interface IGetObisProfileResponseParameters extends ICommandParameters {
    obisProfile: IObisProfile,
}

const COMMAND_ID = 0x49;
const COMMAND_SIZE = REQUEST_ID_SIZE + OBIS_PROFILE_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'obis profile for obisId 121',
        parameters: {
            requestId: 3,
            obisProfile: {
                capturePeriod: 344,
                sendingPeriod: 532,
                sendingCounter: 61,
                flags: {
                    contentType: contentTypes.STRING,
                    sendOnChange: false,
                    archiveProfile1: true,
                    archiveProfile2: true
                }
            }
        },
        hex: {header: '49 07', body: '03 01 58 02 14 3d 13'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObisProfileResponse from 'jooby-codec/obis-observer/commands/uplink/GetObisProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x03, 0x01, 0x58, 0x02, 0x14, 0x3d, 0x13]);
 * const command = GetObisProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     obisProfile: {
 *         capturePeriod: 344,
 *         sendingPeriod: 532,
 *         sendingCounter: 61,
 *         flags: {
 *             contentType: 2,
 *             sendOnChange: false,
 *             archiveProfile1: true,
 *             archiveProfile2: true
 *         }
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisProfile.md#response)
 */
class GetObisProfileResponse extends Command {
    constructor ( public parameters: IGetObisProfileResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const requestId = buffer.getUint8();
        const obisProfile = buffer.getObisProfile();

        return new GetObisProfileResponse({requestId, obisProfile});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, obisProfile} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setObisProfile(obisProfile);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisProfileResponse;
