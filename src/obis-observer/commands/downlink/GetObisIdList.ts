import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetObisIdListParameters command parameters
 */
interface IGetObisIdListParameters extends ICommandParameters {
    meterProfileId: number,
    index: number
}


const COMMAND_ID = 0x40;

const examples: TCommandExampleList = [
    {
        name: 'get obisId list',
        parameters: {
            requestId: 3,
            meterProfileId: 5,
            index: 0
        },
        hex: {header: '40 03', body: '03 05 00'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetObisIdList from 'jooby-codec/obis-observer/commands/downlink/GetObisIdList.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 5
 * };
 * const command = new GetObisIdList(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 40 02 03 05
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisIdList.md#request)
 */
class GetObisIdList extends Command {
    constructor ( public parameters: IGetObisIdListParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 2;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterProfileId, index]: Uint8Array ) {
        return new GetObisIdList({requestId, meterProfileId, index});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.meterProfileId, this.parameters.index])
        );
    }
}


export default GetObisIdList;
