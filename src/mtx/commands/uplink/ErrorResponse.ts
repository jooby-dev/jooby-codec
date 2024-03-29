import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {ACCESS_DENIED} from '../../constants/resultCodes.js';
import {TUint8} from '../../../types.js';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as resultCodes from '../../constants/resultCodes.js';


interface IErrorResponseParameters {
    /**
     * Downlink command id.
     *
     * @example
     * 7 (GetDateTime)
     */
    commandId: TUint8,

    /**
     * Error code from the list of {@link resultCodes | available codes}.
     */
    errorCode: TUint8
}


const COMMAND_ID = 0xfe;

// command id byte + error code byte
const COMMAND_SIZE = 2;

const examples: TCommandExampleList = [
    {
        name: 'ACCESS_DENIED on TurnRelayOn command',
        parameters: {
            commandId: 0x18,
            errorCode: ACCESS_DENIED
        },
        hex: {header: 'fe 02', body: '18 93'}
    }
];


/**
 * Uplink command that correspond to the failed downlink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ErrorResponse from 'jooby-codec/obis-observer/commands/uplink/ErrorResponse.js';
 *
 * const commandBody = new Uint8Array([0x18, 0x93]);
 * const command = ErrorResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     commandId: 0x18,
 *     errorCode: 0x93
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/ErrorResponse.md)
 */
class ErrorResponse extends Command {
    constructor ( public parameters: IErrorResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new ErrorResponse({
            commandId: buffer.getUint8(),
            errorCode: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + this.size);
        const {commandId, errorCode} = this.parameters;

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(this.size);

        // body
        buffer.setUint8(commandId);
        buffer.setUint8(errorCode);

        return buffer.toUint8Array();
    }
}


export default ErrorResponse;
