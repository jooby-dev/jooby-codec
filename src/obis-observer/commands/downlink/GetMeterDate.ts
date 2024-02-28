import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE, METER_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * IGetMeterDateParameters command parameters
 */
interface IGetMeterDateParameters extends ICommandParameters {
    meterId: number
}


const COMMAND_ID = 0x7a;

const examples: TCommandExampleList = [
    {
        name: 'get date for meter 3',
        parameters: {
            requestId: 4,
            meterId: 3
        },
        hex: {header: '7a 05', body: '04 00 00 00 03'}
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
 * // 7a 05 04 00 00 00 03
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterDate.md#request)
 */
class GetMeterDate extends Command {
    constructor ( public parameters: IGetMeterDateParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + METER_ID_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetMeterDate({
            requestId: buffer.getUint8(),
            meterId: buffer.getUint32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, meterId} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size);

        buffer.setUint8(requestId);
        buffer.setUint32(meterId);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterDate;
