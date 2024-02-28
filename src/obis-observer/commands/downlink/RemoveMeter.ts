import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, METER_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * IRemoveMeterParameters command parameters
 */
interface IRemoveMeterParameters extends ICommandParameters {
    meterId: number
}


const COMMAND_ID = 0x72;
const COMMAND_SIZE = REQUEST_ID_SIZE + METER_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'remove meter 17',
        parameters: {
            requestId: 3,
            meterId: 17
        },
        hex: {header: '72 05', body: '03 00 00 00 11'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import RemoveMeter from 'jooby-codec/obis-observer/commands/downlink/RemoveMeter.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterId: 17
 * };
 * const command = new RemoveMeter(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 72 05 03 00 00 00 11
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveMeter.md#request)
 */
class RemoveMeter extends Command {
    constructor ( public parameters: IRemoveMeterParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new RemoveMeter({
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


export default RemoveMeter;
