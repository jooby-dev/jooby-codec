import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {TUint8} from '../../../types.js';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetDisplayParamResponse from '../uplink/GetDisplayParamResponse.js';


interface IGetDisplayParamParameters {
    /**
     * Display mode.
     * (`0` - main, `1` - additional)
     */
    displayMode: TUint8
}


const COMMAND_ID = 0x5e;
const COMMAND_SIZE = 1;

const examples: TCommandExampleList = [
    {
        name: 'get additional display parameters',
        parameters: {
            displayMode: 1
        },
        hex: {header: '5e 01', body: '01'}
    }
];


/**
 * Downlink command to get the meter displays sorting order.
 *
 * The corresponding uplink command: {@link GetDisplayParamResponse}.
 *
 * @example
 * ```js
 * import GetDisplayParam from 'jooby-codec/mtx/commands/downlink/GetDisplayParam.js';
 *
 * const parameters = {
 *     displayMode: 5
 * };
 * const command = new GetDisplayParam(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 5e 01 05
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDisplayParam.md#request)
 */
class GetDisplayParam extends Command {
    constructor ( public parameters: IGetDisplayParamParameters ) {
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
    static fromBytes ( [displayMode]: Uint8Array ) {
        return new GetDisplayParam({displayMode});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([
            COMMAND_ID,
            this.size,
            this.parameters.displayMode
        ]);
    }
}


export default GetDisplayParam;
