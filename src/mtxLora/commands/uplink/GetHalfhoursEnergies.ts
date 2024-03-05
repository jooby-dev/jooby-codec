import Command, {TCommandExampleList, COMMAND_HEADER_SIZE, IDlmsJsonOptions, defaultDlmsJsonOptions} from '../../Command.js';
import CommandBinaryBuffer, {IDate, THalfhoursEnergies, TARIFF_NUMBER} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


interface IGetHalfhoursEnergies {
    date: IDate
    firstHalfhour: number,
    halfhoursNumber: number,
    energies: THalfhoursEnergies
}


const COMMAND_ID = 0x6f;
const DATE_SIZE = 3; // year, month, day
const MAX_HALFHOURS_ENERGY_SIZE = 5 * 3 * 4; // 5 energy types, 3 channels, 4 bytes - energy value
const COMMAND_MAX_SIZE = DATE_SIZE + MAX_HALFHOURS_ENERGY_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'get halfhours energies',
        parameters: {
            date: {
                year: 21,
                month: 2,
                day: 3
            },
            firstHalfhour: 1,
            halfhoursNumber: 2,
            energies: {
                'A+': [0x1000, 0x2000],
                'A-R+': [0x3000, 0x4000]
            }
        },
        hex: {
            header: '6f 15',
            body: '2a 43 11 01 02 00 00 10 00 00 00 20 00 00 00 30 00 00 00 40 00'
        }
    }
];

const energiesToObis: Record<string, string> = {
    'A+': '1.5.x',
    'A+R+': '3.5.x',
    'A+R-': '4.5.x',
    'A-': '2.5.x',
    'A-R+': '6.5.x',
    'A-R-': '7.5.x'
};

const convertEnergyToObis = ( energy: string, tariff: number = 0 ) => {
    const obis = energiesToObis[energy];

    return obis ? obis.replace('x', tariff.toString(10)) : '';
};

const convertHalfhoursEnergiesToDlms = ( energies: THalfhoursEnergies ) => {
    const dlms: Record<string, number> = {};

    for ( const [energy, values] of Object.entries(energies) ) {
        for ( let tariff = 0; tariff < TARIFF_NUMBER; tariff++ ) {
            const value = (values as Array<number | undefined>)[tariff];

            if ( value || value === 0 ) {
                dlms[convertEnergyToObis(energy, tariff + 1)] = value;
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
 * import GetHalfhoursEnergies from 'jooby-codec/obis-observer/commands/uplink/GetHalfhoursEnergies.js';
 *
 * const commandBody = new Uint8Array([0x2a, 0x43, 0x01, 0x02, 0x01, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00, 0xff, 0xff, 0xff, 0xff]);
 * const command = GetHalfhoursEnergies.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     date: {
 *         year: 21,
 *         month: 2,
 *         day: 3
 *     },
 *     firstHalfhour: 1,
 *     halfhoursNumber: 2,
 *     energies: {
 *         'A+': [0x1000, 0x2000],
 *         'A-R+': [0x3000, 0x4000]
 *     }
 * }
 * ```
 */
class GetHalfhoursEnergies extends Command {
    constructor ( public parameters: IGetHalfhoursEnergies ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly maxSize = 256;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const energiesFlags = buffer.getEnergiesFlags();
        const firstHalfhour = buffer.getUint8();
        const halfhoursNumber = buffer.getUint8();

        return new GetHalfhoursEnergies({
            date,
            firstHalfhour,
            halfhoursNumber,
            energies: buffer.getHalfhoursEnergies(energiesFlags, halfhoursNumber)
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters: {date, firstHalfhour, halfhoursNumber, energies}} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + COMMAND_MAX_SIZE);

        // body
        buffer.setDate(date);
        buffer.setEnergiesFlags(energies);
        buffer.setUint8(firstHalfhour);
        buffer.setUint8(halfhoursNumber);
        buffer.setHalfhoursEnergies(energies);

        return new Uint8Array([
            COMMAND_ID,
            buffer.position,
            ...buffer.getBytesToOffset()
        ]);
    }

    toJson ( {dlms}: IDlmsJsonOptions = defaultDlmsJsonOptions ) {
        const {parameters} = this;
        const {
            date,
            firstHalfhour,
            halfhoursNumber,
            energies
        } = parameters;
        const result = dlms
            ? {
                date,
                firstHalfhour,
                halfhoursNumber,
                ...convertHalfhoursEnergiesToDlms(energies)
            }
            : parameters;

        return JSON.stringify(result);
    }
}


export default GetHalfhoursEnergies;
