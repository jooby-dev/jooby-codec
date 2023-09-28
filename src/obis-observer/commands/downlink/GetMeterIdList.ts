import Command, {TCommandExampleList} from '../../Command.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetMeterIdParameters command parameters
 */
interface IGetMeterIdListParameters extends ICommandParameters {
    index: number
}


const COMMAND_ID = 0x74;

const examples: TCommandExampleList = [
    {
        name: 'get meter id list',
        parameters: {
            requestId: 8,
            index: 3
        },
        hex: {header: '74 02', body: '08 03'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetMeterIdList from 'jooby-codec/obis-observer/commands/downlink/GetMeterIdList.js';
 *
 * const parameters = {
 *     requestId: 8,
 *     index: 3
 * };
 * const command = new GetMeterIdList(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 74 02 08 03
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterIdList.md#request)
 */
class GetMeterIdList extends Command {
    constructor ( public parameters: IGetMeterIdListParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 1;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, index]: Uint8Array ) {
        return new GetMeterIdList({requestId, index});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters} = this;

        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([parameters.requestId, parameters.index])
        );
    }
}


export default GetMeterIdList;
