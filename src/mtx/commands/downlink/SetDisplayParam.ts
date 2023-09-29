import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


interface ISetDisplayParamParameters {
    displayMode: number,
    order: Array<number>
}


const COMMAND_ID = 0x5d;
const COMMAND_SIZE = 1;
const MAX_COMMAND_SIZE = 33;

const examples: TCommandExampleList = [
    {
        name: 'set params with order',
        parameters: {
            displayMode: 8,
            order: [4, 5, 6, 7]
        },
        hex: {header: '5d 05', body: '08 04 05 06 07'}
    },
    {
        name: 'set params without order',
        parameters: {
            displayMode: 0
        },
        hex: {header: '5d 01', body: '00'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetDisplayParam from 'jooby-codec/mtx/commands/downlink/SetDisplayParam.js';
 *
 * const parameters = {
 *     displayMode: 8,
 *     order: [4, 5, 6, 7]
 * };
 * const command = new SetDisplayParam(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 5d 05 08 04 05 06 07
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetDisplayParam.md#request)
 */
class SetDisplayParam extends Command {
    constructor ( public parameters: ISetDisplayParamParameters ) {
        super();

        // eslint-disable-next-line no-param-reassign
        parameters.order = parameters.order || [];

        this.size = COMMAND_SIZE + parameters.order.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_WRITE;

    static readonly maxSize = MAX_COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( !data || data.length < 1 || data.length > MAX_COMMAND_SIZE ) {
            throw new Error('Invalid SetDisplayParam data size.');
        }

        const [displayMode, ...order] = data;

        return new SetDisplayParam({displayMode, order});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;

        return new Uint8Array([
            COMMAND_ID,
            size,
            parameters.displayMode,
            ...parameters.order
        ]);
    }
}


export default SetDisplayParam;
