import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetObisProfileParameters command parameters
 */
interface IGetObisProfileParameters extends ICommandParameters {
    obisId: number
}


const COMMAND_ID = 0x09;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'get obis profile for obisId 128',
        parameters: {
            requestId: 4,
            obisId: 128
        },
        hex: {header: '09', body: '04 80'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetObisIdProfile from 'jooby-codec/obis-observer/commands/downlink/GetObisIdProfile.js';
 *
 * const parameters = {
 *     requestId: 4,
 *     obisId: 128
 * };
 * const command = new GetObisIdProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 09 04 80
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisIdProfile.md#request)
 */
class GetObisProfile extends Command {
    constructor ( public parameters: IGetObisProfileParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetObisProfile({
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


export default GetObisProfile;
