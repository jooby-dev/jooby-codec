import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, OBIS_PROFILE_SIZE, ICommandParameters, IObisProfile, IObis} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {archiveTypes, contentTypes} from '../../constants/index.js';


/**
 * IGetShortNameInfoResponseParameters command parameters
 */
interface IGetShortNameInfoResponseParameters extends ICommandParameters {
    obis?: IObis,
    obisProfile?: IObisProfile,
}

const COMMAND_ID = 0x0c;

const examples: TCommandExampleList = [
    {
        name: 'short name info with obis code 0.9.1 and obis profile',
        parameters: {
            requestId: 3,
            obis: {
                c: 0,
                d: 9,
                e: 1
            },
            obisProfile: {
                capturePeriod: 344,
                sendingPeriod: 532,
                sendingCounter: 61,
                flags: {
                    contentType: contentTypes.STRING,
                    sendOnlyOnChange: 0,
                    archiveType: archiveTypes.DETAILED
                }
            }
        },
        hex: {header: '0c', body: '0b 03 02 00 09 01 01 58 02 14 3d 0a'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetShortNameInfoResponse from 'jooby-codec/obis-observer/commands/uplink/GetShortNameInfoResponse.js';
 *
 * const commandBody = new Uint8Array([0x0b, 0x03, 0x02, 0x00, 0x09, 0x01, 0x01, 0x58, 0x02, 0x14, 0x3d, 0x0a]);
 * const command = GetShortNameInfoResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     obis: {
 *         c: 0,
 *         d: 9,
 *         e: 1
 *     },
 *     obisProfile: {
 *         capturePeriod: 344,
 *         sendingPeriod: 532,
 *         sendingCounter: 61,
 *         flags: {
 *             contentType: 2,
 *             sendOnlyOnChange: 0,
 *             archiveType: 1
 *         }
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetShortNameInfo.md#response)
 */
class GetShortNameInfoResponse extends Command {
    constructor ( public parameters: IGetShortNameInfoResponseParameters ) {
        super();

        // real size - 1 size byte + others
        let size = 1 + REQUEST_ID_SIZE;

        if ( parameters.obis ) {
            size += CommandBinaryBuffer.getObisSize(parameters.obis);
        }

        if ( parameters.obisProfile ) {
            size += OBIS_PROFILE_SIZE;
        }

        this.size = size;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        let size = buffer.getUint8() - REQUEST_ID_SIZE;
        const requestId = buffer.getUint8();
        let obis;
        let obisProfile;

        // obis code assigned
        if ( size > 0 ) {
            obis = buffer.getObis();
            size -= CommandBinaryBuffer.getObisSize(obis);
        }

        // obis profile exists
        if ( size > 0 ) {
            obisProfile = buffer.getObisProfile();
        }

        return new GetShortNameInfoResponse({requestId, obis, obisProfile});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, obis, obisProfile} = this.parameters;

        // subtract size byte
        buffer.setUint8(this.size - 1);
        buffer.setUint8(requestId);

        if ( obis ) {
            buffer.setObis(obis);
        }

        if ( obisProfile ) {
            buffer.setObisProfile(obisProfile);
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetShortNameInfoResponse;
