import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObis} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetShortNameResponseParameters command parameters
 */
interface IGetShortNameResponseParameters extends ICommandParameters {
    obis: IObis,
    shortNameList: Array<number>
}

const COMMAND_ID = 0x02;

const examples: TCommandExampleList = [
    {
        name: 'two short names for OBIS code 0.9.1 - local time',
        parameters: {
            requestId: 3,
            obis: {
                c: 0,
                d: 9,
                e: 1
            },
            shortNameList: [197, 198]
        },
        hex: {header: '02', body: '07 03 02 00 09 01 c5 c6'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetShortNameResponse from 'jooby-codec/obis-observer/commands/uplink/GetShortNameResponse.js';
 *
 * const commandBody = new Uint8Array([0x07, 0x03, 0x02, 0x00, 0x09, 0x01, 0xc5, 0xc6]);
 * const command = GetShortNameResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     obis: {
 *         c: 0,
 *         d: 9,
 *         e: 1
 *     },
 *     shortNameList: [197, 198]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetShortName.md#response)
 */
class GetShortNameResponse extends Command {
    constructor ( public parameters: IGetShortNameResponseParameters ) {
        super();

        // body size = size byte + request id byte + obis code 3-7 byte + short names 0-n bytes
        this.size = 1 + REQUEST_ID_SIZE + CommandBinaryBuffer.getObisSize(parameters.obis) + parameters.shortNameList.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const size = buffer.getUint8();
        const requestId = buffer.getUint8();
        const obis = buffer.getObis();
        const shortNameList = [];

        // obis size + request id byte
        let position = CommandBinaryBuffer.getObisSize(obis) + REQUEST_ID_SIZE;

        while ( position < size ) {
            shortNameList.push(buffer.getUint8());
            ++position;
        }

        return new GetShortNameResponse({requestId, obis, shortNameList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, obis, shortNameList} = this.parameters;

        // subtract size byte
        buffer.setUint8(this.size - 1);
        buffer.setUint8(requestId);
        buffer.setObis(obis);
        shortNameList.forEach(shortName => buffer.setUint8(shortName));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetShortNameResponse;
