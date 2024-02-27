import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {TUint8} from '../../../types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetSeasonProfileResponse from '../uplink/GetSeasonProfileResponse.js';


interface IGetSeasonProfileParameters {
    /**
     * tariff table identifier
     * (`0` - table `A+`, `1` – table `A-`)
     */
    tariffTable: TUint8,

    /**
     * Season profile index in a list of all tariff seasons (max `14`).
     */
    index: TUint8,

    /**
     * Is it active or passive table.
     */
    isActive: boolean
}


const COMMAND_ID = 0x3c;
const COMMAND_SIZE = 3;

const examples: TCommandExampleList = [
    {
        name: 'request for passive tariff table A+',
        parameters: {
            tariffTable: 0,
            index: 5,
            isActive: false
        },
        hex: {header: '3c 03', body: '00 05 01'}
    }
];


/**
 * Downlink command to get season profile information for the given tariff table.
 *
 * The corresponding uplink command: {@link GetSeasonProfileResponse}.
 *
 * @example
 * ```js
 * import GetSeasonProfile from 'jooby-codec/mtx/commands/downlink/GetSeasonProfile.js';
 *
 * const parameters = {
 *     tariffTable: 0,
 *     index: 5,
 *     periods: [
 *         tariffTable: 0,
 *         index: 5,
 *         isActive: false
 *     ]
 * };
 * const command = new GetSeasonProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 3c 03 00 05 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetSeasonProfile.md#request)
 */
class GetSeasonProfile extends Command {
    constructor ( public parameters: IGetSeasonProfileParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( [tariffTable, index, isActive]: Uint8Array ) {
        return new GetSeasonProfile({
            tariffTable,
            index,
            isActive: isActive === 0
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;

        return new Uint8Array([
            COMMAND_ID,
            size,
            parameters.tariffTable,
            parameters.index,
            parameters.isActive ? 0 : 1
        ]);
    }
}


export default GetSeasonProfile;
