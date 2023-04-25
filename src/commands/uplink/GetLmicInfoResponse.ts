import Command, {TCommandExampleList} from '../../Command.js';
import BinaryBuffer from '../../BinaryBuffer.js';
import * as bitSet from '../../utils/bitSet.js';
import {UPLINK} from '../../constants/directions.js';


interface ILmicCapabilities extends bitSet.TBooleanObject {
    /** @see https://lora-alliance.org/resource_hub/lorawan-remote-multicast-setup-specification-v1-0-0/ */
    isMulticastSupported: boolean,

    /**
     * LoRaWAN Fragmented Data Block Transport
     * @see https://lora-alliance.org/resource_hub/lorawan-fragmented-data-block-transport-specification-v1-0-0/
     */
    isFragmentedDataSupported: boolean
}

/**
 * GetLmicInfoResponse command parameters
 */
interface IGetLmicInfoResponseParameters {
    /* device supported features */
    capabilities: ILmicCapabilities,
    version: number
}


const COMMAND_ID = 0x021f;
const COMMAND_BODY_SIZE = 2;

const lmicCapabilitiesBitMask = {
    isMulticastSupported: 2 ** 0,
    isFragmentedDataSupported: 2 ** 1
};

const examples: TCommandExampleList = [
    {
        name: 'version: 5, support only multicast',
        parameters: {
            version: 5,
            capabilities: {
                isMulticastSupported: true,
                isFragmentedDataSupported: false
            }
        },
        hex: {header: '1f 02 02', body: '01 05'}
    },
    {
        name: 'version: 8, support multicast and fragmented data',
        parameters: {
            version: 8,
            capabilities: {
                isMulticastSupported: true,
                isFragmentedDataSupported: true
            }
        },
        hex: {header: '1f 02 02', body: '03 08'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetLmicInfoResponse from 'jooby-codec/commands/uplink/GetLmicInfoResponse';
 *
 * const commandBody = new Uint8Array([0x01, 0x05]);
 * const command = GetLmicInfoResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     version: 5,
 *     capabilities: {
 *         isMulticastSupported: true,
 *         isFragmentedDataSupported: false
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetLmicInfo.md#response)
 */
class GetLmicInfoResponse extends Command {
    constructor ( public parameters: IGetLmicInfoResponseParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`${this.getName()}. Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new BinaryBuffer(data);

        const capabilities = bitSet.toObject(lmicCapabilitiesBitMask, buffer.getUint8()) as ILmicCapabilities;
        const version = buffer.getUint8();

        if ( !buffer.isEmpty ) {
            throw new Error(`${this.getName()}. BinaryBuffer is not empty.`);
        }

        return new GetLmicInfoResponse({capabilities, version});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {capabilities, version} = this.parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE);

        buffer.setUint8(bitSet.fromObject(lmicCapabilitiesBitMask, capabilities));
        buffer.setUint8(version);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetLmicInfoResponse;
