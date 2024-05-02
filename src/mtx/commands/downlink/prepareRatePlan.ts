/**
 * Downlink command to prepare device for rate plan application.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as prepareRatePlan from 'jooby-codec/mtx/commands/downlink/prepareRatePlan.js';
 *
 * const parameters = {
 *     tariffTable: 0,
 *     id: 987654321
 * };
 * const bytes = prepareRatePlan.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [20, 5, 0, 58, 222, 104, 177]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/PrepareRatePlan.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


interface IPrepareRatePlanParameters {
    /**
     * tariff table identifier
     * (`0` - table `A+`, `1` – table `A-`)
     */
    tariffTable: types.TUint8;
    /**
     * Rate plan unique identifier.
     */
    id: types.TUint32;
}


export const id: types.TCommandId = 0x14;
export const name: types.TCommandName = 'prepareRatePlan';
export const headerSize = 2;
export const maxSize = 5;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'prepare rate plan request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            tariffTable: 0,
            id: 987654321
        },
        bytes: [
            0x14, 0x05,
            0x00, 0x3a, 0xde, 0x68, 0xb1
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IPrepareRatePlanParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        tariffTable: buffer.getUint8(),
        id: buffer.getUint32()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IPrepareRatePlanParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setUint8(parameters.tariffTable);
    buffer.setUint32(parameters.id);

    return command.toBytes(id, buffer.data);
};
