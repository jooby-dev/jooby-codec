/**
 * Downlink command to remove the specific OBIS from service.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as removeObis from 'jooby-codec/obis-observer/commands/downlink/removeObis.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 17,
 *     obisId: 2
 * };
 *
 * const bytes = removeObis.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [68, 3, 3, 17, 2]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveObis.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import {removeObis as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IRemoveObisParameters extends ICommandParameters {
    meterProfileId: types.TUint8,
    obisId: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'remove obis with Id 2 from meter profile with Id 17': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            meterProfileId: 17,
            obisId: 2
        },
        bytes: [
            0x44, 0x03,
            0x03, 0x11, 0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IRemoveObisParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();
    const meterProfileId = buffer.getUint8();
    const obisId = buffer.getUint8();

    return {
        requestId,
        meterProfileId,
        obisId
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IRemoveObisParameters ): types.TBytes => (
    command.toBytes(id, [parameters.requestId, parameters.meterProfileId, parameters.obisId])
);
