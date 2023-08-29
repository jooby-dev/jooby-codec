import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, EUI_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import * as deviceClasses from '../../constants/deviceClasses.js';


/**
 * IGetLorawanInfoResponseParameters command parameters
 */
interface IGetLorawanInfoResponseParameters extends ICommandParameters {
    deviceEUI: string,
    applicationEUI: string,
    deviceClass: number,
    /**
     * Device activation method in LoRaWAN network.
     *
     * `0` - OTAA
     * `1` - ABP
     */
    activationMethod: number
}


const COMMAND_ID = 0x14;

const examples: TCommandExampleList = [
    {
        name: 'response to GetLorawanInfo',
        parameters: {
            requestId: 8,
            deviceEUI: '00 1a 79 88 16 aa 55 61',
            applicationEUI: '00 11 22 33 44 55 66 77',
            deviceClass: deviceClasses.C,
            activationMethod: 1
        },
        hex: {header: '14 13', body: '08 00 1a 79 88 16 aa 55 61 00 11 22 33 44 55 66 77 02 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetLorawanInfoResponse from 'jooby-codec/obis-observer/commands/uplink/GetLorawanInfoResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x08, 0x00, 0x1a, 0x79, 0x88, 0x16, 0xaa, 0x55, 0x61, 0x00,
 *     0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x02, 0x01
 * ]);
 * const command = GetLorawanInfoResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
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
class GetLorawanInfoResponse extends Command {
    constructor ( public parameters: IGetLorawanInfoResponseParameters ) {
        super();

        // real size - request id byte + device EUI 8 bytes + application EUI 8 bytes + deviceClass byte + activation method byte
        this.size = REQUEST_ID_SIZE + (EUI_SIZE * 2) + 1 + 1;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const requestId = buffer.getUint8();
        const deviceEUI = buffer.getEUI();
        const applicationEUI = buffer.getEUI();
        const deviceClass = buffer.getUint8();
        const activationMethod = buffer.getUint8();

        return new GetLorawanInfoResponse({requestId, deviceEUI, applicationEUI, deviceClass, activationMethod});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, deviceEUI, applicationEUI, deviceClass, activationMethod} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setEUI(deviceEUI);
        buffer.setEUI(applicationEUI);
        buffer.setUint8(deviceClass);
        buffer.setUint8(activationMethod);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetLorawanInfoResponse;
