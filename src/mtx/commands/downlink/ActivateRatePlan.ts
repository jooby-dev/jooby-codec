import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {ITariffPlan, TARIFF_PLAN_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {TUint8} from '../../../types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ActivateRatePlanResponse from '../uplink/ActivateRatePlanResponse.js';


interface IActivateRatePlanParameters {
    /**
     * tariff table identifier
     * (`0` - table `A+`, `1` – table `A-`)
     */
    tariffTable: TUint8,

    tariffPlan: ITariffPlan
}


const COMMAND_ID = 0x13;
const COMMAND_SIZE = 1 + TARIFF_PLAN_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'set rate plan request',
        parameters: {
            tariffTable: 0,
            tariffPlan: {
                id: 1,
                tariffSet: 2,
                activateYear: 3,
                activateMonth: 4,
                activateDay: 5,
                specialProfilesArraySize: 6,
                seasonProfilesArraySize: 7,
                dayProfilesArraySize: 8
            }
        },
        hex: {header: '13 0c', body: '00 00 00 00 01 02 03 04 05 06 07 08'}
    }
];


/**
 * Downlink command to provide the date of tariff plan activation.
 *
 * The corresponding uplink command: {@link ActivateRatePlanResponse}.
 *
 * @example
 * ```js
 * import ActivateRatePlan from 'jooby-codec/mtx/commands/downlink/ActivateRatePlan.js';
 *
 * const parameters = {
 *     tariffTable: 8,
 *     tariffPlan: {
 *         id: 1,
 *         tariffSet: 2,
 *         activateYear: 3,
 *         activateMonth: 4,
 *         activateDay: 5,
 *         specialProfilesArraySize: 6,
 *         seasonProfilesArraySize: 7,
 *         dayProfilesArraySize: 8
 *     }
 * };
 * const command = new ActivateRatePlan(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 13 0c 08 00 00 00 01 02 03 04 05 06 07 08
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/ActivateRatePlan.md#request)
 */
class ActivateRatePlan extends Command {
    constructor ( public parameters: IActivateRatePlanParameters ) {
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

        return new ActivateRatePlan({
            tariffTable: buffer.getUint8(),
            tariffPlan: buffer.getTariffPlan()
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
        buffer.setTariffPlan(parameters.tariffPlan);

        return buffer.toUint8Array();
    }
}


export default ActivateRatePlan;
