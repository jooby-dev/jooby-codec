/**
 * Device parameters setup command.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setParameter from 'jooby-codec/analog/commands/uplink/setParameter.js';
 *
 * // configuration for battery depassivation set successfully
 * const bytes = [0x21, 0x01];
 *
 * // decoded payload
 * const parameters = newEvent.setParameter(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     id: 33,
 *     status: 1,
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SetParameter.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {setParameter as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as deviceParameters from '../../constants/deviceParameters.js';


interface IScheduleStatus {
    /** Schedule identifier (0-3) */
    id: types.TUint8;

    /**
     * `1` - schedule setup was successful <br>
     * `0` - schedule setting failed, all schedules would not be changed
     */
    status: types.TUint8;
}

interface ISetParameterResponseParameters {
    /** One of the {@link deviceParameters | parameter types}. */
    id: types.TUint8;

    /**
     * `1` - parameter setup was successful <br>
     * `0` - parameter setting failed, parameter was not changed
     */
    status: types.TUint8;

    /** Schedule statuses (only present when id === deviceParameters.MTX_GET_CURRENT_DEMAND_SCHEDULE_CONFIG) */
    scheduleStatuses?: Array<IScheduleStatus>;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const MAX_COMMAND_SIZE = 10;

export const examples: command.TCommandExamples = {
    'activation method set successfully': {
        id,
        name,
        headerSize,
        parameters: {id: 9, status: 1},
        bytes: [
            0x03, 0x02,
            0x09, 0x01
        ]
    },
    'configuration for battery depassivation set successfully': {
        id,
        name,
        headerSize,
        parameters: {id: 33, status: 1},
        bytes: [
            0x03, 0x02,
            0x21, 0x01
        ]
    },
    'parameter 0x40 with schedule statuses': {
        id,
        name,
        headerSize,
        parameters: {
            id: 0x40,
            status: 1,
            scheduleStatuses: [
                {id: 0, status: 1},
                {id: 1, status: 0},
                {id: 2, status: 1},
                {id: 3, status: 1}
            ]
        },
        bytes: [
            0x03, 0x0a,
            0x40, 0x01,
            0x00, 0x01,
            0x01, 0x00,
            0x02, 0x01,
            0x03, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetParameterResponseParameters => {
    if ( bytes.length > MAX_COMMAND_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const parameters: ISetParameterResponseParameters = {
        id: buffer.getUint8(),
        status: buffer.getUint8()
    };

    if (parameters.id === deviceParameters.MTX_GET_CURRENT_DEMAND_SCHEDULE_CONFIG) {
        const scheduleStatuses: Array<IScheduleStatus> = [];

        while (buffer.bytesLeft) {
            scheduleStatuses.push({
                id: buffer.getUint8(),
                status: buffer.getUint8()
            });
        }

        if (scheduleStatuses.length > 0) {
            parameters.scheduleStatuses = scheduleStatuses;
        }
    }

    if ( !buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return parameters;
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetParameterResponseParameters ): types.TBytes => {
    const maxSize = parameters.id === deviceParameters.MTX_GET_CURRENT_DEMAND_SCHEDULE_CONFIG
        // id + status + parameters.scheduleStatuses.length * scheduleStatusBytesSize
        ? 2 + parameters.scheduleStatuses.length * 2
        // id + status
        : 2;

    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    buffer.setUint8(parameters.id);
    buffer.setUint8(parameters.status);

    if (parameters.scheduleStatuses) {
        for (const scheduleStatus of parameters.scheduleStatuses) {
            buffer.setUint8(scheduleStatus.id);
            buffer.setUint8(scheduleStatus.status);
        }
    }

    return command.toBytes(id, buffer.data);
};
