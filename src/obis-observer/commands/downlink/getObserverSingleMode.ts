/**
 * Downlink command to get the current mode (single or multi mode) of the observer device.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getObserverSingleMode from 'jooby-codec/obis-observer/commands/downlink/getObserverSingleMode.js';
 *
 * const parameters = {
 *     requestId: 7
 * };
 *
 * const bytes = getObserverSingleMode.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * [13, 1, 7]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverSingleMode.md#request)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/binary/buffer.js';
import * as command from '../../utils/command.js';
import {getObserverSingleMode as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 7
        },
        bytes: [
            0x0d, 0x01,
            0x07
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( [requestId]: types.TBytes ): ICommandParameters => ({requestId});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {requestId}: ICommandParameters ): types.TBytes => command.toBytes(id, [requestId]);
