import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {ISpecialDay} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


interface ISetSpecialDayParameters extends ISpecialDay {
    tariffTable: number,
    index: number
}


const COMMAND_ID = 0x12;
const COMMAND_SIZE = 6;

const examples: TCommandExampleList = [
    {
        name: 'set special day',
        parameters: {
            tariffTable: 1,
            index: 5,
            month: 1,
            date: 9,
            dayIndex: 3,
            isPeriodic: true

        },
        hex: {header: '12 06', body: '01 05 01 09 03 00'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetSpecialDay from 'jooby-codec/mtx/commands/downlink/SetSpecialDay.js';
 *
 * const parameters = {
 *     tariffTable: 1,
 *     index: 5,
 *     month: 1,
 *     date: 9,
 *     dayIndex: 3,
 *     isPeriodic: true
 * };
 * const command = new SetSpecialDay(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 12 06 01 05 01 09 03 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetSpecialDay.md#request)
 */
class SetSpecialDay extends Command {
    constructor ( public parameters: ISetSpecialDayParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_WRITE;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetSpecialDay({
            tariffTable: buffer.getUint8(),
            index: buffer.getUint8(),
            ...buffer.getSpecialDay()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        buffer.setSpecialDay(parameters);

        return buffer.toUint8Array();
    }
}


export default SetSpecialDay;
