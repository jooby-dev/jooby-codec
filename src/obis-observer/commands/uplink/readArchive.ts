/**
 * Uplink command to get the meter archive data.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as readArchive from 'jooby-codec/obis-observer/commands/uplink/readArchive.js';
 *
 * // response to readArchive downlink command
 * const bytes = [
 *     0x0c, 0x01, 0x00, 0x00, 0x00, 0x01, 0x1b, 0xb4, 0x0c, 0x60, 0x08, 0x3e, 0xcc, 0xcc, 0xcd,
 *     0x00, 0x00, 0x00, 0x00, 0x02, 0x1b, 0xb4, 0x0c, 0x20, 0x08, 0x3e, 0x4c, 0xcc, 0xcd
 * ];
 *
 * // decoded payload
 * const parameters = readArchive.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 12,
 *     isCompleted: true,
 *     content: [
 *         {
 *             meterId: 1,
 *             time2000: 464784480,
 *             obisValueList: [{code: 8, content: 0.40}]
 *         },
 *         {
 *             meterId: 2,
 *             time2000: 464784416,
 *             obisValueList: [{code: 8, content: 0.20}]
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadArchive.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {
    ICommandParameters,
    REQUEST_ID_SIZE,
    METER_ID_SIZE,
    IObisValueFloat,
    DATE_TIME_SIZE,
    setObisValueFloat
} from '../../utils/binary/buffer.js';
import {TTime2000} from '../../../analog/utils/time.js';
import roundNumber from '../../../utils/roundNumber.js';
import {readArchive as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IArchiveRecord {
    meterId: number,
    time2000: TTime2000,
    obisValueList: Array<IObisValueFloat>
}

interface IReadArchiveResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    content: Array<IArchiveRecord>
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to ReadArchive from 2023-12-23 04:00:00 GMT for meter 4': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 12,
            isCompleted: true,
            content: [
                {
                    meterId: 1,
                    time2000: 464784480,
                    obisValueList: [{code: 8, content: 0.4}]
                },
                {
                    meterId: 2,
                    time2000: 464784416,
                    obisValueList: [{code: 8, content: 0.2}]
                }
            ]
        },
        bytes: [
            0x16, 0x1d,
            0x0c, 0x01, 0x00, 0x00, 0x00, 0x01, 0x1b, 0xb4, 0x0c, 0x60, 0x08, 0x3e, 0xcc, 0xcc, 0xcd,
            0x00, 0x00, 0x00, 0x00, 0x02, 0x1b, 0xb4, 0x0c, 0x20, 0x08, 0x3e, 0x4c, 0xcc, 0xcd
        ]
    },
    'response to ReadArchive without data': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 34,
            isCompleted: true,
            content: []
        },
        bytes: [
            0x16, 0x02,
            0x22, 0x01
        ]
    }
};

const getCommandSize = ( parameters: IReadArchiveResponseParameters ): number => {
    let size = REQUEST_ID_SIZE + 1;
    let datesInContent = 0;

    for ( let it = 0; it < parameters.content.length; ++it ) {
        const obisValues = parameters.content[it].obisValueList;

        if ( obisValues.length !== 0 ) {
            // meterId + date
            size += METER_ID_SIZE + DATE_TIME_SIZE;
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
export const fromBytes = ( bytes: types.TBytes ): IReadArchiveResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();
    const isCompleted = buffer.getUint8() !== 0;
    const content: Array<IArchiveRecord> = [];

    while ( !buffer.isEmpty ) {
        const record: IArchiveRecord = {
            meterId: buffer.getUint32(),
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
export const toBytes = ( parameters: IReadArchiveResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(getCommandSize(parameters), false);
    const {content} = parameters;

    buffer.setUint8(parameters.requestId);
    buffer.setUint8(parameters.isCompleted ? 1 : 0);

    for ( let it = 0; it < content.length; ++it ) {
        if ( it !== 0 ) {
            // end of date flag
            buffer.setUint8(0);
        }

        const {meterId, time2000, obisValueList} = content[it];

        buffer.setUint32(meterId);
        buffer.setUint32(time2000);
        obisValueList.forEach(obisValue => {
            setObisValueFloat(buffer, obisValue);
        });
    }

    return command.toBytes(id, buffer.data);
};
