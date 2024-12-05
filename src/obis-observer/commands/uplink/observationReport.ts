/**
 * The Observation Report uplink command is used for reporting by the OBIS observer.
 * The command includes the OBIS content captured according to schedule and contain float values.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as observationReport from 'jooby-codec/obis-observer/commands/uplink/observationReport.js';
 *
 * // report example
 * const bytes = [0x00, 0x00, 0x00, 0x02, 0x2d, 0x18, 0xdf, 0x80, 0x32, 0x42, 0x09, 0x51, 0xec, 0x38, 0x42, 0x35, 0x51, 0xec];
 *
 * // decoded payload
 * const parameters = observationReport.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     meterId: 2,
 *     time2000: 756604800,
 *     obisValueList: [
 *         {code: 50, content: 45.33},
 *         {code: 56, content: 34.33}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/uplink/ObservationReport.md)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer, METER_ID_SIZE, DATE_TIME_SIZE, IObisValueFloat
} from '../../utils/CommandBinaryBuffer.js';
import {TTime2000} from '../../../analog/utils/time.js';
import {observationReport as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IObservationReportParameters {
    meterId: types.TUint32,
    /** number of seconds that have elapsed since the year 2000 */
    time2000: TTime2000,
    obisValueList: Array<IObisValueFloat>
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
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
                {code: 50, content: 34.33},
                {code: 56, content: 45.33}
            ]
        },
        bytes: [
            0x53, 0x12,
            0x00, 0x00, 0x00, 0x02, 0x2d, 0x18, 0xdf, 0x80,
            0x32, 0x42, 0x09, 0x51, 0xec, 0x38, 0x42, 0x35,
            0x51, 0xec
        ]
    }
};


const getCommandSize = ( parameters: IObservationReportParameters ): number => {
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
export const fromBytes = ( bytes: types.TBytes ): IObservationReportParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const meterId = buffer.getUint32();
    const time2000 = buffer.getUint32() as TTime2000;
    const obisValueList = [];

    while ( !buffer.isEmpty ) {
        obisValueList.push(buffer.getObisValueFloat());
    }

    return {meterId, time2000, obisValueList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IObservationReportParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(getCommandSize(parameters));

    buffer.setUint32(parameters.meterId);
    buffer.setUint32(parameters.time2000);
    parameters.obisValueList.forEach(obisValue => {
        buffer.setObisValueFloat(obisValue);
    });

    return command.toBytes(id, buffer.data);
};
