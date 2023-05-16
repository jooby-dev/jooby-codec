import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObis} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * ISetShortNameParameters command parameters
 */
interface ISetShortNameParameters extends ICommandParameters {
    shortName: number,
    obis: IObis
}


const COMMAND_ID = 0x03;

const examples: TCommandExampleList = [
    {
        name: 'set short name 44 for OBIS code 0.9.1',
        parameters: {
            requestId: 3,
            shortName: 44,
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        hex: {header: '03', body: '03 2c 02 00 09 01'}
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
 * // 03 2c 02 00 09 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetShortName.md#request)
 */
class SetShortName extends Command {
    constructor ( public parameters: ISetShortNameParameters ) {
        super();

        // request id 1 byte + short name 1 byte + obis size
        this.size = REQUEST_ID_SIZE + 1 + CommandBinaryBuffer.getObisSize(parameters.obis);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetShortName({requestId: buffer.getUint8(), shortName: buffer.getUint8(), obis: buffer.getObis()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, shortName, obis} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(shortName);
        buffer.setObis(obis);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetShortName;
