import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, OBIS_PROFILE_SIZE, ICommandParameters, IObisProfile, IObis} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {contentTypes} from '../../constants/index.js';


/**
 * IGetObisInfoResponseParameters command parameters
 */
interface IGetObisInfoResponseParameters extends ICommandParameters {
    obis?: IObis,
    obisProfile?: IObisProfile,
}

const COMMAND_ID = 0x47;

const examples: TCommandExampleList = [
    {
        name: 'response to GetObisInfo with obis code 0.9.1 and obis profile',
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
                    sendOnChange: true,
                    archive1: true,
                    archive2: false
                }
            }
        },
        hex: {header: '47 0b', body: '03 02 00 09 01 01 58 02 14 3d 15'}
    },
    {
        name: 'response to GetObisInfo with obis code 0.9.1 without obis profile',
        parameters: {
            requestId: 3,
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        hex: {header: '47 05', body: '03 02 00 09 01'}
    },
    {
        name: 'response to GetObisInfo without data',
        parameters: {
            requestId: 3
        },
        hex: {header: '47 01', body: '03'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObisInfoResponse from 'jooby-codec/obis-observer/commands/uplink/GetObisInfoResponse.js';
 *
 * const commandBody = new Uint8Array([0x03, 0x02, 0x00, 0x09, 0x01, 0x01, 0x58, 0x02, 0x14, 0x3d, 0x15]);
 * const command = GetObisInfoResponse.fromBytes(commandBody);
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
 *             sendOnChange: true,
 *             archive1: true,
 *             archive2: false
 *         }
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisInfo.md#response)
 */
class GetObisInfoResponse extends Command {
    constructor ( public parameters: IGetObisInfoResponseParameters ) {
        super();

        let size = REQUEST_ID_SIZE;

        if ( parameters.obis ) {
            size += CommandBinaryBuffer.getObisSize(parameters.obis);

            if ( parameters.obisProfile ) {
                size += OBIS_PROFILE_SIZE;
            }
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
        const requestId = buffer.getUint8();

        if ( buffer.isEmpty ) {
            return new GetObisInfoResponse({requestId});
        }

        const obis = buffer.getObis();

        return buffer.isEmpty
            ? new GetObisInfoResponse({requestId, obis})
            : new GetObisInfoResponse({requestId, obis, obisProfile: buffer.getObisProfile()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {requestId, obis, obisProfile} = this.parameters;

        buffer.setUint8(requestId);

        if ( obis ) {
            buffer.setObis(obis);

            if ( obisProfile ) {
                buffer.setObisProfile(obisProfile);
            }
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisInfoResponse;
