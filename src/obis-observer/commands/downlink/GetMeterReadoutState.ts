import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE, METER_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


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
        hex: {header: '81 05', body: '09 00 00 00 03'}
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
 * // 81 05 09 00 00 00 03
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterReadoutState.md#request)
 */
class GetMeterReadoutState extends Command {
    constructor ( public parameters: IGetMeterReadoutStateParameters ) {
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

        return new GetMeterReadoutState({
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


export default GetMeterReadoutState;
