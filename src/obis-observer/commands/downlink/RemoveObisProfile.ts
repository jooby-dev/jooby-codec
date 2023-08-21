import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IRemoveObisProfileParameters command parameters
 */
interface IRemoveObisProfileParameters extends ICommandParameters {
    obisId: number
}


const COMMAND_ID = 0x07;
const COMMAND_SIZE = 1 + REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'remove obis profile for obisId 28',
        parameters: {
            requestId: 5,
            obisId: 28
        },
        hex: {header: '07', body: '05 1c'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import RemoveObisProfile from 'jooby-codec/obis-observer/commands/downlink/RemoveObisProfile.js';
 *
 * const parameters = {
 *     requestId: 5,
 *     obisId: 28
 * };
 * const command = new RemoveObisProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 07 05 1c
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveObisProfile.md#request)
 */
class RemoveObisProfile extends Command {
    constructor ( public parameters: IRemoveObisProfileParameters ) {
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

        return new RemoveObisProfile({
            requestId: buffer.getUint8(),
            obisId: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {requestId, obisId} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(obisId);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default RemoveObisProfile;
