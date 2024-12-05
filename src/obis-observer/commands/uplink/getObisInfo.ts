/**
 * Uplink command to get the information for the specific OBIS ID and meter profile.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getObisInfo from 'jooby-codec/obis-observer/commands/uplink/getObisInfo.js';
 *
 * // response to getObisInfo with obis code 0.9.1 and obis profile
 * const bytes = [0x03, 0x02, 0x00, 0x09, 0x01, 0x01, 0x58, 0x02, 0x14, 0x3d, 0x15];
 *
 * // decoded payload
 * const parameters = getObisInfo.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 3,
 *     obis: {
 *         c: 0,
 *         d: 9,
 *         e: 1
 *     },
 *     obisProfile: {
 *         capturePeriod: 344,
 *         sendingPeriod: 532,
 *         sendingCounter: 61,
 *         flags: {
 *             contentType: 2,
 *             sendOnChange: true,
 *             archive1: true,
 *             archive2: false
 *         }
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisInfo.md#response)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {
    ICommandParameters,
    ICommandBinaryBuffer,
    REQUEST_ID_SIZE,
    OBIS_PROFILE_SIZE,
    IObis,
    IObisProfile
} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {contentTypes} from '../../constants/index.js';
import {getObisInfo as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IGetObisInfoResponseParameters command parameters
 */
interface IGetObisInfoResponseParameters extends ICommandParameters {
    obis?: IObis,
    obisProfile?: IObisProfile,
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getObisInfo with obis code 0.9.1 and obis profile': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            obis: {
                c: 0,
                d: 9,
                e: 1
            },
            obisProfile: {
                capturePeriod: 344,
                sendingPeriod: 532,
                sendingCounter: 61,
                flags: {
                    contentType: contentTypes.STRING,
                    sendOnChange: true,
                    archive1: true,
                    archive2: false
                }
            }
        },
        bytes: [
            0x47, 0x0b,
            0x03, 0x02, 0x00, 0x09, 0x01, 0x01, 0x58, 0x02, 0x14, 0x3d, 0x15
        ]
    },
    'response to getObisInfo with obis code 0.9.1 without obis profile': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        bytes: [
            0x47, 0x05,
            0x03, 0x02, 0x00, 0x09, 0x01
        ]
    },
    'response to getObisInfo without data': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3
        },
        bytes: [
            0x47, 0x01,
            0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetObisInfoResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();

    if ( buffer.isEmpty ) {
        return {requestId};
    }

    const obis = buffer.getObis();

    return buffer.isEmpty
        ? {requestId, obis}
        : {requestId, obis, obisProfile: buffer.getObisProfile()};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetObisInfoResponseParameters ): types.TBytes => {
    let size = REQUEST_ID_SIZE;

    if ( parameters.obis ) {
        size += CommandBinaryBuffer.getObisSize(parameters.obis);

        if ( parameters.obisProfile ) {
            size += OBIS_PROFILE_SIZE;
        }
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);
    const {requestId, obis, obisProfile} = parameters;

    buffer.setUint8(requestId);

    if ( obis ) {
        buffer.setObis(obis);

        if ( obisProfile ) {
            buffer.setObisProfile(obisProfile);
        }
    }

    return command.toBytes(id, buffer.data);
};
