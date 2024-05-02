/**
 * Uplink command to get firmware build date and version from device.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getBuildVersion from 'jooby-codec/mtx/commands/uplink/getBuildVersion.js';
 *
 * // build version is 2021.09.16/0.0.9
 * const bytes = [0x10, 0x09, 0x15, 0x00, 0x00, 0x09];
 *
 * // decoded payload
 * const parameters = getBuildVersion.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         date: 16,
 *         month: 9,
 *         year: 21
 *     },
 *     version: '0.0.9'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetBuildVersion.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetBuildVersionResponseParameters {
    /**
     * firmware build date
     */
    date: types.IDate,

    /**
     * firmware build version
     */
    version: string
}


export const id: types.TCommandId = 0x70;
export const name: types.TCommandName = 'getBuildVersion';
export const headerSize = 2;
export const maxSize = 6;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    '2021.09.16/0.0.9': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            date: {
                date: 16,
                month: 9,
                year: 21
            },
            version: '0.0.9'
        },
        bytes: [
            0x70, 0x06,
            0x10, 0x09, 0x15, 0x00, 0x00, 0x09
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IGetBuildVersionResponseParameters => {
    if ( bytes.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const [date, month, year, n3, n2, n1] = bytes;

    return {
        date: {
            date,
            month,
            year
        },
        version: `${n3}.${n2}.${n1}`
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetBuildVersionResponseParameters ): types.TBytes => {
    const {date, version} = parameters;
    const versionParts: Array<number> = version.split('.').map(part => parseInt(part, 10));

    return command.toBytes(id, [date.date, date.month, date.year, ...versionParts]);
};
