import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IObis} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetShortNameInfoParameters command parameters
 */
interface IGetShortNameInfoParameters {
    shortName: number,
    obis: IObis
}


const COMMAND_ID = 0x02;

const examples: TCommandExampleList = [
    {
        name: 'set short name 44 for OBIS code 0.9.1',
        parameters: {
            shortName: 44,
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        hex: {header: '02', body: '2c 02 00 09 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetShortName from 'jooby-codec/commands/obis-observer/downlink/SetShortName.js';
 * const parameters = {
 *     shortName: 44,
 *     obis: {
 *         c: 0,
 *         d: 9,
 *         e: 1
 *     }
 * };
 * const command = new SetShortName(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 02 2c 02 00 09 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetShortName.md#request)
 */
class SetShortName extends Command {
    constructor ( public parameters: IGetShortNameInfoParameters ) {
        super();

        // obis size + short code 1 byte
        this.size = CommandBinaryBuffer.getObisSize(parameters.obis) + 1;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetShortName({shortName: buffer.getUint8(), obis: buffer.getObis()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {shortName, obis} = this.parameters;

        buffer.setUint8(shortName);
        buffer.setObis(obis);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetShortName;
