import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetObisInfoParameters command parameters
 */
interface IGetObisInfoParameters extends ICommandParameters {
    requestId: number,
    obisId: number
}


const COMMAND_ID = 0x0b;

const examples: TCommandExampleList = [
    {
        name: 'get info for obisId 44',
        parameters: {
            requestId: 3,
            obisId: 44
        },
        hex: {header: '0b', body: '03 2c'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetObisInfo from 'jooby-codec/obis-observer/commands/downlink/GetObisInfo.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     obisId: 44
 * };
 * const command = new GetObisInfo(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0b 02 03 2c
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisInfo.md#request)
 */
class GetObisInfo extends Command {
    constructor ( public parameters: IGetObisInfoParameters ) {
        super();

        // request id size + obisId 1 byte
        this.size = REQUEST_ID_SIZE + 1;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetObisInfo({
            requestId: buffer.getUint8(),
            obisId: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, obisId} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(obisId);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisInfo;
