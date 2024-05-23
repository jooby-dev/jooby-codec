/**
 * Downlink command to get current energy A+ by default or selected energy type for 4 tariffs (T1-T4).
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getEnergyCurrent from 'jooby-codec/mtx/commands/downlink/getEnergyCurrent.js';
 *
 * const parameters = {
 *     energyType: 1
 * };
 *
 * const bytes = getEnergyCurrent.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [15, 1, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetEnergyCurrent.md#request)
 */

import * as types from '../../types.js';
import CommandBinaryBuffer, {TEnergyType, ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetEnergyCurrentParameters {
    energyType?: TEnergyType
}


const MIN_COMMAND_SIZE = 0;
const MAX_COMMAND_SIZE = 1;


export const id: types.TCommandId = 0x0f;
export const name: types.TCommandName = 'getEnergyCurrent';
export const headerSize = 2;
export const maxSize = MAX_COMMAND_SIZE;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'get default A+ energy': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {},
        bytes: [
            0x0f, 0x00
        ]
    },
    'get A- energy': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            energyType: 2
        },
        bytes: [
            0x0f, 0x01,
            0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetEnergyCurrentParameters => {
    if ( bytes.length === MAX_COMMAND_SIZE ) {
        return {energyType: bytes[0] as TEnergyType};
    }

    // no parameters to decode
    return {};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetEnergyCurrentParameters = {} ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(parameters?.energyType ? MAX_COMMAND_SIZE : MIN_COMMAND_SIZE);

    if ( parameters?.energyType ) {
        // body
        buffer.setUint8(parameters.energyType);
    }

    return command.toBytes(id, buffer.data);
};
