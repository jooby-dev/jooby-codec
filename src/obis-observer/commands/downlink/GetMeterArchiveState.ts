import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetMeterArchiveStateParameters command parameters
 */
interface IGetMeterArchiveStateParameters extends ICommandParameters {
    meterId: number,
    archiveType: number
}


const COMMAND_ID = 0x7c;
const COMMAND_SIZE = REQUEST_ID_SIZE + 2;

const examples: TCommandExampleList = [
    {
        name: 'get meter archive state',
        parameters: {
            requestId: 5,
            meterId: 3,
            archiveType: 1
        },
        hex: {header: '7c', body: '05 03 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetMeterArchiveState from 'jooby-codec/obis-observer/commands/downlink/GetMeterArchiveState.js';
 *
 * const parameters = {
 *     requestId: 5,
 *     meterId: 3,
 *     archiveType: 1
 * };
 * const command = new GetMeterArchiveState(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 7c 03 05 03 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterArchiveState.md#request)
 */
class GetMeterArchiveState extends Command {
    constructor ( public parameters: IGetMeterArchiveStateParameters ) {
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

        return new GetMeterArchiveState({
            requestId: buffer.getUint8(),
            meterId: buffer.getUint8(),
            archiveType: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.meterId, this.parameters.archiveType])
        );
    }
}


export default GetMeterArchiveState;
