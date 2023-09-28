import Command, {TCommandExampleList} from '../../Command.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
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
        name: 'get date for meter 3',
        parameters: {
            requestId: 4,
            meterId: 3
        },
        hex: {header: '7a 02', body: '04 03'}
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
    static fromBytes ( [requestId, meterId]: Uint8Array ) {
        return new GetMeterDate({requestId, meterId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters} = this;

        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([parameters.requestId, parameters.meterId])
        );
    }
}


export default GetMeterDate;
