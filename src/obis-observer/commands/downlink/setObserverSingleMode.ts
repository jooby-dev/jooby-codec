/**
 * Downlink command to set the single or multi mode of the observer device.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setObserverSingleMode from 'jooby-codec/obis-observer/commands/downlink/setObserverSingleMode.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     singleMode: true
 * };
 *
 * const bytes = setObserverSingleMode.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [11, 2, 3, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetObserverSingleMode.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/binary/buffer.js';
import {setObserverSingleMode as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface ISetObserverSingleModeParameters extends ICommandParameters {
    singleMode: boolean
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE + 1;

export const examples: command.TCommandExamples = {
    'set observer single mode': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            singleMode: true
        },
        bytes: [
            0x0b, 0x02,
            0x03, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetObserverSingleModeParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();
    const singleMode = buffer.getUint8() !== 0;

    return {requestId, singleMode};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetObserverSingleModeParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);
    const {requestId, singleMode} = parameters;

    buffer.setUint8(requestId);
    buffer.setUint8(singleMode ? 1 : 0);

    return command.toBytes(id, buffer.data);
};
