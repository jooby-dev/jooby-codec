/**
 * Uplink command to get PLC modem status.
 *
 * The corresponding downlink command: `getModemStatus`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getModemStatus from 'jooby-codec/plc/commands/uplink/getModemStatus.js';
 *
 * // get default operator parameters response
 * const bytes = [
 *     0x07, 0x1c, 0x04, 0x03, 0x02, 0x9a, 0x00, 0x00, 0x03, 0x1f, 0x0f, 0x08, 0x00, 0x10,
 *     0x7d, 0x31, 0x7d, 0x31, 0x03, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
 *     0x00, 0x0c, 0x73, 0x4d
 * ];
 *
 * // decoded payload
 * const parameters = getModemStatus.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     hardwareVersion: {major: 4, minor: 3},
 *     softwareVersion: {major: 2, minor: 154},
 *     uptime: 799,
 *     freeDataBufferCount: 15,
 *     аreeUartBufferCount: 8,
 *     busyRxLinkBufferCount: 0,
 *     freeTxLinkBufferCount: 16,
 *     firstHighPriorityTxLinkBufferNumber: 17,
 *     firstLowPriorityTxLinkBufferNumber: 17,
 *     freeRxLinkBufferCount: 3,
 *     crcErrorCount: 0,
 *     linkBufferErrorCount: 0,
 *     txSuccessCount: 0,
 *     txErrorCount: 0,
 *     rxSuccessCount: 1,
 *     rxErrorCount: 0,
 *     acceptedPacketCount: 0,
 *     confirmedPacketCount: 0,
 *     downlinkRerouteCount: 0,
 *     uplinkRerouteCount: 0,
 *     lastResetReason: 12,
 *     signalLevel: 29517
 * }
 */

import * as types from '../../types.js';
import {getVersion, setVersion} from '../../../utils/binary/types.js';
import * as command from '../../../mtx1/utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {getModemStatus as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 28;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'get modem status response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            hardwareVersion: {major: 4, minor: 3},
            softwareVersion: {major: 2, minor: 154},
            uptime: 799,
            freeDataBufferCount: 15,
            аreeUartBufferCount: 8,
            busyRxLinkBufferCount: 0,
            freeTxLinkBufferCount: 16,
            firstHighPriorityTxLinkBufferNumber: 17,
            firstLowPriorityTxLinkBufferNumber: 17,
            freeRxLinkBufferCount: 3,
            crcErrorCount: 0,
            linkBufferErrorCount: 0,
            txSuccessCount: 0,
            txErrorCount: 0,
            rxSuccessCount: 1,
            rxErrorCount: 0,
            acceptedPacketCount: 0,
            confirmedPacketCount: 0,
            downlinkRerouteCount: 0,
            uplinkRerouteCount: 0,
            lastResetReason: 12,
            signalLevel: 29517
        },
        bytes: [
            0x07, 0x1c,
            0x04, 0x03,
            0x02, 0x9a,
            0x00, 0x00, 0x03, 0x1f,
            0x0f, 0x08, 0x00, 0x10,
            0x11, 0x11, 0x03, 0x00,
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x0c,
            0x73, 0x4d
        ]
    }
};

interface IGetModemStatusParameters {
    hardwareVersion: types.IVersion,
    softwareVersion: types.IVersion,
    uptime: types.TUint32,
    freeDataBufferCount: types.TUint8,
    аreeUartBufferCount: types.TUint8,
    busyRxLinkBufferCount: types.TUint8,
    freeTxLinkBufferCount: types.TUint8,
    firstHighPriorityTxLinkBufferNumber: types.TUint8,
    firstLowPriorityTxLinkBufferNumber: types.TUint8,
    freeRxLinkBufferCount: types.TUint8,
    crcErrorCount: types.TUint8,
    linkBufferErrorCount: types.TUint8,
    txSuccessCount: types.TUint8,
    txErrorCount: types.TUint8,
    rxSuccessCount: types.TUint8,
    rxErrorCount: types.TUint8,
    acceptedPacketCount: types.TUint8,
    confirmedPacketCount: types.TUint8,
    downlinkRerouteCount: types.TUint8,
    uplinkRerouteCount: types.TUint8,
    lastResetReason: types.TUint8,
    signalLevel: types.TUint16
}


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetModemStatusParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        hardwareVersion: getVersion(buffer),
        softwareVersion: getVersion(buffer),
        uptime: buffer.getUint32(),
        freeDataBufferCount: buffer.getUint8(),
        аreeUartBufferCount: buffer.getUint8(),
        busyRxLinkBufferCount: buffer.getUint8(),
        freeTxLinkBufferCount: buffer.getUint8(),
        firstHighPriorityTxLinkBufferNumber: buffer.getUint8(),
        firstLowPriorityTxLinkBufferNumber: buffer.getUint8(),
        freeRxLinkBufferCount: buffer.getUint8(),
        crcErrorCount: buffer.getUint8(),
        linkBufferErrorCount: buffer.getUint8(),
        txSuccessCount: buffer.getUint8(),
        txErrorCount: buffer.getUint8(),
        rxSuccessCount: buffer.getUint8(),
        rxErrorCount: buffer.getUint8(),
        acceptedPacketCount: buffer.getUint8(),
        confirmedPacketCount: buffer.getUint8(),
        downlinkRerouteCount: buffer.getUint8(),
        uplinkRerouteCount: buffer.getUint8(),
        lastResetReason: buffer.getUint8(),
        signalLevel: buffer.getUint16()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetModemStatusParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    setVersion(buffer, parameters.hardwareVersion);
    setVersion(buffer, parameters.softwareVersion);
    buffer.setUint32(parameters.uptime);
    buffer.setUint8(parameters.freeDataBufferCount);
    buffer.setUint8(parameters.аreeUartBufferCount);
    buffer.setUint8(parameters.busyRxLinkBufferCount);
    buffer.setUint8(parameters.freeTxLinkBufferCount);
    buffer.setUint8(parameters.firstHighPriorityTxLinkBufferNumber);
    buffer.setUint8(parameters.firstLowPriorityTxLinkBufferNumber);
    buffer.setUint8(parameters.freeRxLinkBufferCount);
    buffer.setUint8(parameters.crcErrorCount);
    buffer.setUint8(parameters.linkBufferErrorCount);
    buffer.setUint8(parameters.txSuccessCount);
    buffer.setUint8(parameters.txErrorCount);
    buffer.setUint8(parameters.rxSuccessCount);
    buffer.setUint8(parameters.rxErrorCount);
    buffer.setUint8(parameters.acceptedPacketCount);
    buffer.setUint8(parameters.confirmedPacketCount);
    buffer.setUint8(parameters.downlinkRerouteCount);
    buffer.setUint8(parameters.uplinkRerouteCount);
    buffer.setUint8(parameters.lastResetReason);
    buffer.setUint16(parameters.signalLevel);

    return command.toBytes(id, buffer.data);
};
