import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, OBIS_PROFILE_SIZE, ICommandParameters, IObisProfile} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {contentTypes} from '../../constants/index.js';


/**
 * IGetShortNameProfileResponseParameters command parameters
 */
interface IGetShortNameProfileResponseParameters extends ICommandParameters {
    obisProfile: IObisProfile,
}

const COMMAND_ID = 0x0a;
const COMMAND_SIZE = REQUEST_ID_SIZE + OBIS_PROFILE_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'profile for short name 121',
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
        hex: {header: '0a', body: '03 01 58 02 14 3d 13'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetShortNameProfileResponse from 'jooby-codec/obis-observer/commands/uplink/GetShortNameProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x03, 0x01, 0x58, 0x02, 0x14, 0x3d, 0x13]);
 * const command = GetShortNameProfileResponse.fromBytes(commandBody);
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetShortNameProfile.md#response)
 */
class GetShortNameProfileResponse extends Command {
    constructor ( public parameters: IGetShortNameProfileResponseParameters ) {
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

        return new GetShortNameProfileResponse({requestId, obisProfile});
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


export default GetShortNameProfileResponse;
