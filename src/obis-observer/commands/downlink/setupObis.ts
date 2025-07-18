/**
 * Downlink command to set the OBIS ID and OBIS profile for the specific OBIS code and meter profile.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setupObis from 'jooby-codec/obis-observer/commands/downlink/setupObis.js';
 * import {contentTypes} from 'jooby-codec/obis-observer/constants/index.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 2,
 *     obisId: 240,
 *     obisProfile: {
 *         capturePeriod: 244,
 *         sendingPeriod: 132,
 *         sendingCounter: 38,
 *         flags: {
 *             contentType: contentTypes.AUTO,
 *             sendOnChange: true,
 *             archive1: false,
 *             archive2: false
 *         }
 *     },
 *     obis: {
 *         c: 0,
 *         d: 9,
 *         e: 1
 *     }
 * };
 *
 * const bytes = setupObis.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [66, 13, 3, 2, 240, 0, 244, 0, 132, 38, 4, 2, 0, 9, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetupObis.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    ICommandParameters,
    IObisProfile,
    OBIS_PROFILE_SIZE,
    IObis,
    REQUEST_ID_SIZE,
    getObisSize,
    getObisProfile,
    setObisProfile,
    getObis,
    setObis
} from '../../utils/CommandBinaryBuffer.js';
import {contentTypes} from '../../constants/index.js';
import {setupObis as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface ISetupObisParameters extends ICommandParameters {
    meterProfileId: types.TUint8,
    obisId: types.TUint8,
    obisProfile: IObisProfile,
    obis?: IObis
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'setup obisId 240 for OBIS code 0.9.1 in meter profile 2': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            meterProfileId: 2,
            obisId: 240,
            obisProfile: {
                capturePeriod: 244,
                sendingPeriod: 132,
                sendingCounter: 38,
                flags: {
                    contentType: contentTypes.AUTO,
                    sendOnChange: true,
                    archive1: false,
                    archive2: false
                }
            },
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        bytes: [
            0x42, 0x0d,
            0x03, 0x02, 0xf0, 0x00, 0xf4, 0x00, 0x84, 0x26, 0x04, 0x02, 0x00, 0x09, 0x01
        ]
    }
};


const getCommandSize = ( parameters: ISetupObisParameters ): number => {
    // request id 1 byte + meterProfileId 1 byte + obisId 1 byte + obis profile size + obis size
    let size = REQUEST_ID_SIZE + 1 + 1 + OBIS_PROFILE_SIZE;

    if ( parameters.obis ) {
        size += getObisSize(parameters.obis);
    }

    return size;
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetupObisParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();
    const meterProfileId = buffer.getUint8();
    const obisId = buffer.getUint8();
    const obisProfile = getObisProfile(buffer);

    return buffer.isEmpty
        ? {
            requestId,
            meterProfileId,
            obisId,
            obisProfile
        }
        : {
            requestId,
            meterProfileId,
            obisId,
            obisProfile,
            obis: getObis(buffer)
        };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetupObisParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(getCommandSize(parameters), false);
    const {requestId, meterProfileId, obisId, obisProfile, obis} = parameters;

    buffer.setUint8(requestId);
    buffer.setUint8(meterProfileId);
    buffer.setUint8(obisId);
    setObisProfile(buffer, obisProfile);

    if ( obis ) {
        setObis(buffer, obis);
    }

    return command.toBytes(id, buffer.data);
};
