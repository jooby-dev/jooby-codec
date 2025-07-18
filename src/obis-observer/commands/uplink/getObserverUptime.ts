/**
 * Uplink command to get the information about device uptime.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getObserverUptime from 'jooby-codec/obis-observer/commands/uplink/getObserverUptime.js';
 *
 * // response to getObserverUptime downlink command
 * const bytes = [
 *     0x07, 0x00, 0x00, 0x0f, 0xb0
 * ];
 *
 * // decoded payload
 * const parameters = getObserverUptime.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 7,
 *     uptime: 4016
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverUptime.md#response)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getObserverUptime as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IGetObserverUptimeResponseParameters command parameters
 */
interface IGetObserverUptimeResponseParameters extends ICommandParameters {
    uptime: types.TUint32
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getObserverUptime downlink command': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 7,
            uptime: 4016
        },
        bytes: [
            0x06, 0x05,
            0x07, 0x00, 0x00, 0x0f, 0xb0
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetObserverUptimeResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        requestId: buffer.getUint8(),
        uptime: buffer.getUint32()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetObserverUptimeResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(REQUEST_ID_SIZE + 4, false);
    const {requestId, uptime} = parameters;
    buffer.setUint8(requestId);
    buffer.setUint32(uptime);

    return command.toBytes(id, buffer.data);
};
