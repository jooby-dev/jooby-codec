/**
 * Uplink command to get the meter archive data for the specific date.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as readMeterArchiveWithDate from 'jooby-codec/obis-observer/commands/uplink/readMeterArchiveWithDate.js';
 *
 * // response to readMeterArchiveWithDate downlink command
 * const bytes = [0x0c, 0x01, 0x0c, 0x01, 0x08, 0x40, 0x66, 0x66];
 *
 * // decoded payload
 * const parameters = readMeterArchiveWithDate.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 12,
 *     isCompleted: true,
 *     obisValueList: [{code: 8, content: 3.6}]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadMeterArchiveWithDate.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {
    ICommandParameters,
    REQUEST_ID_SIZE,
    IObisValueFloat,
    getObisContentSize,
    getObisValueFloat,
    setObisValueFloat
} from '../../utils/binary/buffer.js';
import {readMeterArchiveWithDate as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IReadMeterArchiveWithDateResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    obisValueList: Array<IObisValueFloat>
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to ReadMeterArchiveWithDate from 2023-12-23 04:00:00 GMT for meter 4': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 12,
            isCompleted: true,
            obisValueList: [{code: 8, content: 3.6}]
        },
        bytes: [
            0x14, 0x07,
            0x0c, 0x01, 0x08, 0x40, 0x66, 0x66, 0x66
        ]
    },
    'response to ReadMeterArchiveWithDate without data': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 34,
            isCompleted: true,
            obisValueList: []
        },
        bytes: [
            0x14, 0x02,
            0x22, 0x01
        ]
    }
};


const getCommandSize = ( parameters: IReadMeterArchiveWithDateResponseParameters ): number => {
    let size = REQUEST_ID_SIZE + 1;

    // + obis values list list of code 1 byte with float content 4 bytes
    parameters.obisValueList.forEach(obisId => {
        size += getObisContentSize(obisId);
    });

    return size;
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IReadMeterArchiveWithDateResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();
    const isCompleted = buffer.isEmpty ? true : buffer.getUint8() !== 0;
    const obisValueList: Array<IObisValueFloat> = [];

    while ( !buffer.isEmpty ) {
        obisValueList.push(getObisValueFloat(buffer));
    }

    return {requestId, isCompleted, obisValueList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IReadMeterArchiveWithDateResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(getCommandSize(parameters), false);

    buffer.setUint8(parameters.requestId);
    buffer.setUint8(parameters.isCompleted ? 1 : 0);

    parameters.obisValueList.forEach(obisValue => {
        setObisValueFloat(buffer, obisValue);
    });

    return command.toBytes(id, buffer.data);
};
