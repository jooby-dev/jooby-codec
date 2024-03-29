import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, METER_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * ISetupMeterParameters command parameters
 */
interface ISetupMeterParameters extends ICommandParameters {
    meterId: number,
    address: string,
    meterProfileId?: number
}


const COMMAND_ID = 0x70;

const examples: TCommandExampleList = [
    {
        name: 'setup meter with Id 20 without profile and without address',
        parameters: {
            requestId: 3,
            meterId: 20,
            address: ''
        },
        hex: {header: '70 05', body: '03 00 00 00 14'}
    },
    {
        name: 'setup meter with Id 20 without profile',
        parameters: {
            requestId: 3,
            meterId: 20,
            address: 'ma2375'
        },
        hex: {header: '70 0c', body: '03 00 00 00 14 06 6d 61 32 33 37 35'}
    },
    {
        name: 'setup meter with Id 20',
        parameters: {
            requestId: 3,
            meterId: 20,
            address: 'ma2375',
            meterProfileId: 17
        },
        hex: {header: '70 0d', body: '03 00 00 00 14 06 6d 61 32 33 37 35 11'}
    }
];

const commandSize = ( parameters: ISetupMeterParameters ): number => {
    let size = REQUEST_ID_SIZE + METER_ID_SIZE;
    const {meterProfileId} = parameters;
    const isMeterProfileIdExist = meterProfileId || meterProfileId === 0;

    if ( parameters.address.length !== 0 || isMeterProfileIdExist ) {
        size += 1 + parameters.address.length;

        if ( isMeterProfileIdExist ) {
            size += 1;
        }
    }

    return size;
};


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
 * // 70 0d 03 00 00 00 14 06 6d 61 32 33 37 35 11
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetupMeter.md#request)
 */
class SetupMeter extends Command {
    constructor ( public parameters: ISetupMeterParameters ) {
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
        const meterId = buffer.getUint32();

        if ( buffer.isEmpty ) {
            return new SetupMeter({requestId, meterId, address: ''});
        }

        const address = buffer.isEmpty ? '' : buffer.getString();

        return buffer.isEmpty
            ? new SetupMeter({requestId, meterId, address})
            : new SetupMeter({requestId, meterId, meterProfileId: buffer.getUint8(), address});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, meterId, meterProfileId, address} = this.parameters;

        const isMeterProfileIdExist = meterProfileId || meterProfileId === 0;
        buffer.setUint8(requestId);
        buffer.setUint32(meterId);

        if ( address.length !== 0 || isMeterProfileIdExist ) {
            buffer.setString(address);
            if ( isMeterProfileIdExist ) {
                buffer.setUint8(meterProfileId);
            }
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetupMeter;
