import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {ISeasonProfile, SEASON_PROFILE_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {TUint8} from '../../../types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SetSeasonProfileResponse from '../uplink/SetSeasonProfileResponse.js';


interface ISetSeasonProfileParameters extends ISeasonProfile {
    /**
     * tariff table identifier
     * (`0` - table `A+`, `1` – table `A-`)
     */
    tariffTable: TUint8,

    /**
     * Season profile index in a list of all tariff seasons (max `14`).
     */
    index: TUint8
}


const COMMAND_ID = 0x11;
const COMMAND_SIZE = 2 + SEASON_PROFILE_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'set default season profile',
        parameters: {
            tariffTable: 1,
            index: 8,
            month: 1,
            date: 1,
            dayIndexes: [0, 0, 0, 0, 0, 0, 0]
        },
        hex: {header: '11 0b', body: '01 08 01 01 00 00 00 00 00 00 00'}
    },
    {
        name: 'set some season profile',
        parameters: {
            tariffTable: 0,
            index: 2,
            month: 5,
            date: 9,
            dayIndexes: [0, 1, 2, 3, 4, 5, 6]
        },
        hex: {header: '11 0b', body: '00 02 05 09 00 01 02 03 04 05 06'}
    }
];


/**
 * Downlink command to set season profile information for the given tariff table.
 *
 * The corresponding uplink command: {@link SetSeasonProfileResponse}.
 *
 * @example
 * ```js
 * import SetSeasonProfile from 'jooby-codec/mtx/commands/downlink/SetSeasonProfile.js';
 *
 * const parameters = {
 *     tariffTable: 1,
 *     index: 8,
 *     month: 1,
 *     date: 1,
 *     dayIndexes: [0, 0, 0, 0, 0, 0, 0]
 * };
 * const command = new SetSeasonProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 11 0b 01 08 01 01 00 00 00 00 00 00 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetSeasonProfile.md#request)
 */
class SetSeasonProfile extends Command {
    constructor ( public parameters: ISetSeasonProfileParameters ) {
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

        return new SetSeasonProfile({
            tariffTable: buffer.getUint8(),
            index: buffer.getUint8(),
            ...buffer.getSeasonProfile()
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
        buffer.setSeasonProfile(parameters);

        return buffer.toUint8Array();
    }
}


export default SetSeasonProfile;
