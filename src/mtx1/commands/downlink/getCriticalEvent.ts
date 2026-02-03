/**
 * Downlink command to get critical events.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getCriticalEvent from 'jooby-codec/mtx1/commands/downlink/getCriticalEvent.js';
 *
 * const parameters = {
 *     event: 1,
 *     name: 'MAGNETIC_ON',
 *     index: 2
 * };
 *
 * const bytes = getCriticalEvent.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [65, 2, 1, 2]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetCriticalEvent.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as criticalEvents from '../../constants/criticalEvents.js';
import criticalEventNames from '../../constants/criticalEventNames.js';
import {getCriticalEvent as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetCriticalEventParameters {
    /**
     * Event identifier.
     *
     * ({@link criticalEvents | critical event identifiers})
     */
    event: types.TUint8,

    name?: string,

    /**
     * Offset of the event in the critical events list.
     *
     * `0..7`, `255` - the last critical event
     */
    index: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 2;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            event: 1,
            name: 'MAGNETIC_ON',
            index: 2
        },
        bytes: [
            0x41, 0x02,
            0x01, 0x02
        ]
    },
    'the last event': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            event: 4,
            name: 'RESTART',
            index: 255
        },
        bytes: [
            0x41, 0x02,
            0x04, 0xff
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetCriticalEventParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const [event, index] = bytes;

    return {
        event,
        name: criticalEventNames[event],
        index
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetCriticalEventParameters ) : types.TBytes => (
    command.toBytes(id, [parameters.event, parameters.index])
);
