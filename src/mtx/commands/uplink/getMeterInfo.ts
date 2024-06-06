/**
 * Uplink command to get meter information.
 *
 * The corresponding downlink command: `getMeterInfo`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMeterInfo from 'jooby-codec/mtx/commands/uplink/getMeterInfo.js';
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetMeterInfo.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetMeterInfo {
    /** Integration period for load profiles */
    ten: types.TUint8;
}


export const id: types.TCommandId = 0x7a;
export const name: types.TCommandName = 'getMeterInfo';
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
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( [ten]: types.TBytes ): IGetMeterInfo => ({ten});


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( {ten}: IGetMeterInfo ): types.TBytes => command.toBytes(id, [ten]);
