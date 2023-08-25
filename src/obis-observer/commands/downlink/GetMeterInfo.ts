import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetMeterInfoParameters command parameters
 */
interface IGetMeterInfoParameters extends ICommandParameters {
    meterId: number
}


const COMMAND_ID = 0x78;

const examples: TCommandExampleList = [
    {
        name: 'get meter info',
        parameters: {
            requestId: 8,
            meterId: 1
        },
        hex: {header: '78', body: '08 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetMeterInfo from 'jooby-codec/obis-observer/commands/downlink/GetMeterInfo.js';
 *
 * const parameters = {
 *     requestId: 8,
 *     meterId: 1
 * };
 * const command = new GetMeterInfo(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 7a 02 08 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterInfo.md#request)
 */
class GetMeterInfo extends Command {
    constructor ( public parameters: IGetMeterInfoParameters ) {
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

        return new GetMeterInfo({requestId: buffer.getUint8(), meterId: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.meterId])
        );
    }
}


export default GetMeterInfo;
