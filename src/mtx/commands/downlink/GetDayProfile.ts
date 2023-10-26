import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetDayProfileParameters {
    tariffTable: number,
    index: number,
    isActive: boolean
}


const COMMAND_ID = 0x3b;
const COMMAND_SIZE = 3;

const examples: TCommandExampleList = [
    {
        name: 'request for active tariff table A+',
        parameters: {
            tariffTable: 0,
            index: 3,
            isActive: true
        },
        hex: {header: '3b 03', body: '00 03 00'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetDayProfile from 'jooby-codec/mtx/commands/downlink/GetDayProfile.js';
 *
 * const parameters = {
 *     tariffTable: 0,
 *     index: 5,
 *     periods: [
 *         tariffTable: 0,
 *         index: 3,
 *         isActive: true
 *     ]
 * };
 * const command = new GetDayProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 3b 03 00 03 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDayProfile.md#request)
 */
class GetDayProfile extends Command {
    constructor ( public parameters: IGetDayProfileParameters ) {
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
        return new GetDayProfile({
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


export default GetDayProfile;
