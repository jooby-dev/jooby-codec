import Command, {TCommandExampleList} from '../../Command.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetMeterIdParameters command parameters
 */
interface IGetMeterProfileIdListParameters extends ICommandParameters {
    index: number
}


const COMMAND_ID = 0x64;

const examples: TCommandExampleList = [
    {
        name: 'get meter profile id list',
        parameters: {
            requestId: 8,
            index: 3
        },
        hex: {header: '64 02', body: '08 03'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetMeterProfileIdList from 'jooby-codec/obis-observer/commands/downlink/GetMeterProfileIdList.js';
 *
 * const parameters = {
 *     requestId: 8,
 *     index: 3
 * };
 * const command = new GetMeterProfileIdList(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 64 02 08 03
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterProfileIdList.md#request)
 */
class GetMeterProfileIdList extends Command {
    constructor ( public parameters: IGetMeterProfileIdListParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 1;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, index]: Uint8Array ) {
        return new GetMeterProfileIdList({requestId, index});
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


export default GetMeterProfileIdList;
