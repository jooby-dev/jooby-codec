import Command, {TCommandExampleList, COMMAND_HEADER_SIZE, IDlmsJsonOptions, defaultDlmsJsonOptions} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';
import {TInt32} from '../../../types.js';
import {IDate} from '../../utils/dateTime.js';


interface IGetEnergyDayPreviousResponseParameters {
    date: IDate,
    /** active A+ energy by tariffs T1-T4 */
    energies: Array<TInt32>
}


const COMMAND_ID = 0x03;
const COMMAND_SIZE = 19;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            date: {
                year: 24,
                month: 3,
                date: 22
            },
            energies: [40301230, 3334244, 2333, 2145623]
        },
        hex: {header: '03 13', body: '18 03 16 02 66 f2 ae 00 32 e0 64 00 00 09 1d 00 20 bd 57'}
    }
];

const TARIFF_NUMBER = 4;

const convertAPlusEnergyToObis = ( tariff: number = 0 ) => '1.8.x'.replace('x', tariff.toString(10));

const convertEnergiesToDlms = ( energy: Array<TInt32> ) => {
    const dlms: Record<string, number> = {};

    for ( let tariff = 0; tariff < TARIFF_NUMBER; tariff++ ) {
        const value = energy[tariff];

        if ( value || value === 0 ) {
            dlms[convertAPlusEnergyToObis(tariff + 1)] = value;
        }
    }

    return dlms;
};


/**
 * Uplink command to get active energy for a previous day by 4 tariffs (T1-T4).
 *
 * The corresponding downlink command: `GetEnergyDayPrevious`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetEnergyDayPreviousResponse from 'jooby-codec/obis-observer/commands/uplink/GetEnergyDayPreviousResponse.js';
 *
 * const commandBody = new Uint8Array([0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]);
 * const command = GetEnergyDayPreviousResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     },
 *     energies: [40301230, 3334244, 2333, 2145623]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetEnergyDayPrevious.md#response)
 */
class GetEnergyDayPreviousResponse extends Command {
    constructor ( public parameters: IGetEnergyDayPreviousResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetEnergyDayPreviousResponse({
            date: buffer.getDate(),
            energies: Array.from({length: 4}, () => buffer.getUint32())
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + this.size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setDate(parameters.date);
        parameters.energies.forEach(value => buffer.setUint32(value));

        return buffer.toUint8Array();
    }

    toJson ( {dlms}: IDlmsJsonOptions = defaultDlmsJsonOptions ) {
        const {parameters} = this;
        const {date, energies: energy} = parameters;
        const result = dlms
            ? {
                date,
                ...convertEnergiesToDlms(energy)
            }
            : parameters;

        return JSON.stringify(result);
    }
}


export default GetEnergyDayPreviousResponse;
