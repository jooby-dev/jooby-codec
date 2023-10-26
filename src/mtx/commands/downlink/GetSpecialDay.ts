import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetSpecialDayParameters {
    tariffTable: number,
    index: number,
    isActive: boolean
}


const COMMAND_ID = 0x3d;
const COMMAND_SIZE = 3;

const examples: TCommandExampleList = [
    {
        name: 'request for passive tariff table A+',
        parameters: {
            tariffTable: 0,
            index: 5,
            isActive: false
        },
        hex: {header: '3d 03', body: '00 05 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetSpecialDay from 'jooby-codec/mtx/commands/downlink/GetSpecialDay.js';
 *
 * const parameters = {
 *     tariffTable: 0,
 *     index: 5,
 *     isActive: false
 * };
 * const command = new GetSpecialDay(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 3d 03 00 05 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetSpecialDay.md#request)
 */
class GetSpecialDay extends Command {
    constructor ( public parameters: IGetSpecialDayParameters ) {
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
        return new GetSpecialDay({
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


export default GetSpecialDay;
