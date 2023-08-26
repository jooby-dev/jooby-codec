import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetReadoutStateParameters command parameters
 */
interface IGetReadoutStateParameters extends ICommandParameters {
    meterId?: number
}


const COMMAND_ID = 0x07;

const examples: TCommandExampleList = [
    {
        name: 'get readout state',
        parameters: {
            requestId: 8
        },
        hex: {header: '07', body: '08'}
    },
    {
        name: 'get readout state for meter id 3',
        parameters: {
            requestId: 9,
            meterId: 3
        },
        hex: {header: '07', body: '09 03'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetReadoutState from 'jooby-codec/obis-observer/commands/downlink/GetReadoutState.js';
 *
 * const parameters = {
 *     requestId: 8,
 *     meterId: 3
 * };
 * const command = new GetReadoutState(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 07 02 08 03
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetReadoutState.md#request)
 */
class GetReadoutState extends Command {
    constructor ( public parameters: IGetReadoutStateParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + (parameters.meterId ? 1 : 0);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const requestId = buffer.getUint8();

        return buffer.isEmpty
            ? new GetReadoutState({requestId})
            : new GetReadoutState({requestId, meterId: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, meterId} = this.parameters;

        buffer.setUint8(requestId);

        if ( meterId ) {
            buffer.setUint8(meterId);
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetReadoutState;
