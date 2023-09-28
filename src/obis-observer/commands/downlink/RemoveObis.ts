import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IRemoveObisParameters command parameters
 */
interface IRemoveObisParameters extends ICommandParameters {
    meterProfileId: number,
    obisId: number
}


const COMMAND_ID = 0x44;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'remove obis with Id 2 from meter profile with Id 17',
        parameters: {
            requestId: 3,
            meterProfileId: 17,
            obisId: 2
        },
        hex: {header: '44 03', body: '03 11 02'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import RemoveObis from 'jooby-codec/obis-observer/commands/downlink/RemoveObis.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterProfileId: 17,
 *     obisId: 2
 * };
 * const command = new RemoveObis(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 44 03 03 11 02
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveObis.md#request)
 */
class RemoveObis extends Command {
    constructor ( public parameters: IRemoveObisParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, meterProfileId, obisId]: Uint8Array ) {
        return new RemoveObis({requestId, meterProfileId, obisId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters} = this;

        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array(
                [parameters.requestId, parameters.meterProfileId, parameters.obisId]
            )
        );
    }
}


export default RemoveObis;
