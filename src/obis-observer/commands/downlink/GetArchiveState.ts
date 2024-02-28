import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, METER_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * IGetArchiveStateParameters command parameters
 */
interface IGetArchiveStateParameters extends ICommandParameters {
    meterId?: number,
    archiveType: number
}


const COMMAND_ID = 0x0f;

const examples: TCommandExampleList = [
    {
        name: 'get archive state',
        parameters: {
            requestId: 5,
            archiveType: 1
        },
        hex: {header: '0f 02', body: '05 01'}
    },
    {
        name: 'get archive state for meter 3',
        parameters: {
            requestId: 5,
            archiveType: 1,
            meterId: 3
        },
        hex: {header: '0f 06', body: '05 01 00 00 00 03'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetArchiveState from 'jooby-codec/obis-observer/commands/downlink/GetArchiveState.js';
 *
 * const parameters = {
 *     requestId: 5,
 *     archiveType: 1,
 *     meterId: 3
 * };
 * const command = new GetArchiveState(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0f 06 05 01 00 00 00 03
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetArchiveState.md#request)
 */
class GetArchiveState extends Command {
    constructor ( public parameters: IGetArchiveStateParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 1 + (parameters.meterId ? METER_ID_SIZE : 0);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const requestId = buffer.getUint8();
        const archiveType = buffer.getUint8();

        return buffer.isEmpty
            ? new GetArchiveState({requestId, archiveType})
            : new GetArchiveState({requestId, archiveType, meterId: buffer.getUint32()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, archiveType, meterId} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size);

        buffer.setUint8(requestId);
        buffer.setUint8(archiveType);
        if ( meterId ) {
            buffer.setUint32(meterId);
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveState;
