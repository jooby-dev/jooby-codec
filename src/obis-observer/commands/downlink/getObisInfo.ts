/**
 * Downlink command to get the information for the specific OBIS ID and meter profile.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getObisInfo from 'jooby-codec/obis-observer/commands/downlink/getObisInfo.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 7,
 *     obisId: 44
 * };
 *
 * const bytes = getObisInfo.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * [70, 3, 3, 7, 44]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisInfo.md#request)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/binary/buffer.js';
import * as command from '../../utils/command.js';
import {getObisInfo as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


/**
 * IGetObisInfoParameters command parameters
 */
interface IGetObisInfoParameters extends ICommandParameters {
    meterProfileId: types.TUint8,
    obisId: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get info for obisId 44 in meter profile 7': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            meterProfileId: 7,
            obisId: 44
        },
        bytes: [
            0x46, 0x03,
            0x03, 0x07, 0x2c
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( [requestId, meterProfileId, obisId]: types.TBytes ): IGetObisInfoParameters => ({requestId, meterProfileId, obisId});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {requestId, meterProfileId, obisId}: IGetObisInfoParameters ): types.TBytes => command.toBytes(id, [requestId, meterProfileId, obisId]);
