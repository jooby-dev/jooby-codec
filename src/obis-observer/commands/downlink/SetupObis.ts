import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObisProfile, OBIS_PROFILE_SIZE, IObis} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {contentTypes} from '../../constants/index.js';

/**
 * ISetupObisParameters command parameters
 */
interface ISetupObisParameters extends ICommandParameters {
    meterProfileId: number,
    obisId: number,
    obisProfile: IObisProfile,
    obis?: IObis
}


const COMMAND_ID = 0x42;

const examples: TCommandExampleList = [
    {
        name: 'setup obisId 240 for OBIS code 0.9.1 in meter profile 2',
        parameters: {
            requestId: 3,
            meterProfileId: 2,
            obisId: 240,
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
            },
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        hex: {header: '42 0d', body: '03 02 f0 00 f4 00 84 26 04 02 00 09 01'}
    }
];

const commandSize = ( parameters: ISetupObisParameters ): number => {
    // request id 1 byte + meterProfileId 1 byte + oibsId 1 byte + obis profile size + obis size
    let size = REQUEST_ID_SIZE + 1 + 1 + OBIS_PROFILE_SIZE;

    if ( parameters.obis ) {
        size += CommandBinaryBuffer.getObisSize(parameters.obis);
    }

    return size;
};


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetupObisID from 'jooby-codec/obis-observer/commands/downlink/SetupObis.js';
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 2,
 *     obisId: 240,
 *     obisProfile: {
 *         capturePeriod: 244,
 *         sendingPeriod: 132,
 *         sendingCounter: 38,
 *         flags: {
 *             contentType: contentTypes.AUTO,
 *             sendOnChange: true,
 *             archive1: false,
 *             archive2: false
 *         }
 *     },
 *     obis: {
 *         c: 0,
 *         d: 9,
 *         e: 1
 *     }
 * };
 * const command = new SetupObis(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 42 0d 03 02 00 f4 00 84 26 04 f0 02 00 09 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetupObis.md#request)
 */
class SetupObis extends Command {
    constructor ( public parameters: ISetupObisParameters ) {
        super();

        this.size = commandSize(parameters);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();
        const meterProfileId = buffer.getUint8();
        const obisId = buffer.getUint8();
        const obisProfile = buffer.getObisProfile();

        return buffer.isEmpty
            ? new SetupObis({
                requestId,
                meterProfileId,
                obisId,
                obisProfile
            })
            : new SetupObis({
                requestId,
                meterProfileId,
                obisId,
                obisProfile,
                obis: buffer.getObis()
            });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, meterProfileId, obisId, obisProfile, obis} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(meterProfileId);
        buffer.setUint8(obisId);
        buffer.setObisProfile(obisProfile);

        if ( obis ) {
            buffer.setObis(obis);
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetupObis;
