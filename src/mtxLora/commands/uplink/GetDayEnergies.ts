import Command, {TCommandExampleList, COMMAND_HEADER_SIZE, IDlmsJsonOptions, defaultDlmsJsonOptions} from '../../Command.js';
import CommandBinaryBuffer, {IDate, TTariffsEnergies, TARIFF_NUMBER} from '../../CommandBinaryBuffer.js';
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
            header: '78 08',
            body: '2a 43 11 11 10 00 20 00'
        }
    }
];

const energiesToObis: Record<string, string> = {
    'A+': '1.8.x',
    'A+R+': '3.8.x',
    'A+R-': '4.8.x',
    'A-': '2.8.x',
    'A-R+': '7.8.x',
    'A-R-': '8.8.x'
};

const convertEnergyToObis = ( energy: string, tariff: number = 0 ) => {
    const obis = energiesToObis[energy];

    return obis ? obis.replace('x', tariff.toString(10)) : '';
};

const convertTariffsEnergiesToDlms = ( energies: TTariffsEnergies ) => {
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
 * import GetDayEnergies from 'jooby-codec/obis-observer/commands/uplink/GetDayEnergies.js';
 *
 * const commandBody = new Uint8Array([0x2a, 0x43, 0x11, 0x11, 0x10, 0x00, 0x20, 0x00]);
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

    static readonly maxSize = 100;


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

    toJson ( {dlms}: IDlmsJsonOptions = defaultDlmsJsonOptions ) {
        const {parameters} = this;
        const {date, energies} = parameters;
        const result = dlms
            ? {
                date,
                ...convertTariffsEnergiesToDlms(energies)
            }
            : parameters;

        return JSON.stringify(result);
    }
}


export default GetDayEnergies;
