/**
 * Downlink command to get the list of meters id.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMeterIdList from 'jooby-codec/obis-observer/commands/downlink/getMeterIdList.js';
 *
 * const parameters = {
 *     requestId: 8,
 *     index: 3
 * };
 *
 * const bytes = getMeterIdList.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * [116, 2, 8, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterIdList.md#request)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/binary/buffer.js';
import * as command from '../../utils/command.js';
import {getMeterIdList as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


/**
 * IGetMeterIdParameters command parameters
 */
interface IGetMeterIdListParameters extends ICommandParameters {
    index: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get meter id list': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 8,
            index: 3
        },
        bytes: [
            0x74, 0x02,
            0x08, 0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( [requestId, index]: types.TBytes ): IGetMeterIdListParameters => ({requestId, index});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {requestId, index}: IGetMeterIdListParameters ): types.TBytes => command.toBytes(id, [requestId, index]);
