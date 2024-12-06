/**
 * Uplink command to get the information about memory settings.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getSettingsMemory from 'jooby-codec/obis-observer/commands/uplink/getSettingsMemory.js';
 *
 * // response to getSettingsMemory
 * const bytes = [0x02, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x02, 0x03];
 *
 * // decoded payload
 * const parameters = getSettingsMemory.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 2,
 *     settingsMemorySize: 10,
 *     offset: 2,
 *     data: [0, 1, 2, 3]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetSettingsMemory.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ICommandParameters, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import {getSettingsMemory as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetSettingsMemoryResponseParameters extends ICommandParameters {
    settingsMemorySize: types.TUint32,
    offset: types.TUint32,
    data: types.TBytes
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_WITHOUT_DATA_SIZE = REQUEST_ID_SIZE + 4 + 4;

export const examples: command.TCommandExamples = {
    'get memory response': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 2,
            settingsMemorySize: 10,
            offset: 2,
            data: [0x00, 0x01, 0x02, 0x03]
        },
        bytes: [
            0x91, 0x0d,
            0x02, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x02, 0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetSettingsMemoryResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    const requestId = buffer.getUint8();
    const settingsMemorySize = buffer.getUint32();
    const offset = buffer.getUint32();

    return {
        requestId,
        settingsMemorySize,
        offset,
        data: bytes.slice(COMMAND_BODY_WITHOUT_DATA_SIZE)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetSettingsMemoryResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_WITHOUT_DATA_SIZE);

    buffer.setUint8(parameters.requestId);
    buffer.setUint32(parameters.settingsMemorySize);
    buffer.setUint32(parameters.offset);

    return command.toBytes(id, [...buffer.data, ...parameters.data]);
};
