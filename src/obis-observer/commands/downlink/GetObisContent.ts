import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObis} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetContentByObisParameters command parameters
 */
interface IGetContentByObisParameters extends ICommandParameters {
    meterId: number,
    obis: IObis
}


const COMMAND_ID = 0x4e;

const examples: TCommandExampleList = [
    {
        name: 'get content for OBIS code 0.9.1 - local time for meter 8',
        parameters: {
            requestId: 3,
            meterId: 8,
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        hex: {header: '4e 06', body: '03 08 02 00 09 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetContentByObis from 'jooby-codec/obis-observer/commands/downlink/GetContentByObis.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterId: 8,
 *     obis: {
 *         c: 0,
 *         d: 9,
 *         e: 1
 *     }
 * };
 * const command = new GetContentByObis(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 4e 06 03 08 02 00 09 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetContentByObis.md#request)
 */
class GetContentByObis extends Command {
    constructor ( public parameters: IGetContentByObisParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 1 + CommandBinaryBuffer.getObisSize(parameters.obis);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetContentByObis({
            requestId: buffer.getUint8(),
            meterId: buffer.getUint8(),
            obis: buffer.getObis()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, meterId, obis} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size as number);

        buffer.setUint8(requestId);
        buffer.setUint8(meterId);
        buffer.setObis(obis);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetContentByObis;
