/**
 * Uplink command to get frequency statistics by phase.
 *
 * The corresponding downlink command: `getFrequencyStatus`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getFrequencyStatus from 'jooby-codec/plc/commands/uplink/getFrequencyStatus.js';
 *
 * // get default operator parameters response
 * const bytes = [
 *     0x2b, 0x51, 0x04, 0x03, 0x02, 0x9a, 0x00, 0x00, 0x03, 0x1f, 0x0f, 0x08, 0x00, 0x10,
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

import * as types from '../../../mtx1/types.js';
import * as command from '../../../mtx1/utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {getFrequencyStatus as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 81;
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
            A: [
                {
                    successTxCount: 0x00000001,
                    errorTxCount: 0x00000001,
                    successTxPercentage: 0x01
                },
                {
                    successTxCount: 0x00000002,
                    errorTxCount: 0x00000002,
                    successTxPercentage: 0x02
                },
                {
                    successTxCount: 0x00000003,
                    errorTxCount: 0x00000003,
                    successTxPercentage: 0x03
                }
            ],
            B: [
                {
                    successTxCount: 0x00000004,
                    errorTxCount: 0x00000004,
                    successTxPercentage: 0x04
                },
                {
                    successTxCount: 0x00000005,
                    errorTxCount: 0x00000005,
                    successTxPercentage: 0x05
                },
                {
                    successTxCount: 0x00000006,
                    errorTxCount: 0x00000006,
                    successTxPercentage: 0x06
                }
            ],
            C: [
                {
                    successTxCount: 0x00000007,
                    errorTxCount: 0x00000007,
                    successTxPercentage: 0x07
                },
                {
                    successTxCount: 0x00000008,
                    errorTxCount: 0x00000008,
                    successTxPercentage: 0x08
                },
                {
                    successTxCount: 0x00000009,
                    errorTxCount: 0x00000009,
                    successTxPercentage: 0x09
                }
            ]
        },
        bytes: [
            0x2b, 0x51,
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x01,
            0x01,
            0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x02,
            0x02,
            0x00, 0x00, 0x00, 0x03,
            0x00, 0x00, 0x00, 0x03,
            0x03,
            0x00, 0x00, 0x00, 0x04,
            0x00, 0x00, 0x00, 0x04,
            0x04,
            0x00, 0x00, 0x00, 0x05,
            0x00, 0x00, 0x00, 0x05,
            0x05,
            0x00, 0x00, 0x00, 0x06,
            0x00, 0x00, 0x00, 0x06,
            0x06,
            0x00, 0x00, 0x00, 0x07,
            0x00, 0x00, 0x00, 0x07,
            0x07,
            0x00, 0x00, 0x00, 0x08,
            0x00, 0x00, 0x00, 0x08,
            0x08,
            0x00, 0x00, 0x00, 0x09,
            0x00, 0x00, 0x00, 0x09,
            0x09
        ]
    }
};


interface IFrequencyChannelStatus {
    successTxCount: types.TUint32,
    errorTxCount: types.TUint32,
    successTxPercentage: types.TUint8
}

const frequencyChannelStatusFromBuffer = ( buffer: IBinaryBuffer ): IFrequencyChannelStatus => ({
    successTxCount: buffer.getUint32(),
    errorTxCount: buffer.getUint32(),
    successTxPercentage: buffer.getUint8()
});

const frequencyChannelStatusToBuffer = ( buffer: IBinaryBuffer, parameters: IFrequencyChannelStatus ) => {
    buffer.setUint32(parameters.successTxCount);
    buffer.setUint32(parameters.errorTxCount);
    buffer.setUint8(parameters.successTxPercentage);
};

type TPhaseFrequencyStatus = [IFrequencyChannelStatus, IFrequencyChannelStatus, IFrequencyChannelStatus];

const phaseFrequencyStatusFromBuffer = ( buffer: IBinaryBuffer ): TPhaseFrequencyStatus => ([
    frequencyChannelStatusFromBuffer(buffer),
    frequencyChannelStatusFromBuffer(buffer),
    frequencyChannelStatusFromBuffer(buffer)
]);

const phaseFrequencyStatusToBuffer = ( buffer: IBinaryBuffer, parameters: TPhaseFrequencyStatus ) => (
    parameters.forEach(element => {
        frequencyChannelStatusToBuffer(buffer, element);
    })
);

interface IGetFrequencyStatusParameters {
    A: TPhaseFrequencyStatus,
    B: TPhaseFrequencyStatus,
    C: TPhaseFrequencyStatus
}


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetFrequencyStatusParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        A: phaseFrequencyStatusFromBuffer(buffer),
        B: phaseFrequencyStatusFromBuffer(buffer),
        C: phaseFrequencyStatusFromBuffer(buffer)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetFrequencyStatusParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    phaseFrequencyStatusToBuffer(buffer, parameters.A);
    phaseFrequencyStatusToBuffer(buffer, parameters.B);
    phaseFrequencyStatusToBuffer(buffer, parameters.C);

    return command.toBytes(id, buffer.data);
};
