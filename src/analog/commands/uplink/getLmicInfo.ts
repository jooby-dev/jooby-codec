/**
 * Information about LMIC from device.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getLmicInfo from 'jooby-codec/analog/commands/uplink/getLmicInfo.js';
 *
 * // version: 5, support only multicast
 * const bytes = [0x01, 0x05];
 *
 * // decoded payload
 * const parameters = getLmicInfo.fromBytes(bytes);
 *
 * console.log(parameters);
 * {
 *     version: 5,
 *     capabilities: {
 *         isMulticastSupported: true,
 *         isFragmentedDataSupported: false
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetLmicInfo.md#response)
 */

import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as bitSet from '../../../utils/bitSet.js';
import * as types from '../../../types.js';
import * as command from '../../utils/command.js';


interface ILmicCapabilities extends bitSet.TBooleanObject {
    /** @see https://lora-alliance.org/resource_hub/lorawan-remote-multicast-setup-specification-v1-0-0/ */
    isMulticastSupported: boolean,
    isFragmentedDataSupported: boolean;
}

interface IGetLmicInfoResponseParameters {

    /**
     * LoRaWAN Fragmented Data Block Transport
     * @see https://lora-alliance.org/resource_hub/lorawan-fragmented-data-block-transport-specification-v1-0-0/
     */
    capabilities: ILmicCapabilities;
    version: types.TUint8;
}


export const id: types.TCommandId = 0x021f;
export const headerSize = 3;

const COMMAND_BODY_SIZE = 2;

const lmicCapabilitiesBitMask = {
    isMulticastSupported: 1 << 0,
    isFragmentedDataSupported: 1 << 1
};

export const examples: command.TCommandExamples = {
    'version: 5, support only multicast': {
        id,
        headerSize,
        parameters: {
            version: 5,
            capabilities: {
                isMulticastSupported: true,
                isFragmentedDataSupported: false
            }
        },
        bytes: [
            0x1f, 0x02, 0x02,
            0x01, 0x05
        ]
    },
    'version: 8, support multicast and fragmented data': {
        id,
        headerSize,
        parameters: {
            version: 8,
            capabilities: {
                isMulticastSupported: true,
                isFragmentedDataSupported: true
            }
        },
        bytes: [
            0x1f, 0x02, 0x02,
            0x03, 0x08
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetLmicInfoResponseParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(data);

    const capabilities = bitSet.toObject(lmicCapabilitiesBitMask, buffer.getUint8()) as ILmicCapabilities;
    const version = buffer.getUint8();

    if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return {capabilities, version};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetLmicInfoResponseParameters ): types.TBytes => {
    const {capabilities, version} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE);

    buffer.setUint8(bitSet.fromObject(lmicCapabilitiesBitMask, capabilities));
    buffer.setUint8(version);

    return command.toBytes(id, buffer.data);
};
