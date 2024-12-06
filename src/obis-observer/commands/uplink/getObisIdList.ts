/**
 * Uplink command to get the OBIS id list for the specific meter profile.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getObisIdList from 'jooby-codec/obis-observer/commands/uplink/getObisIdList.js';
 *
 * // response to getObisIdList downlink command
 * const bytes = [0x03, 0x01, 0xc5, 0xc6];
 *
 * // decoded payload
 * const parameters = getObisIdList.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 3,
 *     isCompleted: true,
 *     obisIdList: [197, 198]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisIdList.md#response)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandParameters, ICommandBinaryBuffer, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getObisIdList as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IGetObisIdListResponseParameters command parameters
 */
interface IGetObisIdListResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    obisIdList: Array<types.TUint8>
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getObisIdList with two elements': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            isCompleted: true,
            obisIdList: [197, 198]
        },
        bytes: [
            0x41, 0x04,
            0x03, 0x01, 0xc5, 0xc6
        ]
    },
    'response to getObisIdList without elements': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            isCompleted: true,
            obisIdList: []
        },
        bytes: [
            0x41, 0x02,
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
export const fromBytes = ( bytes: types.TBytes ): IGetObisIdListResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const isCompleted = buffer.isEmpty ? 1 : buffer.getUint8();
    const obisIdList = buffer.isEmpty
        ? []
        : [...new Array<types.TUint8>(buffer.bytesLeft)].map(() => buffer.getUint8());

    return {requestId, isCompleted: isCompleted !== 0, obisIdList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetObisIdListResponseParameters ): types.TBytes => {
    const size = REQUEST_ID_SIZE + 1 + parameters.obisIdList.length;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);
    const {requestId, isCompleted, obisIdList} = parameters;

    buffer.setUint8(requestId);
    buffer.setUint8(isCompleted ? 1 : 0);
    obisIdList.forEach(obisId => buffer.setUint8(obisId));

    return command.toBytes(id, buffer.data);
};
