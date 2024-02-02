import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {IDate, TTariffsPowerMax} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


interface IGetDayMaxPower {
    date: IDate,
    tariffs: TTariffsPowerMax
}


const COMMAND_ID = 0x79;
const DATE_SIZE = 3; // year, month, day
const MAX_TARIFFS_ENERGIES_SIZE = 5 * 4 * (1 + 1 + 4); // 5 energy types, 4 tariffs, 1 hours, 1 minutes, 4 bytes - energy value
const COMMAND_MAX_SIZE = DATE_SIZE + MAX_TARIFFS_ENERGIES_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'get day max power',
        parameters: {
            date: {
                year: 21,
                month: 2,
                day: 3
            },
            tariffs: [
                {
                    'A+': {
                        hours: 2,
                        minutes: 3,
                        power: 0x1000
                    },
                    'A-R+': {
                        hours: 4,
                        minutes: 5,
                        power: 0x2000
                    }
                }
            ]
        },
        hex: {
            header: '79 10',
            body: '2a 43 11 11 02 03 00 00 10 00 04 05 00 00 20 00'
        }
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetDayMaxPower from 'jooby-codec/obis-observer/commands/uplink/GetDayMaxPower.js';
 *
 * const commandBody = new Uint8Array([0x2a, 0x43, 0x11, 0x11, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00]);
 * const command = GetDayMaxPower.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     date: {
 *         year: 21,
 *         month: 2,
 *         day: 3
 *     },
 *     tariffs: [
 *          {
 *              'A+': 0x1000,
 *              'A-R+': 0x2000
 *          }
 *     ]
 * }
 * ```
 */
class GetDayMaxPower extends Command {
    constructor ( public parameters: IGetDayMaxPower ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly maxSize = 148;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetDayMaxPower({
            date: buffer.getDate(),
            tariffs: buffer.getTariffsPowerMax()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters: {date, tariffs: powers}} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + COMMAND_MAX_SIZE);

        // body
        buffer.setDate(date);
        buffer.setTariffsPowerMax(powers);

        return new Uint8Array([
            COMMAND_ID,
            buffer.position,
            ...buffer.getBytesToOffset()
        ]);
    }
}

export default GetDayMaxPower;
