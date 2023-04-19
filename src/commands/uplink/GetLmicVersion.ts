import Command, {TCommandExampleList} from '../../Command.js';
import BinaryBuffer from '../../BinaryBuffer.js';
import * as bitSet from '../../utils/bitSet.js';
import {UPLINK} from '../../constants/directions.js';


interface ILmicStatus extends bitSet.TBooleanObject {
    multicastSupport: boolean,
    /* LoRaWAN Fragmented Data Block Transport  */
    fragmentedDataSupport: boolean
}

/**
 * GetLmicVersion command parameters
 */
interface IUplinkGetLmicVersionParameters {
    /* status of supported features */
    status: ILmicStatus,
    version: number
}


const COMMAND_ID = 0x021f;
const COMMAND_TITLE = 'GET_LMIC_VERSION';
const COMMAND_BODY_SIZE = 2;

const lmicStatusBitMask = {
    multicastSupport: 2 ** 0,
    fragmentedDataSupport: 2 ** 1
};

const examples: TCommandExampleList = [
    {
        name: 'version: 12, support only multicast',
        parameters: {
            version: 12,
            status: {
                multicastSupport: true,
                fragmentedDataSupport: false
            }
        },
        hex: {header: '1f 02 02', body: '01 0c'}
    },
    {
        name: 'version: 34, support multicast and fragmented data',
        parameters: {
            version: 34,
            status: {
                multicastSupport: true,
                fragmentedDataSupport: true
            }
        },
        hex: {header: '1f 02 02', body: '03 22'}
    }
];


/**
 * Uplink command.
 *
 * @example
 * ```js
 * import GetLmicVersion from 'jooby-codec/commands/uplink/GetLmicVersion';
 *
 * const parameters = {
 *     version: 34,
 *     status: {
 *         multicastSupport: true,
 *         fragmentedDataSupport: true
 *     }
 * };
 * const command = new GetLmicVersion(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 02 02 03 22
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetLmicVersion.md#response)
 */
class GetLmicVersion extends Command {
    constructor ( public parameters: IUplinkGetLmicVersionParameters ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    static readonly examples = examples;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        console.log({data});

        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`${this.getName()}. Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new BinaryBuffer(data);

        const status = bitSet.toObject(lmicStatusBitMask, buffer.getUint8()) as ILmicStatus;
        const version = buffer.getUint8();

        if ( !buffer.isEmpty ) {
            throw new Error(`${this.getName()}. BinaryBuffer is not empty.`);
        }

        return new GetLmicVersion({status, version});
    }

    toBytes (): Uint8Array {
        const {status, version} = this.parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE);

        buffer.setUint8(bitSet.fromObject(lmicStatusBitMask, status));
        buffer.setUint8(version);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetLmicVersion;
