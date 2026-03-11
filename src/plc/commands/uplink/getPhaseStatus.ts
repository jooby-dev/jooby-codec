/**
 * Uplink command to get transmission and reception statistics by phase.
 *
 * The corresponding downlink command: `getPhaseStatus`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getPhaseStatus from 'jooby-codec/plc/commands/uplink/getPhaseStatus.js';
 *
 * // get default operator parameters response
 * const bytes = [
 *     0x2a, 0x45, 0x04, 0x03, 0x02, 0x9a, 0x00, 0x00, 0x03, 0x1f, 0x0f, 0x08, 0x00, 0x10,
 *     0x7d, 0x31, 0x7d, 0x31, 0x03, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
 *     0x00, 0x0c, 0x73, 0x4d
 * ];
 *
 * // decoded payload
 * const parameters = modemStatus.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     A: {
 *         signalLevel: 0x0001,
 *         successTxCount: 0x00000002,
 *         errorTxCount: 0x00000100,
 *         successTxPercentage: 0x00000100,
 *         rerouteCount: 0x000000001,
 *         successRxCount: 0x000000001,
 *         errorRxCount: 0x000000001
 *     },
 *     B: {
 *         signalLevel: 0x0001,
 *         successTxCount: 0x00000002,
 *         errorTxCount: 0x00000100,
 *         successTxPercentage: 0x00000100,
 *         rerouteCount: 0x000000001,
 *         successRxCount: 0x000000001,
 *         errorRxCount: 0x000000001
 *     },
 *     C: {
 *         signalLevel: 0x0001,
 *         successTxCount: 0x00000002,
 *         errorTxCount: 0x00000100,
 *         successTxPercentage: 0x00000100,
 *         rerouteCount: 0x000000001,
 *         successRxCount: 0x000000001,
 *         errorRxCount: 0x000000001
 *     }
 *}
 */

import * as types from '../../types.js';
import * as command from '../../../mtx1/utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {getPhaseStatus as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 69;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'get phase status response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            A: {
                signalLevel: 0x0001,
                successTxCount: 0x00000001,
                errorTxCount: 0x00000001,
                successTxPercentage: 0x01,
                rerouteCount: 0x00000001,
                successRxCount: 0x00000001,
                errorRxCount: 0x00000001
            },
            B: {
                signalLevel: 0x0002,
                successTxCount: 0x00000002,
                errorTxCount: 0x00000002,
                successTxPercentage: 0x02,
                rerouteCount: 0x00000002,
                successRxCount: 0x00000002,
                errorRxCount: 0x00000002
            },
            C: {
                signalLevel: 0x0003,
                successTxCount: 0x00000003,
                errorTxCount: 0x00000003,
                successTxPercentage: 0x03,
                rerouteCount: 0x00000003,
                successRxCount: 0x00000003,
                errorRxCount: 0x00000003
            }
        },
        bytes: [
            0x2a, 0x45,
            0x00, 0x01,
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x01,
            0x01,
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x02,
            0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x02,
            0x02,
            0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x02,
            0x00, 0x03,
            0x00, 0x00, 0x00, 0x03,
            0x00, 0x00, 0x00, 0x03,
            0x03,
            0x00, 0x00, 0x00, 0x03,
            0x00, 0x00, 0x00, 0x03,
            0x00, 0x00, 0x00, 0x03
        ]
    }
};


interface IPhaseStatus {
    signalLevel: types.TUint16,
    successTxCount: types.TUint32,
    errorTxCount: types.TUint32,
    successTxPercentage: types.TUint8,
    rerouteCount: types.TUint32,
    successRxCount: types.TUint32,
    errorRxCount: types.TUint32
}


const phaseStatusFromBuffer = ( buffer: IBinaryBuffer ): IPhaseStatus => ({
    signalLevel: buffer.getUint16(),
    successTxCount: buffer.getUint32(),
    errorTxCount: buffer.getUint32(),
    successTxPercentage: buffer.getUint8(),
    rerouteCount: buffer.getUint32(),
    successRxCount: buffer.getUint32(),
    errorRxCount: buffer.getUint32()
});

const phaseStatusToBuffer = ( buffer: IBinaryBuffer, parameters: IPhaseStatus ) => {
    buffer.setUint16(parameters.signalLevel);
    buffer.setUint32(parameters.successTxCount);
    buffer.setUint32(parameters.errorTxCount);
    buffer.setUint8(parameters.successTxPercentage);
    buffer.setUint32(parameters.rerouteCount);
    buffer.setUint32(parameters.successRxCount);
    buffer.setUint32(parameters.errorRxCount);
};


interface IGetPhaseStatusParameters {
    A: IPhaseStatus,
    B: IPhaseStatus,
    C: IPhaseStatus
}


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetPhaseStatusParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        A: phaseStatusFromBuffer(buffer),
        B: phaseStatusFromBuffer(buffer),
        C: phaseStatusFromBuffer(buffer)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetPhaseStatusParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    phaseStatusToBuffer(buffer, parameters.A);
    phaseStatusToBuffer(buffer, parameters.B);
    phaseStatusToBuffer(buffer, parameters.C);

    return command.toBytes(id, buffer.data);
};
