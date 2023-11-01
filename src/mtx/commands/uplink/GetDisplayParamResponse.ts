import Command, {TCommandExampleList} from '../../Command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


interface IGetDisplayParamResponseParameters {
    displayMode: number,
    order: Array<number>
}


const COMMAND_ID = 0x5e;
const COMMAND_SIZE = 1;
const MAX_COMMAND_SIZE = 33;

const examples: TCommandExampleList = [
    {
        name: 'mode with order',
        parameters: {
            displayMode: 8,
            order: [4, 5, 6, 7]
        },
        hex: {header: '5e 05', body: '08 04 05 06 07'}
    },
    {
        name: 'mode without order',
        parameters: {
            displayMode: 0
        },
        hex: {header: '5e 01', body: '00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetDisplayParamResponse from 'jooby-codec/obis-observer/commands/uplink/GetDisplayParamResponse.js';
 *
 * const commandBody = new Uint8Array([0x08, 0x04, 0x05, 0x06, 0x07]);
 * const command = GetDisplayParamResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     displayMode: 8,
 *     order: [4, 5, 6, 7]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetDisplayParamResponse.md)
 */
class GetDisplayParamResponse extends Command {
    constructor ( public parameters: IGetDisplayParamResponseParameters ) {
        super();

        // eslint-disable-next-line no-param-reassign
        parameters.order = parameters.order || [];

        this.size = COMMAND_SIZE + parameters.order.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = MAX_COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( !data || data.length < 1 || data.length > MAX_COMMAND_SIZE ) {
            throw new Error('Invalid GetDisplayParamResponse data size.');
        }

        const [displayMode, ...order] = data;

        return new GetDisplayParamResponse({displayMode, order});
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


export default GetDisplayParamResponse;
