import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {ISaldoParameters} from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x2e;
const COMMAND_SIZE = 37;

const examples: TCommandExampleList = [
    {
        name: 'default response',
        parameters: {
            coefficients: [0, 0, 0, 0],
            decimalPointTariff: 0,
            indicationThreshold: 0,
            relayThreshold: 0,
            mode: 0,
            saldoOffTimeBegin: 0,
            saldoOffTimeEnd: 0,
            decimalPointIndication: 0,
            powerThreshold: 0,
            creditThreshold: 0
        },
        hex: {
            header: '2e 25',
            body: '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00'
        }
    },
    {
        name: 'test response',
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
            header: '2e 25',
            body: '00 00 00 02 00 00 00 03 00 00 00 04 00 00 00 05 06 00 00 00 07 00 00 00 08 09 0a 0b 0c 00 00 00 0d 00 00 00 0e'
        }
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetSaldoParametersResponse from 'jooby-codec/obis-observer/commands/uplink/GetSaldoParametersResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x05, 0x06, 0x00, 0x00
 *     0x00, 0x07, 0x00, 0x00, 0x00, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x00, 0x00, 0x00, 0x0d, 0x00, 0x00, 0x00, 0x0e,
 * ]);
 * const command = GetSaldoParametersResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
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
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetSaldoParametersResponse.md)
 */
class GetSaldoParametersResponse extends Command {
    constructor ( public parameters: ISaldoParameters ) {
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

        return new GetSaldoParametersResponse(buffer.getSaldoParameters());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + this.size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setSaldoParameters(parameters);

        return buffer.toUint8Array();
    }
}


export default GetSaldoParametersResponse;
