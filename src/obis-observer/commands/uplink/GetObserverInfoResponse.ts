import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IVersion} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetObserverInfoResponseParameters command parameters
 */
interface IGetObserverInfoResponseParameters extends ICommandParameters {
    softwareVersion: IVersion,
    hardwareVersion: IVersion,
    deviceName: string
}


const COMMAND_ID = 0x21;

const examples: TCommandExampleList = [
    {
        name: 'response from device "Jooby Electra RM LoraWan 1D485 EU"',
        parameters: {
            requestId: 7,
            softwareVersion: {
                major: 0,
                minor: 1
            },
            hardwareVersion: {
                major: 1,
                minor: 1
            },
            deviceName: 'Jooby Electra RM LoraWan 1D485 EU'
        },
        hex: {
            header: '21',
            body: '07 00 01 01 01 21 4a 6f 6f 62 79 20 45 6c 65 63 74 72 61 20 52 4d 20 4c 6f 72 61 57 61 6e 20 31 44 34 38 35 20 45 55'
        }
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObserverInfoResponse from 'jooby-codec/obis-observer/commands/uplink/GetObserverInfoResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x07, 0x00, 0x01, 0x01, 0x01, 0x21, 0x4a,
 *     0x6f, 0x6f, 0x62, 0x79, 0x20, 0x45, 0x6c, 0x65,
 *     0x63, 0x74, 0x72, 0x61, 0x20, 0x52, 0x4d, 0x20,
 *     0x4c, 0x6f, 0x72, 0x61, 0x57, 0x61, 0x6e, 0x20,
 *     0x31, 0x44, 0x34, 0x38, 0x35, 0x20, 0x45, 0x55
 * ]);
 * const command = GetObserverInfoResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 *     softwareVersion: {
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
class GetObserverInfoResponse extends Command {
    constructor ( public parameters: IGetObserverInfoResponseParameters ) {
        super();

        // real size - request id byte + software version 2 bytes + hardware version 2 bytes + device name string size byte + string bytes
        this.size = REQUEST_ID_SIZE + 2 + 2 + 1 + parameters.deviceName.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();
        const softwareVersion = buffer.getVersion();
        const hardwareVersion = buffer.getVersion();

        const deviceName = buffer.getString();

        return new GetObserverInfoResponse({requestId, softwareVersion, hardwareVersion, deviceName});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, softwareVersion, hardwareVersion, deviceName} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setVersion(softwareVersion);
        buffer.setVersion(hardwareVersion);
        buffer.setString(deviceName);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObserverInfoResponse;
