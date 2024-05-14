/**
 * The Observation Report String uplink command is used for reporting by the OBIS observer.
 * The command includes the OBIS content captured according to schedule and contain string values.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as observationReportString from 'jooby-codec/obis-observer/commands/uplink/observationReportString.js';
 *
 * // report example
 * const bytes = [
 *     0x00, 0x00, 0x00, 0x02, 0x2d, 0x18, 0xdf, 0x80, 0x32,
 *     0x1a, 0x72, 0x65, 0x61, 0x63, 0x74, 0x69, 0x76, 0x65,
 *     0x20, 0x70, 0x6f, 0x77, 0x65, 0x72, 0x20, 0x51, 0x49,
 *     0x2c, 0x20, 0x61, 0x76, 0x65, 0x72, 0x61, 0x67, 0x65,
 *     0x38, 0x18, 0x72, 0x65, 0x61, 0x63, 0x74, 0x69, 0x76,
 *     0x65, 0x20, 0x70, 0x6f, 0x77, 0x65, 0x72, 0x20, 0x51,
 *     0x49, 0x2c, 0x20, 0x74, 0x6f, 0x74, 0x61, 0x6c
 * ];
 *
 * // decoded payload
 * const parameters = observationReportString.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     meterId: 2,
 *     time2000: 756604800,
 *     obisValueList: [
 *         {code: 50, content: 'reactive power QI, average'},
 *         {code: 56, content: 'reactive power QI, total'}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/uplink/ObservationReportString.md)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer, METER_ID_SIZE, DATE_TIME_SIZE, IObisValueString
} from '../../utils/CommandBinaryBuffer.js';
import {TTime2000} from '../../../analog/utils/time.js';


interface IObservationReportStringParameters {
    meterId: types.TUint32,
    /** number of seconds that have elapsed since the year 2000 */
    time2000: TTime2000,
    obisValueList: Array<IObisValueString>
}


export const id: types.TCommandId = 0x54;
export const name: types.TCommandName = 'observationReportString';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'observation report from 2023.12.23 00:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            meterId: 2,
            time2000: 756604800,
            obisValueList: [
                {code: 50, content: 'reactive power QI, average'},
                {code: 56, content: 'reactive power QI, total'}
            ]
        },
        bytes: [
            0x54, 0x3e,
            0x00, 0x00, 0x00, 0x02, 0x2d, 0x18, 0xdf, 0x80, 0x32, 0x1a, 0x72, 0x65, 0x61, 0x63, 0x74, 0x69, 0x76, 0x65,
            0x20, 0x70, 0x6f, 0x77, 0x65, 0x72, 0x20, 0x51, 0x49, 0x2c, 0x20, 0x61, 0x76, 0x65, 0x72, 0x61, 0x67, 0x65,
            0x38, 0x18, 0x72, 0x65, 0x61, 0x63, 0x74, 0x69, 0x76, 0x65, 0x20, 0x70, 0x6f, 0x77, 0x65, 0x72, 0x20, 0x51,
            0x49, 0x2c, 0x20, 0x74, 0x6f, 0x74, 0x61, 0x6c
        ]
    }
};


const getCommandSize = ( parameters: IObservationReportStringParameters ): number => {
    let size = METER_ID_SIZE + DATE_TIME_SIZE;

    parameters.obisValueList.forEach(obisValue => {
        size += CommandBinaryBuffer.getObisContentSize(obisValue);
    });

    return size;
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IObservationReportStringParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const meterId = buffer.getUint32();
    const time2000 = buffer.getUint32() as TTime2000;
    const obisValueList = [];

    while ( !buffer.isEmpty ) {
        obisValueList.push(buffer.getObisValueString());
    }

    return {meterId, time2000, obisValueList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IObservationReportStringParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(getCommandSize(parameters));

    buffer.setUint32(parameters.meterId);
    buffer.setUint32(parameters.time2000);
    parameters.obisValueList.forEach(obisValue => {
        buffer.setObisValueString(obisValue);
    });

    return command.toBytes(id, buffer.data);
};
