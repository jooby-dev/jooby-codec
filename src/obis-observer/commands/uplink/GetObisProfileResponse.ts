import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, OBIS_PROFILE_SIZE, ICommandParameters, IObisProfile} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {contentTypes} from '../../constants/index.js';


/**
 * IGetObisProfileResponseParameters command parameters
 */
interface IGetObisProfileResponseParameters extends ICommandParameters {
    obisProfile?: IObisProfile,
}

const COMMAND_ID = 0x49;
const COMMAND_SIZE = REQUEST_ID_SIZE + OBIS_PROFILE_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'response to GetObisProfile',
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
    },
    {
        name: 'response to GetObisProfile without data',
        parameters: {
            requestId: 3
        },
        hex: {header: '49 01', body: '03'}
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

        this.size = parameters.obisProfile ? COMMAND_SIZE : REQUEST_ID_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();

        return buffer.isEmpty
            ? new GetObisProfileResponse({requestId})
            : new GetObisProfileResponse({requestId, obisProfile: buffer.getObisProfile()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {requestId, obisProfile} = this.parameters;

        buffer.setUint8(requestId);

        if (obisProfile) {
            buffer.setObisProfile(obisProfile);
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisProfileResponse;
