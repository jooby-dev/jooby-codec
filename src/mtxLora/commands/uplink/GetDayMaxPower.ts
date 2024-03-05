import Command, {TCommandExampleList, COMMAND_HEADER_SIZE, IDlmsJsonOptions, defaultDlmsJsonOptions} from '../../Command.js';
import CommandBinaryBuffer, {IDate, TTariffsPowerMax, TARIFF_NUMBER} from '../../CommandBinaryBuffer.js';
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

const energiesToObis: Record<string, string> = {
    'A+': '1.6.x',
    'A+R+': '3.6.x',
    'A+R-': '4.6.x',
    'A-': '2.6.x',
    'A-R+': '7.6.x',
    'A-R-': '8.6.x'
};

const convertEnergyToObis = ( energy: string, tariff: number = 0 ) => {
    const obis = energiesToObis[energy];

    return obis ? obis.replace('x', tariff.toString(10)) : '';
};

const convertTariffsPowerMaxToDlms = ( energies: TTariffsPowerMax ) => {
    const dlms: Record<string, number> = {};

    for ( let tariff = 0; tariff < TARIFF_NUMBER; tariff++ ) {
        const tariffEnergies = energies[tariff];

        if ( tariffEnergies ) {
            for ( const [energy, value] of Object.entries(tariffEnergies) ) {
                if ( value || value === 0 ) {
                    dlms[convertEnergyToObis(energy, tariff + 1)] = value;
                }
            }
        }
    }

    return dlms;
};


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

    toJson ( {dlms}: IDlmsJsonOptions = defaultDlmsJsonOptions ) {
        const {parameters} = this;
        const {date, tariffs} = parameters;
        const result = dlms
            ? {
                date,
                ...convertTariffsPowerMaxToDlms(tariffs)
            }
            : parameters;

        return JSON.stringify(result);
    }
}

export default GetDayMaxPower;
