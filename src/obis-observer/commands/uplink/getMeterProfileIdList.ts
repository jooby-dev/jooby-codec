/**
 * Uplink command to get the list of the meter profile id.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMeterProfileIdList from 'jooby-codec/obis-observer/commands/uplink/getMeterProfileIdList.js';
 *
 * // response to getMeterProfileIdList with two meterProfileId
 * const bytes = [0x05, 0x01, 0x01, 0x02];
 *
 * // decoded payload
 * const parameters = getMeterProfileIdList.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 5,
 *     isCompleted: true,
 *     meterProfileIdList: [1, 2]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterProfileIdList.md#response)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/binary/buffer.js';
import * as command from '../../utils/command.js';
import {getMeterProfileIdList as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IGetMeterProfileIdListResponseParameters command parameters
 */
interface IGetMeterProfileIdListResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    meterProfileIdList: Array<types.TUint8>
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to GetMeterProfileIdList with two meterProfileId': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 5,
            isCompleted: true,
            meterProfileIdList: [1, 2]
        },
        bytes: [
            0x65, 0x04,
            0x05, 0x01, 0x01, 0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMeterProfileIdListResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();
    const isCompleted = buffer.isEmpty ? 1 : buffer.getUint8();
    const meterProfileIdList = buffer.isEmpty
        ? []
        : [...new Array<types.TUint8>(buffer.bytesLeft)].map(() => buffer.getUint8());

    return {requestId, isCompleted: isCompleted !== 0, meterProfileIdList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMeterProfileIdListResponseParameters ): types.TBytes => {
    // body size = request id byte + isCompleted byte + meterProfileIdList 0-n bytes
    const size = REQUEST_ID_SIZE + 1 + parameters.meterProfileIdList.length;
    const buffer: IBinaryBuffer = new BinaryBuffer(size, false);
    const {requestId, isCompleted, meterProfileIdList} = parameters;

    buffer.setUint8(requestId);
    buffer.setUint8(isCompleted ? 1 : 0);
    meterProfileIdList.forEach(meterProfileId => buffer.setUint8(meterProfileId));

    return command.toBytes(id, buffer.data);
};
