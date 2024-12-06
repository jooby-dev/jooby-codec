/**
 * Downlink command to get the OBIS id list for the specific meter profile.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getObisIdList from 'jooby-codec/obis-observer/commands/downlink/getObisIdList.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 5,
 *     index: 0
 * };
 *
 * const bytes = getObisIdList.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * [64, 3, 3, 5, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisIdList.md#request)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getObisIdList as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


/**
 * IGetObisIdListParameters command parameters
 */
interface IGetObisIdListParameters extends ICommandParameters {
    meterProfileId: types.TUint8,
    index: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get obisId list': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            meterProfileId: 5,
            index: 0
        },
        bytes: [
            0x40, 0x03,
            0x03, 0x05, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( [requestId, meterProfileId, index]: types.TBytes ): IGetObisIdListParameters => ({requestId, meterProfileId, index});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {requestId, meterProfileId, index}: IGetObisIdListParameters ): types.TBytes => command.toBytes(id, [requestId, meterProfileId, index]);
