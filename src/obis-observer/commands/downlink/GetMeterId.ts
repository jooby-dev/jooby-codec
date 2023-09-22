import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetMeterIdParameters command parameters
 */
interface IGetMeterIdParameters extends ICommandParameters {
    address: string
}


const COMMAND_ID = 0x76;

const examples: TCommandExampleList = [
    {
        name: 'get meter id for meter with address ma3275',
        parameters: {
            requestId: 0,
            address: 'ma2375'
        },
        hex: {header: '76 08', body: '00 06 6d 61 32 33 37 35'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetMeterId from 'jooby-codec/obis-observer/commands/downlink/GetMeterId.js';
 *
 * const parameters = {
 *     requestId: 0,
 *     address: 'ma2375'
 * };
 * const command = new GetMeterId(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * //  76 08 00 06 6d 61 32 33 37 35
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterId.md#request)
 */
class GetMeterId extends Command {
    constructor ( public parameters: IGetMeterIdParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 1 + parameters.address.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetMeterId({
            requestId: buffer.getUint8(),
            address: buffer.getString()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {requestId, address} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setString(address);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterId;
