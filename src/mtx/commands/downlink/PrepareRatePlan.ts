import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {TUint8, TUint32} from '../../../types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import PrepareRatePlanResponse from '../uplink/PrepareRatePlanResponse.js';


interface IPrepareRatePlanParameters {
    /**
     * tariff table identifier
     * (`0` - table `A+`, `1` – table `A-`)
     */
    tariffTable: TUint8,

    /**
     * Rate plan unique identifier.
     */
    id: TUint32
}


const COMMAND_ID = 0x14;
const COMMAND_SIZE = 5;

const examples: TCommandExampleList = [
    {
        name: 'prepare rate plan request',
        parameters: {
            tariffTable: 0,
            id: 987654321
        },
        hex: {header: '14 05', body: '00 3a de 68 b1'}
    }
];


/**
 * Downlink command to prepare device for rate plan application.
 *
 * The corresponding uplink command: {@link PrepareRatePlanResponse}.
 *
 * @example
 * ```js
 * import PrepareRatePlan from 'jooby-codec/mtx/commands/downlink/PrepareRatePlan.js';
 *
 * const parameters = {
 *     tariffTable: 0,
 *     id: 9876543210
 * };
 * const command = new PrepareRatePlan(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 14 05 00 3a de 68 b1
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/PrepareRatePlan.md#request)
 */
class PrepareRatePlan extends Command {
    constructor ( public parameters: IPrepareRatePlanParameters ) {
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

        return new PrepareRatePlan({
            tariffTable: buffer.getUint8(),
            id: buffer.getUint32()
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
        buffer.setUint32(parameters.id);

        return buffer.toUint8Array();
    }
}


export default PrepareRatePlan;
