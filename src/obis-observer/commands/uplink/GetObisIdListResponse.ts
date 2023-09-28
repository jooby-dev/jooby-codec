import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetObisIdListResponseParameters command parameters
 */
interface IGetObisIdListResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    obisIdList: Array<number>
}

const COMMAND_ID = 0x41;

const examples: TCommandExampleList = [
    {
        name: 'response to GetObisIdList with two elements',
        parameters: {
            requestId: 3,
            isCompleted: true,
            obisIdList: [197, 198]
        },
        hex: {header: '41 04', body: '03 01 c5 c6'}
    },
    {
        name: 'response to GetObisIdList without elements',
        parameters: {
            requestId: 3,
            isCompleted: true,
            obisIdList: []
        },
        hex: {header: '41 02', body: '03 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObisIdListResponse from 'jooby-codec/obis-observer/commands/uplink/GetObisIdListResponse.js';
 *
 * const commandBody = new Uint8Array([0x03, 0x01, 0xc5, 0xc6]);
 * const command = GetObisIdListResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     isCompleted: true,
 *     obisIdList: [197, 198]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisIdList.md#response)
 */
class GetObisIdListResponse extends Command {
    constructor ( public parameters: IGetObisIdListResponseParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 1 + parameters.obisIdList.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();
        const isCompleted = buffer.isEmpty ? 1 : buffer.getUint8();
        const obisIdList = buffer.isEmpty
            ? []
            : [...new Array<number>(buffer.bytesLeft)].map(() => buffer.getUint8());

        return new GetObisIdListResponse({requestId, isCompleted: isCompleted !== 0, obisIdList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {requestId, isCompleted, obisIdList} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(isCompleted ? 1 : 0);
        obisIdList.forEach(obisId => buffer.setUint8(obisId));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisIdListResponse;
