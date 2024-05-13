/**
 * Downlink command to get the list of the meter profile id.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMeterProfileIdList from 'jooby-codec/obis-observer/commands/downlink/getMeterProfileIdList.js';
 *
 * const parameters = {
 *     requestId: 8,
 *     index: 3
 * };
 *
 * const bytes = getMeterProfileIdList.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * [100, 2, 8, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterProfileIdList.md#request)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


/**
 * IGetMeterIdParameters command parameters
 */
interface IGetMeterProfileIdListParameters extends ICommandParameters {
    index: types.TUint8
}


export const id: types.TCommandId = 0x64;
export const name: types.TCommandName = 'getMeterProfileIdList';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get meter profile id list': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 8,
            index: 3
        },
        bytes: [
            0x64, 0x02,
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
export const fromBytes = ( [requestId, index]: types.TBytes ): IGetMeterProfileIdListParameters => ({requestId, index});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {requestId, index}: IGetMeterProfileIdListParameters ): types.TBytes => command.toBytes(id, [requestId, index]);
