import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetObisInfoListParameters command parameters
 */
interface IGetObisInfoListParameters extends ICommandParameters {
    meterProfileId: number,
    index: number
}


const COMMAND_ID = 0x42;

const examples: TCommandExampleList = [
    {
        name: 'get reassignable obisId list',
        parameters: {
            requestId: 3,
            meterProfileId: 5,
            index: 0
        },
        hex: {header: '42 03', body: '03 05 00'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetObisInfoList from 'jooby-codec/obis-observer/commands/downlink/GetObisInfoList.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 5
 * };
 * const command = new GetObisInfoList(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 42 02 03 05
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisInfoList.md#request)
 */
class GetObisInfoList extends Command {
    constructor ( public parameters: IGetObisInfoListParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 2;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterProfileId, index]: Uint8Array ) {
        return new GetObisInfoList({requestId, meterProfileId, index});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.meterProfileId, this.parameters.index])
        );
    }
}


export default GetObisInfoList;
