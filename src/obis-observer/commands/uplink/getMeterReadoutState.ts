/**
 * Uplink command to get the readout related state and statistic from the specific meter.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMeterReadoutState from 'jooby-codec/obis-observer/commands/uplink/getMeterReadoutState.js';
 *
 * // response to getMeterReadoutState
 * const bytes = [0x03, 0x00, 0x00, 0x00, 0x7f, 0x00, 0x00, 0x00, 0xc1, 0x00, 0x0e, 0x00, 0x0c, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
 *
 * // decoded payload
 * const parameters = getMeterReadoutState.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 3,
 *     lastSuccessfulTime: 127,
 *     lastFailedTime: 193,
 *     readoutAttempts: 14,
 *     successfulReadoutAttempts: 12,
 *     readoutRepetitions: 2,
 *     waitNextSymbolErrors: 0,
 *     waitIdErrors: 0,
 *     waitNextStateErrors: 0,
 *     wrongBccErrors: 0,
 *     parityErrors: 0,
 *     frameErrors: 0,
 *     overrunErrors: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterReadoutState.md#response)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/binary/buffer.js';
import * as command from '../../utils/command.js';
import {getMeterReadoutState as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IGetMeterReadoutStateResponseParameters command parameters
 */
interface IGetMeterReadoutStateResponseParameters extends ICommandParameters {
    /** seconds since the start of the device when the last successful readout attempt occurred */
    lastSuccessfulTime: types.TUint32,
    /** seconds since the start of the device when the last failed readout attempt occurred */
    lastFailedTime: types.TUint32,
    /** the number of the readout attempts */
    readoutAttempts: types.TUint16,
    /** the number of the successful readout attempts */
    successfulReadoutAttempts: types.TUint16,
    /** the number of the readout repetitions */
    readoutRepetitions: types.TUint16,
    /** the number of the `WAIT NEXT SYMBOL` errors */
    waitNextSymbolErrors: types.TUint8,
    /** the number of the `WAIT ID` errors */
    waitIdErrors: types.TUint8,
    /** the number of the `WAIT NEXT STATE` errors */
    waitNextStateErrors: types.TUint8,
    /** the number of the `WRONG BCC` errors */
    wrongBccErrors: types.TUint8,
    /** the number of the parity errors */
    parityErrors: types.TUint8,
    /** the number of the frame errors */
    frameErrors: types.TUint8,
    /** the number of the overrun errors */
    overrunErrors: types.TUint8
}


const COMMAND_BODY_SIZE = REQUEST_ID_SIZE + 4 + 4 + 2 + 2 + 2 + 7;

const isValidParameterSet = ( parameters: IGetMeterReadoutStateResponseParameters | ICommandParameters ): boolean => {
    const {
        requestId,
        lastSuccessfulTime,
        lastFailedTime,
        readoutAttempts,
        successfulReadoutAttempts,
        readoutRepetitions,
        waitNextSymbolErrors,
        waitIdErrors,
        waitNextStateErrors,
        wrongBccErrors,
        parityErrors,
        frameErrors,
        overrunErrors
    } = parameters as IGetMeterReadoutStateResponseParameters;

    return requestId !== undefined
        && lastSuccessfulTime !== undefined
        && lastFailedTime !== undefined
        && readoutAttempts !== undefined
        && successfulReadoutAttempts !== undefined
        && readoutRepetitions !== undefined
        && waitNextSymbolErrors !== undefined
        && waitIdErrors !== undefined
        && waitNextStateErrors !== undefined
        && wrongBccErrors !== undefined
        && parityErrors !== undefined
        && frameErrors !== undefined
        && overrunErrors !== undefined;
};


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getMeterReadoutState': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            lastSuccessfulTime: 127,
            lastFailedTime: 193,
            readoutAttempts: 14,
            successfulReadoutAttempts: 12,
            readoutRepetitions: 2,
            waitNextSymbolErrors: 0,
            waitIdErrors: 0,
            waitNextStateErrors: 0,
            wrongBccErrors: 0,
            parityErrors: 0,
            frameErrors: 0,
            overrunErrors: 0
        },
        bytes: [
            0x82, 0x16,
            0x03, 0x00, 0x00, 0x00, 0x7f, 0x00, 0x00, 0x00, 0xc1, 0x00, 0x0e, 0x00, 0x0c, 0x00, 0x02, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]
    },
    'response to getMeterReadoutState without data': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3
        },
        bytes: [
            0x82, 0x01,
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
export const fromBytes = ( bytes: types.TBytes ): IGetMeterReadoutStateResponseParameters | ICommandParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();

    return buffer.isEmpty
        ? {requestId}
        : {
            requestId,
            lastSuccessfulTime: buffer.getUint32(),
            lastFailedTime: buffer.getUint32(),
            readoutAttempts: buffer.getUint16(),
            successfulReadoutAttempts: buffer.getUint16(),
            readoutRepetitions: buffer.getUint16(),
            waitNextSymbolErrors: buffer.getUint8(),
            waitIdErrors: buffer.getUint8(),
            waitNextStateErrors: buffer.getUint8(),
            wrongBccErrors: buffer.getUint8(),
            parityErrors: buffer.getUint8(),
            frameErrors: buffer.getUint8(),
            overrunErrors: buffer.getUint8()
        };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMeterReadoutStateResponseParameters ): types.TBytes => {
    if ( !isValidParameterSet(parameters) ) {
        return command.toBytes(id, [parameters.requestId]);
    }

    const size = isValidParameterSet(parameters) ? COMMAND_BODY_SIZE : REQUEST_ID_SIZE;
    const buffer: IBinaryBuffer = new BinaryBuffer(size, false);

    buffer.setUint8(parameters.requestId);
    buffer.setUint32(parameters.lastSuccessfulTime);
    buffer.setUint32(parameters.lastFailedTime);
    buffer.setUint16(parameters.readoutAttempts);
    buffer.setUint16(parameters.successfulReadoutAttempts);
    buffer.setUint16(parameters.readoutRepetitions);
    buffer.setUint8(parameters.waitNextSymbolErrors);
    buffer.setUint8(parameters.waitIdErrors);
    buffer.setUint8(parameters.waitNextStateErrors);
    buffer.setUint8(parameters.wrongBccErrors);
    buffer.setUint8(parameters.parityErrors);
    buffer.setUint8(parameters.frameErrors);
    buffer.setUint8(parameters.overrunErrors);

    return command.toBytes(id, buffer.data);
};
