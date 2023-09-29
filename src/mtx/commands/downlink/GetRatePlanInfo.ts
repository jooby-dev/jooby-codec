import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetRatePlanInfoParameters {
    tariffTable: number
}


const COMMAND_ID = 0x2c;
const COMMAND_SIZE = 1;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            tariffTable: 5
        },
        hex: {header: '2c 01', body: '05'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetRatePlanInfo from 'jooby-codec/mtx/commands/downlink/GetRatePlanInfo.js';
 *
 * const parameters = {
 *     tariffTable: 5
 * };
 * const command = new GetRatePlanInfo(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 2c 01 05
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetRatePlanInfo.md#request)
 */
class GetRatePlanInfo extends Command {
    constructor ( public parameters: IGetRatePlanInfoParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( [tariffTable]: Uint8Array ) {
        return new GetRatePlanInfo({tariffTable});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([
            COMMAND_ID,
            this.size,
            this.parameters.tariffTable
        ]);
    }
}


export default GetRatePlanInfo;
