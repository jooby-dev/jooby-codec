/**
 * Uplink command to get meter information.
 *
 * The corresponding downlink command: `getMeterInfo`.
 *
 * Supported in MTX1 and MTX3 (since `13.05.24.0.0.15`) devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMeterInfo from 'jooby-codec/mtx1/commands/uplink/getMeterInfo.js';
 *
 * // simple response
 * const bytes = [0x00];
 *
 * // decoded payload
 * const parameters = getMeterInfo.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {ten: 0}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetMeterInfo.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {IOperatorParameters} from '../../utils/CommandBinaryBuffer.js';
import {getMeterInfo as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetMeterInfoParameters {
    /** Integration period for load profiles (also present in {@link IOperatorParameters}) */
    ten: types.TUint8;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 1;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {ten: 0},
        bytes: [
            0x7a, 0x01,
            0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( [ten]: types.TBytes ): IGetMeterInfoParameters => ({ten});


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( {ten}: IGetMeterInfoParameters ): types.TBytes => command.toBytes(id, [ten]);
