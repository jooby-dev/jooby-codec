import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetDisplayParamParameters {
    displayMode: number
}


const COMMAND_ID = 0x5e;
const COMMAND_SIZE = 1;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            displayMode: 5
        },
        hex: {header: '5e 01', body: '05'}
    }
];


/**
 * Downlink command.
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
