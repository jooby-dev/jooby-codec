import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetShortNameInfoParameters command parameters
 */
interface IGetShortNameInfoParameters extends ICommandParameters {
    requestId: number,
    shortName: number
}


const COMMAND_ID = 0x0b;

const examples: TCommandExampleList = [
    {
        name: 'get info for short name 124',
        parameters: {
            requestId: 3,
            shortName: 44
        },
        hex: {header: '0b', body: '03 2c'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetShortNameInfo from 'jooby-codec/obis-observer/commands/downlink/GetShortNameInfo.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     shortName: 44
 * };
 * const command = new GetShortNameInfo(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0b 03 2c
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetShortNameInfo.md#request)
 */
class GetShortNameInfo extends Command {
    constructor ( public parameters: IGetShortNameInfoParameters ) {
        super();

        // request id size + short name 1 byte
        this.size = REQUEST_ID_SIZE + 1;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetShortNameInfo({requestId: buffer.getUint8(), shortName: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, shortName} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(shortName);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetShortNameInfo;
