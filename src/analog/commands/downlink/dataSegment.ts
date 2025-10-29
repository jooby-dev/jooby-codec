/**
 * Transfer data by breaking it into segments.
 *
 * This command is currently used only in module with hardware type MTXLora.
 * This command could be used as uplink or downlink command.
 * The module can send DataSegment command as the response to the request or without any request.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as dataSegment from 'jooby-codec/analog/commands/downlink/dataSegment.js';
 *
 * const parameters = {
 *     segmentationSessionId: 2,
 *     segmentIndex: 3,
 *     segmentsNumber: 5,
 *     isLast: false,
 *     data: [0x00, 0x01, 0x02, 0x03, 0x04]
 * };
 *
 * const bytes = dataSegment.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [30, 7, 2, 83, 0, 1, 2, 3, 4]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/DataSegment.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    IDataSegment,
    getDataSegment,
    setDataSegment
} from '../../utils/CommandBinaryBuffer.js';
import {getStringFromBytes, IBytesConversionFormatOptions} from '../../../utils/bytesConversion.js';
import {dataSegment as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_MIN_SIZE = 2;

export const examples: command.TCommandExamples = {
    'DataSegment request': {
        id,
        name,
        headerSize,
        parameters: {
            segmentationSessionId: 2,
            segmentIndex: 3,
            segmentsNumber: 5,
            isLast: false,
            data: [0x00, 0x01, 0x02, 0x03, 0x04]
        },
        bytes: [
            0x1e, 0x07,
            0x02, 0x53, 0x00, 0x01, 0x02, 0x03, 0x04
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IDataSegment => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getDataSegment(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDataSegment ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_MIN_SIZE + parameters.data.length, false);

    setDataSegment(buffer, parameters);

    return command.toBytes(id, buffer.data);
};


export const toJson = ( parameters: IDataSegment, options: IBytesConversionFormatOptions ) => (
    JSON.stringify({
        ...parameters,
        data: getStringFromBytes(parameters.data, options)
    })
);
