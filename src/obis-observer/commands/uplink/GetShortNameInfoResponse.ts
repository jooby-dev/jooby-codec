import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IObis, IObisProfile} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {archiveTypes, contentTypes} from '../../constants/index.js';


/**
 * IGetShortNameInfoResponseParameters command parameters
 */
interface IGetShortNameInfoResponseParameters {
    shortName: number,
    obis: IObis,
    obisProfile: IObisProfile,
}

const COMMAND_ID = 0x06;

const examples: TCommandExampleList = [
    {
        name: 'info for short name 121 and obis 0.9.1',
        parameters: {
            shortName: 121,
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
        hex: {header: '06', body: '0b 79 02 00 09 01 58 01 14 02 3d 0a'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetShortNameInfoResponse from 'jooby-codec/obis-observer/commands/uplink/GetShortNameInfoResponse.js';
 *
 * const commandBody = new Uint8Array([0x06, 0x0b, 0x79, 0x02, 0x00, 0x09, 0x01, 0x58, 0x01, 0x14, 0x02, 0x3d, 0x0a]);
 * const command = GetShortNameInfoResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     shortName: 121,
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
    constructor ( public parameters: IGetShortNameInfoResponseParameters, size?: number ) {
        super();

        // body size = size byte + obis code 3-7 byte + short name 1 byte + obis profile 6 byte
        this.size = (size ?? CommandBinaryBuffer.getObisSize(parameters.obis) + 7) + 1;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const size = buffer.getUint8();
        const shortName = buffer.getUint8();
        const obis = buffer.getObis();
        const obisProfile = buffer.getObisProfile();

        return new GetShortNameInfoResponse({shortName, obis, obisProfile}, size);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {shortName, obis, obisProfile} = this.parameters;

        buffer.setUint8(this.size - 1);
        buffer.setUint8(shortName);
        buffer.setObis(obis);
        buffer.setObisProfile(obisProfile);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetShortNameInfoResponse;
