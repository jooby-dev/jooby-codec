/**
 * Uplink command to get the meter profile id and meter address for the specific meter.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMeterInfo from 'jooby-codec/obis-observer/commands/uplink/getMeterInfo.js';
 *
 * // get meter info response with meterProfileId
 * const bytes = [0x02, 0x06, 0x6d, 0x61, 0x32, 0x33, 0x37, 0x35, 0x01];
 *
 * // decoded payload
 * const parameters = getMeterInfo.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 2,
 *     meterProfileId: 1,
 *     address: 'ma2375'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterInfo.md#response)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ICommandParameters, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


/**
 * IGetMeterInfoResponseParameters command parameters
 */
interface IGetMeterInfoResponseParameters extends ICommandParameters {
    address: string,
    meterProfileId?: types.TUint8
}


const commandSize = ( parameters: IGetMeterInfoResponseParameters ): number => {
    let size = REQUEST_ID_SIZE;
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


export const id: types.TCommandId = 0x79;
export const name: types.TCommandName = 'getMeterInfo';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get meter info response without address': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 25,
            address: '',
            meterProfileId: 0
        },
        bytes: [
            0x79, 0x03,
            0x19, 0x00, 0x00
        ]
    },
    'get meter info response without meterProfileId and without address': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            address: ''
        },
        bytes: [
            0x79, 0x01,
            0x03
        ]
    },
    'get meter info response without meterProfileId 1': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 8,
            address: 'ma2',
            meterProfileId: 0x7c
        },
        bytes: [
            0x79, 0x06,
            0x08, 0x03, 0x6d, 0x61, 0x32, 0x7c
        ]
    },
    'get meter info response without meterProfileId': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 2,
            address: 'ma2375'
        },
        bytes: [
            0x79, 0x08,
            0x02, 0x06, 0x6d, 0x61, 0x32, 0x33, 0x37, 0x35
        ]
    },
    'get meter info response with meterProfileId': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 2,
            address: 'ma2375',
            meterProfileId: 1
        },
        bytes: [
            0x79, 0x09,
            0x02, 0x06, 0x6d, 0x61, 0x32, 0x33, 0x37, 0x35, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMeterInfoResponseParameters | ICommandParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const address = buffer.isEmpty ? '' : buffer.getString();

    return buffer.isEmpty
        ? {requestId, address}
        : {requestId, address, meterProfileId: buffer.getUint8()};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMeterInfoResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(commandSize(parameters));
    const {requestId, meterProfileId, address} = parameters;
    const isMeterProfileIdExist = meterProfileId || meterProfileId === 0;

    buffer.setUint8(requestId);

    if ( address.length !== 0 || isMeterProfileIdExist ) {
        buffer.setString(address);
        if ( isMeterProfileIdExist ) {
            buffer.setUint8(meterProfileId);
        }
    }

    return command.toBytes(id, buffer.data);
};
