/**
 * Uplink command to get the meter archive data.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as readMeterArchive from 'jooby-codec/obis-observer/commands/uplink/readMeterArchive.js';
 *
 * // response to readMeterArchive downlink command
 * const bytes = [0x0c, 0x01, 0x1b, 0xb4, 0x0c, 0x60, 0x08, 0x3e, 0xcc, 0xcc, 0xcd, 0x00, 0x1b, 0xb4, 0x0c, 0x20, 0x08, 0x3e, 0x4c, 0xcc, 0xcd];
 *
 * // decoded payload
 * const parameters = readMeterArchive.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 12,
 *     isCompleted: true,
 *     content: [
 *         {
 *             time2000: 464784480,
 *             obisValueList: [{code: 8, content: 0.40}]
 *         },
 *         {
 *             time2000: 464784416,
 *             obisValueList: [{code: 8, content: 0.20}]
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadMeterArchive.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer, ICommandParameters, REQUEST_ID_SIZE, IObisValueFloat, DATE_TIME_SIZE
} from '../../utils/CommandBinaryBuffer.js';
import {TTime2000} from '../../../analog/utils/time.js';
import roundNumber from '../../../utils/roundNumber.js';
import {readMeterArchive as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IArchiveRecord {
    time2000: TTime2000,
    obisValueList: Array<IObisValueFloat>
}

interface IReadMeterArchiveResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    content: Array<IArchiveRecord>
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to ReadMeterArchive from 2023-12-23 04:00:00 GMT for meter 4': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 12,
            isCompleted: true,
            content: [
                {
                    time2000: 464784480,
                    obisValueList: [{code: 8, content: 0.4}]
                },
                {
                    time2000: 464784416,
                    obisValueList: [{code: 8, content: 0.2}]
                }
            ]
        },
        bytes: [
            0x12, 0x15,
            0x0c, 0x01, 0x1b, 0xb4, 0x0c, 0x60, 0x08, 0x3e, 0xcc, 0xcc, 0xcd, 0x00, 0x1b, 0xb4, 0x0c, 0x20, 0x08, 0x3e, 0x4c, 0xcc, 0xcd
        ]
    },
    'response to ReadMeterArchive without data': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 34,
            isCompleted: true,
            content: []
        },
        bytes: [
            0x12, 0x02,
            0x22, 0x01
        ]
    }
};

const getCommandSize = ( parameters: IReadMeterArchiveResponseParameters ): number => {
    let size = REQUEST_ID_SIZE + 1;
    let datesInContent = 0;

    for ( let it = 0; it < parameters.content.length; ++it ) {
        const obisValues = parameters.content[it].obisValueList;

        if ( obisValues.length !== 0 ) {
            size += DATE_TIME_SIZE;
            // 1 byte obis id + 4 byte float value for each obis value
            size += (1 + 4) * obisValues.length;

            datesInContent++;
        }
    }

    if ( datesInContent !== 0 ) {
        // 1 byte for each date except the last - date end flag
        size += datesInContent - 1;
    }

    return size;
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IReadMeterArchiveResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const isCompleted = buffer.getUint8() !== 0;
    const content: Array<IArchiveRecord> = [];

    while ( !buffer.isEmpty ) {
        const record: IArchiveRecord = {
            time2000: buffer.getUint32() as TTime2000,
            obisValueList: []
        };

        while ( !buffer.isEmpty ) {
            const code = buffer.getUint8();

            if ( code === 0 ) {
                break;
            }

            record.obisValueList.push({code, content: roundNumber(buffer.getFloat32())});
        }

        content.push(record);
    }

    return {requestId, isCompleted, content};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IReadMeterArchiveResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(getCommandSize(parameters));
    const {content} = parameters;

    buffer.setUint8(parameters.requestId);
    buffer.setUint8(parameters.isCompleted ? 1 : 0);

    for ( let it = 0; it < content.length; ++it ) {
        if ( it !== 0 ) {
            // end of date flag
            buffer.setUint8(0);
        }

        const {time2000, obisValueList} = content[it];

        buffer.setUint32(time2000);
        obisValueList.forEach(obisValue => {
            buffer.setObisValueFloat(obisValue);
        });
    }

    return command.toBytes(id, buffer.data);
};
