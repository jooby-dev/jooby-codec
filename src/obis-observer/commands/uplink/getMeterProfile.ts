/**
 * Uplink command to get the meter profile related information.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMeterProfile from 'jooby-codec/obis-observer/commands/uplink/getMeterProfile.js';
 *
 * // response to getMeterProfile
 * const bytes = [0x03, 0x02, 0x58, 0x00, 0x2d];
 *
 * // decoded payload
 * const parameters = getMeterProfile.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 3,
 *     archive1Period: 600,
 *     archive2Period: 45
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetArchiveProfile.md#response)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getMeterProfile as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IGetArchiveProfileResponseParameters command parameters
 */
interface IGetMeterProfileResponseParameters extends ICommandParameters {
    archive1Period: types.TUint16,
    archive2Period: types.TUint16
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getMeterProfile': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            archive1Period: 600,
            archive2Period: 45
        },
        bytes: [
            0x67, 0x05,
            0x03, 0x02, 0x58, 0x00, 0x2d
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMeterProfileResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        requestId: buffer.getUint8(),
        archive1Period: buffer.getUint16(),
        archive2Period: buffer.getUint16()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMeterProfileResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(REQUEST_ID_SIZE + 4, false);

    buffer.setUint8(parameters.requestId);
    buffer.setUint16(parameters.archive1Period);
    buffer.setUint16(parameters.archive2Period);

    return command.toBytes(id, buffer.data);
};
