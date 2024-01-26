import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {IDate, TTariffsEnergies} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


interface IGetDayEnergies {
    date: IDate,
    energies: TTariffsEnergies
}


const COMMAND_ID = 0x78;
const DATE_SIZE = 3; // year, month, day
const MAX_TARIFFS_ENERGIES_SIZE = 5 * 4 * 4; // 5 energy types, 4 tariffs, 4 bytes - energy value
const COMMAND_MAX_SIZE = DATE_SIZE + MAX_TARIFFS_ENERGIES_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'get day energies',
        parameters: {
            date: {
                year: 21,
                month: 2,
                day: 3
            },
            energies: [
                {
                    'A+': 0x1000,
                    'A-R+': 0x2000
                }
            ]
        },
        hex: {
            header: '78 0c',
            body: '2a 43 11 11 00 00 10 00 00 00 20 00'
        }
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetDayEnergies from 'jooby-codec/obis-observer/commands/uplink/GetDayEnergies.js';
 *
 * const commandBody = new Uint8Array([0x2a, 0x43, 0x11, 0x11, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00]);
 * const command = GetDayEnergies.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     date: {
 *         year: 21,
 *         month: 2,
 *         day: 3
 *     },
 *     energies: [
 *          {
 *              'A+': 0x1000,
 *              'A-R+': 0x2000
 *          }
 *     ]
 * }
 * ```
 */
class GetDayEnergies extends Command {
    constructor ( public parameters: IGetDayEnergies ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetDayEnergies({
            date: buffer.getDate(),
            energies: buffer.getTariffsEnergies()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters: {date, energies}} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + COMMAND_MAX_SIZE);

        // body
        buffer.setDate(date);
        buffer.setTariffsEnergies(energies);

        return new Uint8Array([
            COMMAND_ID,
            buffer.position,
            ...buffer.getBytesToOffset()
        ]);
    }
}


export default GetDayEnergies;
