import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IObisProfile} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {archiveTypes, contentTypes} from '../../constants/index.js';


/**
 * IGetShortNameProfileResponseParameters command parameters
 */
interface IGetShortNameProfileResponseParameters {
    shortName: number,
    obisProfile: IObisProfile,
}

const COMMAND_ID = 0x05;
const COMMAND_SIZE = 7;

const examples: TCommandExampleList = [
    {
        name: 'profile for short name 121',
        parameters: {
            shortName: 121,
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
        hex: {header: '05', body: '79 58 01 14 02 3d 0a'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetShortNameProfileResponse from 'jooby-codec/obis-observer/commands/uplink/GetShortNameProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x79, 0x58, 0x01, 0x14, 0x02, 0x3d, 0x0a]);
 * const command = GetShortNameProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     shortName: 121,
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

    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const shortName = buffer.getUint8();
        const obisProfile = buffer.getObisProfile();

        return new GetShortNameProfileResponse({shortName, obisProfile});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);

        const {shortName, obisProfile} = this.parameters;

        buffer.setUint8(shortName);
        buffer.setObisProfile(obisProfile);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetShortNameProfileResponse;
