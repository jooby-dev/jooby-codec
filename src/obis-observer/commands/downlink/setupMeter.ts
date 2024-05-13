/**
 * Downlink command to setup the meter id, meter profile id, meter address to the meter. A new meter will be created if it doesn't exist.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setupMeter from 'jooby-codec/obis-observer/commands/downlink/setupMeter.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterId: 20,
 *     meterProfileId: 17,
 *     address: 'ma2375'
 * };
 * const bytes = setupMeter.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [112, 13, 3, 0, 0, 0, 20, 6, 109, 97, 50, 51, 55, 53, 17]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetupMeter.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer, ICommandParameters, METER_ID_SIZE, REQUEST_ID_SIZE
} from '../../utils/CommandBinaryBuffer.js';


/**
 * ISetupMeterParameters command parameters
 */
interface ISetupMeterParameters extends ICommandParameters {
    meterId: types.TUint32,
    address: string,
    meterProfileId?: types.TUint8
}


export const id: types.TCommandId = 0x70;
export const name: types.TCommandName = 'setupMeter';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'setup meter with Id 20 without profile and without address': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            meterId: 20,
            address: ''
        },
        bytes: [
            0x70, 0x05,
            0x03, 0x00, 0x00, 0x00, 0x14
        ]
    },
    'setup meter with Id 20 without profile': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            meterId: 20,
            address: 'ma2375'
        },
        bytes: [
            0x70, 0x0c,
            0x03, 0x00, 0x00, 0x00, 0x14, 0x06, 0x6d, 0x61, 0x32, 0x33, 0x37, 0x35
        ]
    },
    'setup meter with Id 20': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            meterId: 20,
            address: 'ma2375',
            meterProfileId: 17
        },
        bytes: [
            0x70, 0x0d,
            0x03, 0x00, 0x00, 0x00, 0x14, 0x06, 0x6d, 0x61, 0x32, 0x33, 0x37, 0x35, 0x11
        ]
    }
};


const getCommandSize = ( parameters: ISetupMeterParameters ): number => {
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
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ISetupMeterParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const meterId = buffer.getUint32();

    if ( buffer.isEmpty ) {
        return {requestId, meterId, address: ''};
    }

    const address = buffer.getString();

    if ( buffer.isEmpty ) {
        return {
            requestId,
            meterId,
            address
        };
    }

    const meterProfileId = buffer.getUint8();

    return {
        requestId,
        meterId,
        address,
        meterProfileId
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetupMeterParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(getCommandSize(parameters));
    const {requestId, meterId, meterProfileId, address} = parameters;
    const isMeterProfileIdExist = meterProfileId || meterProfileId === 0;

    buffer.setUint8(requestId);
    buffer.setUint32(meterId);

    if ( address.length !== 0 || isMeterProfileIdExist ) {
        buffer.setString(address);
        if ( isMeterProfileIdExist ) {
            buffer.setUint8(meterProfileId);
        }
    }

    return command.toBytes(id, buffer.data);
};
