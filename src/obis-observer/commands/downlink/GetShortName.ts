import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObis} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetShortNameParameters command parameters
 */
interface IGetShortNameParameters extends ICommandParameters {
    obis: IObis
}


const COMMAND_ID = 0x01;

const examples: TCommandExampleList = [
    {
        name: 'get short name for OBIS code 0.9.1 - local time',
        parameters: {
            requestId: 3,
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        hex: {header: '01', body: '03 02 00 09 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetShortName from 'jooby-codec/obis-observer/commands/downlink/GetShortName.js';
 *
 * const parameters = {
 *     requestId: 3,
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
 * // 01 03 02 00 09 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetShortName.md#request)
 */
class GetShortName extends Command {
    constructor ( public parameters: IGetShortNameParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + CommandBinaryBuffer.getObisSize(parameters.obis);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetShortName({
            requestId: buffer.getUint8(),
            obis: buffer.getObis()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const {requestId, obis} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size);

        buffer.setUint8(requestId);
        buffer.setObis(obis);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetShortName;
