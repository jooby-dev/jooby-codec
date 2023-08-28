import Command, {TCommandExampleList} from '../../Command.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetObisInfoParameters command parameters
 */
interface IGetObisInfoParameters extends ICommandParameters {
    meterProfileId: number,
    obisId: number
}


const COMMAND_ID = 0x4a;

const examples: TCommandExampleList = [
    {
        name: 'get info for obisId 44',
        parameters: {
            requestId: 3,
            meterProfileId: 7,
            obisId: 44
        },
        hex: {header: '4a 03', body: '03 07 2c'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetObisInfo from 'jooby-codec/obis-observer/commands/downlink/GetObisInfo.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 7,
 *     obisId: 44
 * };
 * const command = new GetObisInfo(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 4a 03 03 07 2c
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisInfo.md#request)
 */
class GetObisInfo extends Command {
    constructor ( public parameters: IGetObisInfoParameters ) {
        super();

        // request id size + obisId 1 byte
        this.size = REQUEST_ID_SIZE + 1 + 1;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterProfileId, obisId]: Uint8Array ) {
        return new GetObisInfo({requestId, meterProfileId, obisId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId, this.parameters.meterProfileId, this.parameters.obisId])
        );
    }
}


export default GetObisInfo;
