import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IObis} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetShortNameParameters command parameters
 */
interface IGetShortNameParameters {
    obis: IObis
}


const COMMAND_ID = 0x01;

const examples: TCommandExampleList = [
    {
        name: 'get short name for OBIS code 0.9.1 - local time',
        parameters: {
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        hex: {header: '01', body: '02 00 09 01'}
    }
];


/**
 * Downlink command.
 * TODO: rework example, it works only for current branch
 *
 * @example
 * ```js
 * import GetShortName from 'jooby-codec/commands/downlink/GetLmicInfo';
 *
 * const parameters = {
 *     obis: {
 *         c: 0,
 *         d: 9,
 *         e: 1
 *     }
 * };
 * const command = new GetShortName(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 01 02 00 09 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetShortName.md#request)
 */
class GetShortName extends Command {
    constructor ( public parameters: IGetShortNameParameters ) {
        super();

        this.size = CommandBinaryBuffer.getObisSize(parameters.obis);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetShortName({obis: buffer.getObis()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {obis} = this.parameters;

        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getObisSize(this.parameters.obis));

        buffer.setObis(obis);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetShortName;
