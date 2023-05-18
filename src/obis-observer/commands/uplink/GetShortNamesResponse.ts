import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetShortNamesResponseParameters command parameters
 */
interface IGetShortNamesResponseParameters extends ICommandParameters {
    shortNameList: Array<number>
}

const COMMAND_ID = 0x02;

const examples: TCommandExampleList = [
    {
        name: 'two short names for OBIS code 0.9.1 - local time',
        parameters: {
            requestId: 3,
            shortNameList: [197, 198]
        },
        hex: {header: '02', body: '03 03 c5 c6'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetShortNamesResponse from 'jooby-codec/obis-observer/commands/uplink/GetShortNamesResponse.js';
 *
 * const commandBody = new Uint8Array([0x03, 0x03, 0xc5, 0xc6]);
 * const command = GetShortNamesResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     shortNameList: [197, 198]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetShortNames.md#response)
 */
class GetShortNamesResponse extends Command {
    constructor ( public parameters: IGetShortNamesResponseParameters ) {
        super();

        // body size = size byte + request id byte + short names 0-n bytes
        this.size = 1 + REQUEST_ID_SIZE + parameters.shortNameList.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const size = buffer.getUint8();
        const requestId = buffer.getUint8();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const shortNameList = [...new Array(size - REQUEST_ID_SIZE)].map(() => buffer.getUint8());

        return new GetShortNamesResponse({requestId, shortNameList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, shortNameList} = this.parameters;

        // subtract size byte
        buffer.setUint8(this.size - 1);
        buffer.setUint8(requestId);
        shortNameList.forEach(shortName => buffer.setUint8(shortName));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetShortNamesResponse;
