/**
 * Uplink command to get the list of meters id.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMeterIdList from 'jooby-codec/obis-observer/commands/uplink/getMeterIdList.js';
 *
 * // response to getMeterIdList with two meterId
 * const bytes = [0x04, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02];
 *
 * // decoded payload
 * const parameters = getMeterIdList.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 4,
 *     isCompleted: true,
 *     meterIdList: [1, 2]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterIdList.md#response)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {ICommandParameters, REQUEST_ID_SIZE, METER_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getMeterIdList as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IGetMeterIdListResponseParameters command parameters
 */
interface IGetMeterIdListResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    meterIdList: Array<types.TUint32>
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getMeterIdList with two meterId': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 4,
            isCompleted: true,
            meterIdList: [1, 2]
        },
        bytes: [
            0x75, 0x0a,
            0x04, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMeterIdListResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();
    const isCompleted = buffer.isEmpty ? 1 : buffer.getUint8();
    const meterIdList = buffer.isEmpty
        ? []
        : [...new Array<types.TUint32>(buffer.bytesLeft / METER_ID_SIZE)].map(() => buffer.getUint32());

    return {requestId, isCompleted: isCompleted !== 0, meterIdList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMeterIdListResponseParameters ): types.TBytes => {
    const {requestId, isCompleted, meterIdList} = parameters;
    // body size = request id byte + isCompleted byte + meterIdList 0-n bytes
    const size = REQUEST_ID_SIZE + 1 + parameters.meterIdList.length * METER_ID_SIZE;
    const buffer: IBinaryBuffer = new BinaryBuffer(size, false);

    buffer.setUint8(requestId);
    buffer.setUint8(isCompleted ? 1 : 0);
    meterIdList.forEach(meterId => buffer.setUint32(meterId));

    return command.toBytes(id, buffer.data);
};
