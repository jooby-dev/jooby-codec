/**
 * Downlink command to setup the meter profile.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setupMeterProfile from 'jooby-codec/obis-observer/commands/downlink/setupMeterProfile.js';
 *
 * const parameters = {
 *     requestId: 68,
 *     meterProfileId: 8,
 *     archive1Period: 2880,
 *     archive2Period: 30
 * };
 *
 * const bytes = setupMeterProfile.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [96, 6, 68, 8, 11, 40, 0, 30]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetupMeterProfile.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    ICommandParameters, REQUEST_ID_SIZE
} from '../../utils/CommandBinaryBuffer.js';
import {setupMeterProfile as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface ISetupMeterProfileParameters extends ICommandParameters {
    meterProfileId: types.TUint8,
    archive1Period: types.TUint16,
    archive2Period: types.TUint16
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE + 1 + 2 + 2;

export const examples: command.TCommandExamples = {
    'setup meter profile with id 8': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 68,
            meterProfileId: 8,
            archive1Period: 2880,
            archive2Period: 30
        },
        bytes: [
            0x60, 0x06,
            0x44, 0x08, 0x0b, 0x40, 0x00, 0x1e
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetupMeterProfileParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();
    const meterProfileId = buffer.getUint8();
    const archive1Period = buffer.getUint16();
    const archive2Period = buffer.getUint16();

    return {
        requestId,
        meterProfileId,
        archive1Period,
        archive2Period
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetupMeterProfileParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);
    const {requestId, meterProfileId, archive1Period, archive2Period} = parameters;

    buffer.setUint8(requestId);
    buffer.setUint8(meterProfileId);
    buffer.setUint16(archive1Period);
    buffer.setUint16(archive2Period);

    return command.toBytes(id, buffer.data);
};
