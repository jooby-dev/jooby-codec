import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetLorawanStateResponseParameters command parameters
 */
interface IGetLorawanStateResponseParameters extends ICommandParameters {
    /** in percent */
    downlinkQuality: number,
    /** RSSI of the last frame */
    rssi: number,
    /** SNR of the last frame */
    snr: number,
    deviceMargin: number,
    gateMargin: number,
    resetFlag: number,
    senderCollision: number,
}


const COMMAND_ID = 0x25;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            requestId: 8,
            downlinkQuality: 1,
            rssi: 193,
            snr: 5,
            deviceMargin: 6,
            gateMargin: 0,
            resetFlag: 0,
            senderCollision: 0
        },
        hex: {header: '25', body: '08 01 c1 05 06 00 00 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetLorawanStateResponse from 'jooby-codec/obis-observer/commands/uplink/GetLorawanStateResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x08, 0x01, 0xc1, 0x05, 0x06, 0x00, 0x00, 0x00
 * ]);
 * const command = GetLorawanStateResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 8,
 *     downlinkQuality: 1,
 *     rssi: 193,
 *     snr: 5,
 *     deviceMargin: 6,
 *     gateMargin: 0,
 *     resetFlag: 0,
 *     senderCollision: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetLorawanState.md#response)
 */
class GetLorawanStateResponse extends Command {
    constructor ( public parameters: IGetLorawanStateResponseParameters ) {
        super();

        // real size - request id byte + 7 byte-size fields
        this.size = REQUEST_ID_SIZE + 7;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetLorawanStateResponse({
            requestId: buffer.getUint8(),
            downlinkQuality: buffer.getUint8(),
            rssi: buffer.getUint8(),
            snr: buffer.getUint8(),
            deviceMargin: buffer.getUint8(),
            gateMargin: buffer.getUint8(),
            resetFlag: buffer.getUint8(),
            senderCollision: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {
            requestId,
            downlinkQuality,
            rssi,
            snr,
            deviceMargin,
            gateMargin,
            resetFlag,
            senderCollision
        } = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(downlinkQuality);
        buffer.setUint8(rssi);
        buffer.setUint8(snr);
        buffer.setUint8(deviceMargin);
        buffer.setUint8(gateMargin);
        buffer.setUint8(resetFlag);
        buffer.setUint8(senderCollision);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetLorawanStateResponse;
