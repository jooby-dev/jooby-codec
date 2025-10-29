/**
 * Device parameters setup command.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setParameter from 'jooby-codec/analog/commands/uplink/setParameter.js';
 *
 * // configuration for battery depassivation set successfully
 * const bytes = [0x21, 0x01];
 *
 * // decoded payload
 * const parameters = newEvent.setParameter(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     id: 33,
 *     status: 1,
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SetParameter.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {setParameter as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as deviceParameters from '../../constants/deviceParameters.js';


interface ISetParameterResponseParameters {
    /** One of the {@link deviceParameters | parameter types}. */
    id: types.TUint8;

    /**
     * `1` - parameter setup was successful <br>
     * `0` - parameter setting failed, parameter was not changed
     */
    status: types.TUint8;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = 2;

export const examples: command.TCommandExamples = {
    'activation method set successfully': {
        id,
        name,
        headerSize,
        parameters: {id: 9, status: 1},
        bytes: [
            0x03, 0x02,
            0x09, 0x01
        ]
    },
    'configuration for battery depassivation set successfully': {
        id,
        name,
        headerSize,
        parameters: {id: 33, status: 1},
        bytes: [
            0x03, 0x02,
            0x21, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetParameterResponseParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const parameters: ISetParameterResponseParameters = {
        id: buffer.getUint8(),
        status: buffer.getUint8()
    };

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return parameters;
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetParameterResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint8(parameters.id);
    buffer.setUint8(parameters.status);

    return command.toBytes(id, buffer.data);
};
