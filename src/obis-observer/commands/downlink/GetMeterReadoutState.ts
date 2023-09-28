import Command, {TCommandExampleList} from '../../Command.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetMeterReadoutStateParameters command parameters
 */
interface IGetMeterReadoutStateParameters extends ICommandParameters {
    meterId: number
}


const COMMAND_ID = 0x81;

const examples: TCommandExampleList = [
    {
        name: 'get readout state for meter 3',
        parameters: {
            requestId: 9,
            meterId: 3
        },
        hex: {header: '81 02', body: '09 03'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetMeterReadoutState from 'jooby-codec/obis-observer/commands/downlink/GetMeterReadoutState.js';
 *
 * const parameters = {
 *     requestId: 8,
 *     meterId: 3
 * };
 * const command = new GetMeterReadoutState(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 81 02 08 03
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterReadoutState.md#request)
 */
class GetMeterReadoutState extends Command {
    constructor ( public parameters: IGetMeterReadoutStateParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + (parameters.meterId ? 1 : 0);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterId]: Uint8Array ) {
        return new GetMeterReadoutState({requestId, meterId});
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


export default GetMeterReadoutState;
