/**
 * Downlink command to read the parameter set in the sensor.
 *
 * In the body of the command, you must specify the type of the parameter.
 * In response, the sensor will transmit the current value of the requested parameter.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getParameter from 'jooby-codec/analog/commands/downlink/getParameter.js';
 *
 * const parameters = {id: 29, name: 'ABSOLUTE_DATA_MULTI_CHANNEL', data: {channel: 1}};
 * const bytes = getParameter.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [4, 2, 29, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetParameter.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    IRequestParameter,
    getRequestParameterSize,
    getRequestParameter,
    setRequestParameter
} from '../../utils/CommandBinaryBuffer.js';
import {getParameter as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'request absolute data (not multichannel device)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 23,
            name: 'ABSOLUTE_DATA',
            data: null
        },
        bytes: [
            0x04, 0x01,
            0x17
        ]
    },
    'request for state of absolute data (not multichannel device)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 24,
            name: 'ABSOLUTE_DATA_ENABLE',
            data: null
        },
        bytes: [
            0x04, 0x01,
            0x18
        ]
    },
    'request for state of absolute for multichannel device (1 channel)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 29,
            name: 'ABSOLUTE_DATA_MULTI_CHANNEL',
            data: {channel: 1}
        },
        bytes: [
            0x04, 0x02,
            0x1d, 0x00
        ]
    },
    'request for state of absolute data for multichannel device (1 channel)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 30,
            name: 'ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL',
            data: {channel: 1}
        },
        bytes: [
            0x04, 0x02,
            0x1e, 0x00
        ]
    },
    'request for configuration for specific reporting data type': {
        id,
        name,
        headerSize,
        parameters: {
            id: 49,
            name: 'REPORTING_DATA_CONFIG',
            data: {dataType: 0}
        },
        bytes: [
            0x04, 0x02,
            0x31, 0x00
        ]
    },
    'request for configuration for specific event id': {
        id,
        name,
        headerSize,
        parameters: {
            id: 50,
            name: 'EVENTS_CONFIG',
            data: {eventId: 1}
        },
        bytes: [
            0x04, 0x02,
            0x32, 0x01
        ]
    },
    'get channel settings. channel: 2': {
        id,
        name,
        headerSize,
        parameters: {
            id: 56,
            name: 'CHANNEL_TYPE',
            data: {channel: 2}
        },
        bytes: [
            0x04, 0x02,
            0x38, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IRequestParameter => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getRequestParameter(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IRequestParameter ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(getRequestParameterSize(parameters), false);

    setRequestParameter(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
