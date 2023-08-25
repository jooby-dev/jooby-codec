import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * ISetupMeterParameters command parameters
 */
interface ISetupMeterParameters extends ICommandParameters {
    meterId: number,
    meterProfileId: number,
    address: string
}


const COMMAND_ID = 0x70;

const examples: TCommandExampleList = [
    {
        name: 'setup meter with Id 20',
        parameters: {
            requestId: 3,
            meterId: 20,
            meterProfileId: 17,
            address: 'ma2375'
        },
        hex: {header: '70', body: '03 14 11 06 6d 61 32 33 37 35'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetupMeter from 'jooby-codec/obis-observer/commands/downlink/SetupMeter.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterId: 20,
 *     meterProfileId: 17,
 *     address: 'ma2375'
 * };
 * const command = new SetupMeter(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 70 0a 03 14 11 06 6d 61 32 33 37 35
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetupMeter.md#request)
 */
class SetupMeter extends Command {
    constructor ( public parameters: ISetupMeterParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 3 + parameters.address.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetupMeter({
            requestId: buffer.getUint8(),
            meterId: buffer.getUint8(),
            meterProfileId: buffer.getUint8(),
            address: buffer.getString()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, meterId, meterProfileId, address} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(meterId);
        buffer.setUint8(meterProfileId);
        buffer.setString(address);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetupMeter;
