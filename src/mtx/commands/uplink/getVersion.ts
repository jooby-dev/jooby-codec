/**
 * Uplink command to get device version information.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getVersion from 'jooby-codec/mtx/commands/uplink/getVersion.js';
 *
 * // default parameters
 * const bytes = [0x31, 0x30, 0x34, 0x2e, 0x32, 0x35, 0x2e, 0x30, 0x30, 0x33];
 *
 * // decoded payload
 * const parameters = getVersion.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     version: '104.25.003'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetVersion.md#response)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetVersionResponseParameters {
    /**
     * Device version.
     *
     * @example
     * '104.25.003'
     */
    version: string
}


export const id: types.TCommandId = 0x28;
export const name: types.TCommandName = 'getVersion';
export const headerSize = 2;
export const maxSize = 10;
export const accessLevel: types.TAccessLevel = READ_ONLY;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            version: '104.25.003'
        },
        bytes: [
            0x28, 0x0a,
            0x31, 0x30, 0x34, 0x2e, 0x32, 0x35, 0x2e, 0x30, 0x30, 0x33
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetVersionResponseParameters => ({version: String.fromCharCode.apply(null, [...bytes])});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetVersionResponseParameters ): types.TBytes => {
    const version = parameters.version.split('').map(char => char.charCodeAt(0));

    return command.toBytes(id, version);
};
