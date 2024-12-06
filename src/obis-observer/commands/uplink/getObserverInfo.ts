/**
 * Uplink command to get the information about observer, like name, software and hardware version.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getObserverInfo from 'jooby-codec/obis-observer/commands/uplink/getObserverInfo.js';
 *
 * // response to getObserverInfo with device name "Jooby Electra RM LoraWan 1D485 EU"
 * const bytes = [
 *     0x07, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x21,
 *     0x4a, 0x6f, 0x6f, 0x62, 0x79, 0x20, 0x45, 0x6c,
 *     0x65, 0x63, 0x74, 0x72, 0x61, 0x20, 0x52, 0x4d,
 *     0x20, 0x4c, 0x6f, 0x72, 0x61, 0x57, 0x61, 0x6e,
 *     0x20, 0x31, 0x44, 0x34, 0x38, 0x35, 0x20, 0x45,
 *     0x55
 * ];
 *
 * // decoded payload
 * const parameters = getObserverInfo.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 7,
 *     softwareVersion: {
 *         major: 0,
 *         minor: 1
 *     },
 *     protocolVersion: {
 *         major: 0,
 *         minor: 1
 *     },
 *     hardwareVersion: {
 *         major: 1,
 *         minor: 1
 *     },
 *     deviceName: 'Jooby Electra RM LoraWan 1D485 EU'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverInfo.md#response)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandParameters, ICommandBinaryBuffer, IVersion, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getObserverInfo as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IGetObserverInfoResponseParameters command parameters
 */
interface IGetObserverInfoResponseParameters extends ICommandParameters {
    softwareVersion: IVersion,
    protocolVersion: IVersion,
    hardwareVersion: IVersion,
    deviceName: string
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getObserverInfo with device name "Jooby Electra RM LoraWan 1D485 EU"': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 7,
            softwareVersion: {
                major: 0,
                minor: 1
            },
            protocolVersion: {
                major: 0,
                minor: 1
            },
            hardwareVersion: {
                major: 1,
                minor: 1
            },
            deviceName: 'Jooby Electra RM LoraWan 1D485 EU'
        },
        bytes: [
            0x02, 0x29,
            0x07, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x21, 0x4a, 0x6f, 0x6f, 0x62, 0x79, 0x20, 0x45, 0x6c,
            0x65, 0x63, 0x74, 0x72, 0x61, 0x20, 0x52, 0x4d, 0x20, 0x4c, 0x6f, 0x72, 0x61, 0x57, 0x61, 0x6e,
            0x20, 0x31, 0x44, 0x34, 0x38, 0x35, 0x20, 0x45, 0x55
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetObserverInfoResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const softwareVersion = buffer.getVersion();
    const protocolVersion = buffer.getVersion();
    const hardwareVersion = buffer.getVersion();

    const deviceName = buffer.getString();

    return {requestId, softwareVersion, protocolVersion, hardwareVersion, deviceName};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetObserverInfoResponseParameters ): types.TBytes => {
    // real size - request id byte + software version 2 bytes + protocol version 2 bytes + hardware version 2 bytes +
    // device name string size byte + string bytes
    const size = REQUEST_ID_SIZE + 2 + 2 + 2 + 1 + parameters.deviceName.length;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);
    const {requestId, softwareVersion, protocolVersion, hardwareVersion, deviceName} = parameters;

    buffer.setUint8(requestId);
    buffer.setVersion(softwareVersion);
    buffer.setVersion(protocolVersion);
    buffer.setVersion(hardwareVersion);
    buffer.setString(deviceName);

    return command.toBytes(id, buffer.data);
};
