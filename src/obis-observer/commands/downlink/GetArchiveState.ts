import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * IGetArchiveStateParameters command parameters
 */
interface IGetArchiveStateParameters extends ICommandParameters {
    meterId?: number,
    archiveType: number
}


const COMMAND_ID = 0x0f;
const COMMAND_SIZE = REQUEST_ID_SIZE + 2;

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
        hex: {header: '0f 03', body: '05 01 03'}
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
 * // 0f 03 05 01 03
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetArchiveState.md#request)
 */
class GetArchiveState extends Command {
    constructor ( public parameters: IGetArchiveStateParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, archiveType, meterId]: Uint8Array ) {
        return meterId
            ? new GetArchiveState({requestId, archiveType, meterId})
            : new GetArchiveState({requestId, archiveType});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, archiveType, meterId} = this.parameters;
        const content = meterId
            ? [requestId, archiveType, meterId]
            : [requestId, archiveType];


        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array(content)
        );
    }
}


export default GetArchiveState;
