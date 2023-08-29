import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetObisIdListResponseParameters command parameters
 */
interface IGetObisIdListResponseParameters extends ICommandParameters {
    obisIdList: Array<number>
}

const COMMAND_ID = 0x41;

const examples: TCommandExampleList = [
    {
        name: 'response to GetObisIdList with two obis id',
        parameters: {
            requestId: 3,
            obisIdList: [197, 198]
        },
        hex: {header: '41 03', body: '03 c5 c6'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObisIdListResponse from 'jooby-codec/obis-observer/commands/uplink/GetObisIdListResponse.js';
 *
 * const commandBody = new Uint8Array([0x03, 0xc5, 0xc6]);
 * const command = GetObisIdListResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     obisIdList: [197, 198]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisIdList.md#response)
 */
class GetObisIdListResponse extends Command {
    constructor ( public parameters: IGetObisIdListResponseParameters ) {
        super();

        // body size = request id byte + obisIdList 0-n bytes
        this.size = REQUEST_ID_SIZE + parameters.obisIdList.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const requestId = buffer.getUint8();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const obisIdList = [...new Array(data.length - REQUEST_ID_SIZE)].map(() => buffer.getUint8());

        return new GetObisIdListResponse({requestId, obisIdList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, obisIdList} = this.parameters;

        buffer.setUint8(requestId);
        obisIdList.forEach(obisId => buffer.setUint8(obisId));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisIdListResponse;
