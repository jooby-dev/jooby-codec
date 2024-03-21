import Command, {TCommandExampleList} from '../../Command.js';
import {TEnergyType} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetEnergyCurrentResponse from '../uplink/GetEnergyCurrentResponse.js';


interface IGetEnergyCurrentParameters {
    energyType?: TEnergyType
}


const COMMAND_ID = 0x0f;
const MIN_COMMAND_SIZE = 0;
const MAX_COMMAND_SIZE = 1;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {},
        hex: {header: '0f 00', body: ''}
    },
    {
        name: 'get A+ energy',
        parameters: {
            energyType: 1
        },
        hex: {header: '0f 01', body: '01'}
    }
];


/**
 * Downlink command to get current energy A+ by default or selected energy type for 4 tariffs (T1-T4).
 *
 * The corresponding uplink command: {@link GetEnergyCurrentResponse}.
 *
 * @example
 * ```js
 * const parameters = {
 *     energyType: 1
 * };
 * const command = new GetEnergyCurrent(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0f 01 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetEnergyCurrent.md#request)
 */
class GetEnergyCurrent extends Command {
    constructor ( public parameters: IGetEnergyCurrentParameters = {} ) {
        super();

        this.size = parameters?.energyType ? MAX_COMMAND_SIZE : MIN_COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = MAX_COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data?.byteLength === MAX_COMMAND_SIZE ) {
            const energyType = data[0] as TEnergyType;

            return new GetEnergyCurrent({energyType});
        }

        return new GetEnergyCurrent();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const bytes = [COMMAND_ID, this.size];

        if ( this.parameters?.energyType ) {
            bytes.push(this.parameters.energyType);
        }

        return new Uint8Array(bytes);
    }
}


export default GetEnergyCurrent;
