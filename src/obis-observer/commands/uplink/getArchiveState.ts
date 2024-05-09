/**
 * Uplink command.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getArchiveState from 'jooby-codec/obis-observer/commands/uplink/getArchiveState.js';
 *
 * // response to getArchiveState. 81 records from 2023.06.27 18:45:02 GMT to 2023.06.28 15:15:02 GMT
 * const bytes = [0x02, 0x00, 0x00, 0x00, 0x51, 0x2c, 0x2d, 0xea, 0xae, 0x2c, 0x2f, 0x0a, 0xf6];
 *
 * // decoded payload
 * const parameters = getArchiveState.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 2,
 *     archiveRecordsNumber: 81,
 *     eldestTime2000: 741206702,
 *     newestTime2000: 741280502
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetArchiveState.md#response)
 */

import * as types from '../../../types.js';
import {TTime2000} from '../../../analog/utils/time.js';
import CommandBinaryBuffer, {ICommandParameters, ICommandBinaryBuffer, DATE_TIME_SIZE, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


/**
 * IGetArchiveStateResponseParameters command parameters
 */
interface IGetArchiveStateResponseParameters extends ICommandParameters {
    archiveRecordsNumber: types.TUint32,
    eldestTime2000: TTime2000,
    newestTime2000: TTime2000
}


// request id byte + records count + DateTime 4 bytes * 2
const COMMAND_SIZE = REQUEST_ID_SIZE + 4 + DATE_TIME_SIZE * 2;

const isValidParameterSet = ( parameters: IGetArchiveStateResponseParameters | ICommandParameters ): boolean => {
    const {requestId, archiveRecordsNumber, eldestTime2000, newestTime2000} = parameters as IGetArchiveStateResponseParameters;

    return requestId !== undefined
        && archiveRecordsNumber !== undefined
        && eldestTime2000 !== undefined
        && newestTime2000 !== undefined;
};


export const id: types.TCommandId = 0x10;
export const name: types.TCommandName = 'getArchiveState';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getArchiveState. no archive records': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 2,
            archiveRecordsNumber: 0,
            eldestTime2000: 0,
            newestTime2000: 0
        },
        bytes: [
            0x10, 0x0d,
            0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]
    },
    'response to getArchiveState. 81 records from 2023.06.27 18:45:02 GMT to 2023.06.28 15:15:02 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 2,
            archiveRecordsNumber: 81,
            eldestTime2000: 741206702,
            newestTime2000: 741280502
        },
        bytes: [
            0x10, 0x0d,
            0x02, 0x00, 0x00, 0x00, 0x51, 0x2c, 0x2d, 0xea, 0xae, 0x2c, 0x2f, 0x0a, 0xf6
        ]
    },
    'response to getArchiveState without data': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 2
        },
        bytes: [
            0x10, 0x01,
            0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetArchiveStateResponseParameters | ICommandParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();

    return buffer.isEmpty
        ? {requestId}
        : {
            requestId,
            archiveRecordsNumber: buffer.getUint32(),
            eldestTime2000: buffer.getUint32(),
            newestTime2000: buffer.getUint32()
        };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetArchiveStateResponseParameters ): types.TBytes => {
    if ( !isValidParameterSet(parameters) ) {
        return command.toBytes(id, [parameters.requestId]);
    }

    const size = isValidParameterSet(parameters) ? COMMAND_SIZE : REQUEST_ID_SIZE;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);
    const {requestId, archiveRecordsNumber, eldestTime2000, newestTime2000} = parameters;

    buffer.setUint8(requestId);
    buffer.setUint32(archiveRecordsNumber);

    if ( !buffer.isEmpty ) {
        buffer.setUint32(eldestTime2000);
        buffer.setUint32(newestTime2000);
    }

    return command.toBytes(id, buffer.data);
};
