/**
 * Downlink command to get the meter profile related information.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMeterProfile from 'jooby-codec/obis-observer/commands/downlink/getMeterProfile.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 4
 * };
 *
 * const bytes = getMeterProfile.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [102, 2, 3, 4]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterProfile.md#request)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/binary/buffer.js';
import * as command from '../../utils/command.js';
import {getMeterProfile as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


/**
 * IGetMeterProfileParameters command parameters
 */
interface IGetMeterProfileParameters extends ICommandParameters {
    meterProfileId: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get meter archive settings from meter profile 4': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            meterProfileId: 4
        },
        bytes: [
            0x66, 0x02,
            0x03, 0x04
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( [requestId, meterProfileId]: types.TBytes ): IGetMeterProfileParameters => ({requestId, meterProfileId});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {requestId, meterProfileId}: IGetMeterProfileParameters ): types.TBytes => command.toBytes(id, [requestId, meterProfileId]);
