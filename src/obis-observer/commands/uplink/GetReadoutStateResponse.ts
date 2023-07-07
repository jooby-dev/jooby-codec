import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetReadoutStateResponseParameters command parameters
 */
interface IGetReadoutStateResponseParameters extends ICommandParameters {
    /** seconds since the start of the device when the last successful readout attempt occurred */
    lastSuccessfulTime: number,
    /** seconds since the start of the device when the last failed readout attempt occurred */
    lastFailedTime: number,
    /** the number of the readout attempts */
    readoutAttempts: number,
    /** the number of the successful readout attempts */
    successfulReadoutAttempts: number,
    /** the number of the readout repetitions */
    readoutRepetitions: number,
    /** the number of the `WAIT NEXT SYMBOL` errors */
    waitNextSymbolErrors: number,
    /** the number of the `WAIT ID` errors */
    waitIdErrors: number,
    /** the number of the `WAIT NEXT STATE` errors */
    waitNextStateErrors: number,
    /** the number of the `WRONG BCC` errors */
    wrongBccErrors: number,
    /** the number of the parity errors */
    parityErrors: number,
    /** the number of the frame errors */
    frameErrors: number,
    /** the number of the overrun errors */
    overrunErrors: number
}


const COMMAND_ID = 0x27;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
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
        hex: {header: '27', body: '03 00 00 00 7f 00 00 00 c1 00 0e 00 0c 00 02 00 00 00 00 00 00 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetReadoutStateResponse from 'jooby-codec/obis-observer/commands/uplink/GetReadoutStateResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x03, 0x00, 0x00, 0x00, 0x7f, 0x00, 0x00, 0x00, 0xc1, 0x00, 0x0e, 0x00, 0x0c, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
 * ]);
 * const command = GetReadoutStateResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetReadoutState.md#response)
 */
class GetReadoutStateResponse extends Command {
    constructor ( public parameters: IGetReadoutStateResponseParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 4 + 4 + 2 + 2 + 2 + 7;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetReadoutStateResponse({
            requestId: buffer.getUint8(),
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
        } = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint32(lastSuccessfulTime);
        buffer.setUint32(lastFailedTime);
        buffer.setUint16(readoutAttempts);
        buffer.setUint16(successfulReadoutAttempts);
        buffer.setUint16(readoutRepetitions);
        buffer.setUint8(waitNextSymbolErrors);
        buffer.setUint8(waitIdErrors);
        buffer.setUint8(waitNextStateErrors);
        buffer.setUint8(wrongBccErrors);
        buffer.setUint8(parityErrors);
        buffer.setUint8(frameErrors);
        buffer.setUint8(overrunErrors);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetReadoutStateResponse;
