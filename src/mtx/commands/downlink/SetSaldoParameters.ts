import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {ISaldoParameters} from '../../CommandBinaryBuffer.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SetSaldoParametersResponse from '../uplink/SetSaldoParametersResponse.js';


const COMMAND_ID = 0x2f;
const COMMAND_SIZE = 37;

const examples: TCommandExampleList = [
    {
        name: 'test parameters',
        parameters: {
            coefficients: [2, 3, 4, 5],
            decimalPointTariff: 6,
            indicationThreshold: 7,
            relayThreshold: 8,
            mode: 9,
            saldoOffTimeBegin: 10,
            saldoOffTimeEnd: 11,
            decimalPointIndication: 12,
            powerThreshold: 13,
            creditThreshold: 14
        },
        hex: {
            header: '2f 25',
            body: '00 00 00 02 00 00 00 03 00 00 00 04 00 00 00 05 06 00 00 00 07 00 00 00 08 09 0a 0b 0c 00 00 00 0d 00 00 00 0e'
        }
    }
];


/**
 * Downlink command to set device current saldo parameters.
 *
 * The corresponding uplink command: {@link SetSaldoParametersResponse}.
 *
 * @example
 * ```js
 * import SetSaldoParameters from 'jooby-codec/mtx/commands/downlink/SetSaldoParameters.js';
 *
 * const parameters = {
 *     coefficients: [2, 3, 4, 5],
 *     decimalPointTariff: 6,
 *     indicationThreshold: 7,
 *     relayThreshold: 8,
 *     mode: 9,
 *     saldoOffTimeBegin: 10,
 *     saldoOffTimeEnd: 11,
 *     decimalPointIndication: 12,
 *     powerThreshold: 13,
 *     creditThreshold: 14
 * };
 * const command = new SetSaldoParameters(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 2f 25 00 00 00 02 00 00 00 03 00 00 00 04 00 00 00 05 06 00 00 00 07 00 00 00 08 09 0a 0b 0c 00 00 00 0d 00 00 00 0e
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetSaldoParameters.md#request)
 */
class SetSaldoParameters extends Command {
    constructor ( public parameters: ISaldoParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_WRITE;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetSaldoParameters(buffer.getSaldoParameters());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + this.size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(this.size);

        // body
        buffer.setSaldoParameters(this.parameters);

        return buffer.toUint8Array();
    }
}


export default SetSaldoParameters;
