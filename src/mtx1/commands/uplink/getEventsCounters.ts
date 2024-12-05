/**
 * Uplink command to get events counters.
 *
 * The corresponding downlink command: `getEventsCounters`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getEventsCounters from 'jooby-codec/mtx1/commands/uplink/getEventsCounters.js';
 *
 * // response to getEventsCounters downlink command
 * const bytes = [0x00, 0x48, 0x00, 0x42, 0x01, 0x56, 0x00, 0x4d, 0x00, 0x22, 0x00, 0x16, 0x01, 0x2a];
 *
 * // decoded payload
 * const parameters = getEventsCounters.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     accessClosed: 22,
 *     accessError: 34,
 *     localParametersChange: 342,
 *     remoteParametersChange: 77,
 *     powerOff: 66,
 *     restart: 72,
 *     setClock: 298
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetEventsCounters.md#response)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import * as accessLevels from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import {getEventsCounters as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetEventsCountersResponseParameters {
    accessClosed: types.TUint16,
    accessError: types.TUint16,
    localParametersChange: types.TUint16,
    remoteParametersChange: types.TUint16,
    powerOff: types.TUint16,
    restart: types.TUint16,
    setClock: types.TUint16
}


const COMMAND_BODY_SIZE = 14;
const OLD_COMMAND_BODY_SIZE = 20;

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = accessLevels.READ_ONLY;
export const maxSize = OLD_COMMAND_BODY_SIZE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            accessClosed: 22,
            accessError: 34,
            localParametersChange: 342,
            remoteParametersChange: 77,
            powerOff: 66,
            restart: 72,
            setClock: 298
        },
        bytes: [
            0x34, 0x0e,
            0x00, 0x48, 0x00, 0x42, 0x01, 0x56, 0x00, 0x4d, 0x00, 0x22, 0x00, 0x16, 0x01, 0x2a
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IGetEventsCountersResponseParameters => {
    if ( (bytes.length !== COMMAND_BODY_SIZE && bytes.length !== OLD_COMMAND_BODY_SIZE) ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const restart = buffer.getUint16();
    const powerOff = buffer.getUint16();
    const localParametersChange = buffer.getUint16();
    const remoteParametersChange = buffer.getUint16();
    const accessError = buffer.getUint16();
    const accessClosed = buffer.getUint16();
    const setClock = buffer.getUint16();

    return {
        accessClosed, accessError, localParametersChange, remoteParametersChange, powerOff, restart, setClock
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetEventsCountersResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

    // body
    buffer.setUint16(parameters.restart);
    buffer.setUint16(parameters.powerOff);
    buffer.setUint16(parameters.localParametersChange);
    buffer.setUint16(parameters.remoteParametersChange);
    buffer.setUint16(parameters.accessError);
    buffer.setUint16(parameters.accessClosed);
    buffer.setUint16(parameters.setClock);

    return command.toBytes(id, buffer.data);
};
