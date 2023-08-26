import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetMeterDateParameters command parameters
 */
interface IGetMeterDateParameters extends ICommandParameters {
    meterId: number
}


const COMMAND_ID = 0x7a;

const examples: TCommandExampleList = [
    {
        name: 'get meter date',
        parameters: {
            requestId: 4,
            meterId: 3
        },
        hex: {header: '7a', body: '04 03'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetMeterDate from 'jooby-codec/obis-observer/commands/downlink/GetMeterDate.js';
 *
 * const parameters = {
 *     requestId: 4,
 *     meterId: 3
 * };
 * const command = new GetMeterDate(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 7a 02 04 03
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterDate.md#request)
 */
class GetMeterDate extends Command {
    constructor ( public parameters: IGetMeterDateParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 1;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetMeterDate({requestId: buffer.getUint8(), meterId: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.meterId])
        );
    }
}


export default GetMeterDate;
