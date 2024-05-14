/**
 * Uplink command to get the current mode (single or multi mode) of the observer device.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getObserverSingleMode from 'jooby-codec/obis-observer/commands/uplink/getObserverSingleMode.js';
 *
 * // response to getObserverSingleMode downlink command
 * const bytes = [
 *     0x07, 0x01
 * ];
 *
 * // decoded payload
 * const parameters = getObserverSingleMode.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 7,
 *     isSingleMode: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverSingleMode.md#response)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


/**
 * IGetObserverSingleModeResponseParameters command parameters
 */
interface IGetObserverSingleModeResponseParameters extends ICommandParameters {
    isSingleMode: boolean
}


export const id: types.TCommandId = 0x0e;
export const name: types.TCommandName = 'getObserverSingleMode';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getObserverSingleMode downlink command': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 7,
            isSingleMode: true
        },
        bytes: [
            0x0e, 0x02,
            0x07, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( [requestId, isSingleMode]: types.TBytes ): IGetObserverSingleModeResponseParameters => (
    {requestId, isSingleMode: isSingleMode !== 0}
);


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {requestId, isSingleMode}: IGetObserverSingleModeResponseParameters ): types.TBytes => (
    command.toBytes(id, [requestId, isSingleMode ? 1 : 0])
);
