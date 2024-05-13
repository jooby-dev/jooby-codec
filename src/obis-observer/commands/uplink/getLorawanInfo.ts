/**
 * Uplink command to get the LoRaWAN information, like device EUI, application EUI and activation method.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getLorawanInfo from 'jooby-codec/obis-observer/commands/uplink/getLorawanInfo.js';
 *
 * // response to getLorawanInfo
 * const bytes = [
 *     0x08, 0x00, 0x1a, 0x79, 0x88, 0x16, 0xaa, 0x55, 0x61, 0x00,
 *     0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x02, 0x01
 * ];
 *
 * // decoded payload
 * const parameters = getLorawanInfo.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 8,
 *     deviceEUI: '00 1a 79 88 16 aa 55 61',
 *     applicationEUI: '00 11 22 33 44 55 66 77',
 *     deviceClass: 2
 *     activationMethod: 1
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetLorawanInfo.md#response)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ICommandParameters, EUI_SIZE, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import * as deviceClasses from '../../constants/deviceClasses.js';


/**
 * IGetLorawanInfoResponseParameters command parameters
 */
interface IGetLorawanInfoResponseParameters extends ICommandParameters {
    deviceEUI: string,
    applicationEUI: string,
    deviceClass: types.TUint8,
    /**
     * Device activation method in LoRaWAN network.
     *
     * `0` - OTAA
     * `1` - ABP
     */
    activationMethod: types.TUint8
}


export const id: types.TCommandId = 0x21;
export const name: types.TCommandName = 'getLorawanInfo';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to GetLorawanInfo': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 8,
            deviceEUI: '00 1a 79 88 16 aa 55 61',
            applicationEUI: '00 11 22 33 44 55 66 77',
            deviceClass: deviceClasses.C,
            activationMethod: 1
        },
        bytes: [
            0x21, 0x13,
            0x08, 0x00, 0x1a, 0x79, 0x88, 0x16, 0xaa, 0x55, 0x61, 0x00,
            0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x02, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetLorawanInfoResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        requestId: buffer.getUint8(),
        deviceEUI: buffer.getEUI(),
        applicationEUI: buffer.getEUI(),
        deviceClass: buffer.getUint8(),
        activationMethod: buffer.getUint8()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetLorawanInfoResponseParameters ): types.TBytes => {
    // real size - request id byte + device EUI 8 bytes + application EUI 8 bytes + deviceClass byte + activation method byte
    const size = REQUEST_ID_SIZE + (EUI_SIZE * 2) + 1 + 1;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);

    // body
    buffer.setUint8(parameters.requestId);
    buffer.setEUI(parameters.deviceEUI);
    buffer.setEUI(parameters.applicationEUI);
    buffer.setUint8(parameters.deviceClass);
    buffer.setUint8(parameters.activationMethod);

    return command.toBytes(id, buffer.data);
};
