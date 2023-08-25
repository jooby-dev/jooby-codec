import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObis} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * ISetObisIdParameters command parameters
 */
interface ISetObisIdParameters extends ICommandParameters {
    meterProfileId: number,
    obisId: number,
    obis: IObis
}


const COMMAND_ID = 0x42;

const examples: TCommandExampleList = [
    {
        name: 'set meter profile 2, obisId 44 for OBIS code 0.9.1',
        parameters: {
            requestId: 3,
            meterProfileId: 2,
            obisId: 44,
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        hex: {header: '42', body: '03 02 2c 02 00 09 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetObisID from 'jooby-codec/obis-observer/commands/downlink/SetObisId.js';
 * const parameters = {
 *     meterProfileId: 2,
 *     obisId: 44,
 *     obis: {
 *         c: 0,
 *         d: 9,
 *         e: 1
 *     }
 * };
 * const command = new SetObisId(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 42 06 02 2c 02 00 09 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetObisId.md#request)
 */
class SetObisId extends Command {
    constructor ( public parameters: ISetObisIdParameters ) {
        super();

        // request id 1 byte + meterProfileId 1 byte + oibsId 1 byte + obis size
        this.size = REQUEST_ID_SIZE + 1 + 1 + CommandBinaryBuffer.getObisSize(parameters.obis);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetObisId({
            requestId: buffer.getUint8(),
            meterProfileId: buffer.getUint8(),
            obisId: buffer.getUint8(),
            obis: buffer.getObis()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, meterProfileId, obisId, obis} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(meterProfileId);
        buffer.setUint8(obisId);
        buffer.setObis(obis);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetObisId;
