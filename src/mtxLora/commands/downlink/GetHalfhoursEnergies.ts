import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import CommandBinaryBuffer, {IDate, TEnergiesFlags} from '../../CommandBinaryBuffer.js';


interface IGetHalfhoursEnergies {
    date: IDate,
    energies: TEnergiesFlags,
    firstHalfhour: number,
    numberOfHalfhours: number
}


const COMMAND_ID = 0x69;
const COMMAND_SIZE = 5;

const examples: TCommandExampleList = [
    {
        name: 'request for halfhours energies',
        parameters: {
            date: {
                year: 21,
                month: 2,
                day: 3
            },
            firstHalfhour: 5,
            numberOfHalfhours: 4,
            energies: {
                aPlus: true,
                aPlusRPlus: true,
                aPlusRMinus: false,
                aMinus: false,
                aMinusRPlus: false,
                aMinusRMinus: false
            }
        },
        hex: {header: '69 05', body: '2a 43 03 05 04'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetHalfhoursEnergies from 'jooby-codec/mtxLora/commands/downlink/GetHalfhoursEnergies.js';
 *
 * const parameters: {
 *     date: {
 *         year: 21,
 *         month: 2,
 *         day: 3,
 *     },
 *     firstHalfhour: 5,
 *     numberOfHalfhours: 4,
 *     energies: {
 *         aPlus: true,
 *         aPlusRPlus: true,
 *     }
 *};
 *
 * const command = new GetHalfhoursEnergies(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 69 05 2a 43 03 05 04
 * ```
 */
class GetHalfhoursEnergies extends Command {
    constructor ( public parameters: IGetHalfhoursEnergies ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetHalfhoursEnergies({
            date: buffer.getDate(),
            energies: buffer.getEnergiesFlags(),
            firstHalfhour: buffer.getUint8(),
            numberOfHalfhours: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + COMMAND_SIZE);
        const {parameters} = this;

        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(COMMAND_SIZE);

        buffer.setDate(parameters.date);
        buffer.setEnergiesFlags(parameters.energies);
        buffer.setUint8(parameters.firstHalfhour);
        buffer.setUint8(parameters.numberOfHalfhours);

        return buffer.toUint8Array();
    }
}


export default GetHalfhoursEnergies;
